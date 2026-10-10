import React, { useRef, useEffect, useState } from 'react';
import {
  Zap,
  ZapOff,
  SwitchCamera,
  Pause,
  Play,
  Camera as CameraIcon,
  Video as VideoIcon,
  Folder
} from 'lucide-react';
import { AppSettings, CameraMode, MediaItem, PictureSize } from '../types';
import { PICTURE_SIZES } from '../constants';
import { drawFrameOnCanvas } from '../utils/frames';
import { playCameraShutterSound, playCountdownBeep, playRecordSound } from '../utils/audio';
import { CameraStreamResult, initCameraStream } from '../utils/cameraStream';

interface CameraViewProps {
  mode: CameraMode;
  onSetMode: (mode: CameraMode) => void;
  settings: AppSettings;
  isRotated: boolean;
  selectedFrameId: string;
  onCapturePhoto: (dataUrl: string, width: number, height: number) => void;
  onFinishVideo: (videoBlob: Blob, durationSeconds: number, durationFormatted: string) => void;
  lastSavedMedia: MediaItem | null;
  onOpenMediaViewer: () => void;
  onOpenRecents: () => void;
  totalMediaCount?: number;
}

export const CameraView: React.FC<CameraViewProps> = ({
  mode,
  onSetMode,
  settings,
  isRotated,
  selectedFrameId,
  onCapturePhoto,
  onFinishVideo,
  lastSavedMedia,
  onOpenMediaViewer,
  onOpenRecents,
  totalMediaCount = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [streamObj, setStreamObj] = useState<CameraStreamResult | null>(null);

  // Video recording states
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0); // seconds
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);

  // Photo countdown delay state
  const [countdownValue, setCountdownValue] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);

  // Active picture size spec
  const currentPictureSize: PictureSize =
    PICTURE_SIZES.find((s) => s.id === settings.pictureSize) || PICTURE_SIZES[1];

  // Initialize camera stream
  useEffect(() => {
    let active = true;

    async function setupStream() {
      if (streamObj) {
        streamObj.stop();
      }

      const res = await initCameraStream(
        facingMode,
        currentPictureSize.width,
        currentPictureSize.height
      );

      if (!active) {
        res.stop();
        return;
      }

      setStreamObj(res);
      if (videoRef.current) {
        videoRef.current.srcObject = res.stream;
        videoRef.current.play().catch((e) => console.warn('Video play error:', e));
      }
    }

    setupStream();

    return () => {
      active = false;
    };
  }, [facingMode, settings.pictureSize]);

  // Handle Resize of Viewfinder to keep Canvas size 1:1 with screen
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && overlayCanvasRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        overlayCanvasRef.current.width = rect.width;
        overlayCanvasRef.current.height = rect.height;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (streamObj) {
        streamObj.stop();
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [streamObj]);

  // Handle Flashlight Toggle
  const toggleFlashlight = async () => {
    const nextState = !flashlightOn;
    setFlashlightOn(nextState);
    if (streamObj) {
      await streamObj.toggleTorch(nextState);
    }
  };

  // Flip Camera
  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Video recording timer
  useEffect(() => {
    if (isRecording && !isPaused) {
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording, isPaused]);

  // Render live overlay frames on overlay canvas
  useEffect(() => {
    let animId: number;

    const renderOverlay = () => {
      const canvas = overlayCanvasRef.current;
      if (canvas && videoRef.current) {
        const width = canvas.width;
        const height = canvas.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, width, height);
          drawFrameOnCanvas(ctx, width, height, selectedFrameId, mode, recordingDuration);
        }
      }
      animId = requestAnimationFrame(renderOverlay);
    };

    renderOverlay();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [selectedFrameId, mode, recordingDuration]);

  // Format recording seconds to hour. Minutes.seconds (00.00.00)
  const formatTime = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSecs % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSecs % 60).toString().padStart(2, '0');
    return `${h}.${m}.${s}`;
  };

  // Trigger taking a photo
  const executePhotoSnap = () => {
    if (settings.shutterSound) {
      playCameraShutterSound();
    }

    // Flash animation
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 180);

    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = currentPictureSize.width;
    canvas.height = currentPictureSize.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw video feed
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Bake selected frame onto the captured photo
    drawFrameOnCanvas(ctx, canvas.width, canvas.height, selectedFrameId, 'photo', 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    onCapturePhoto(dataUrl, canvas.width, canvas.height);
  };

  // Start Photo capture process (handles delay countdown)
  const handlePhotoCaptureClick = () => {
    if (countdownValue !== null) return; // already counting

    let delaySeconds = 0;
    if (settings.delayCapture === '3s') delaySeconds = 3;
    else if (settings.delayCapture === '5s') delaySeconds = 5;
    else if (settings.delayCapture === '10s') delaySeconds = 10;

    if (delaySeconds === 0) {
      executePhotoSnap();
      return;
    }

    // Run countdown
    setCountdownValue(delaySeconds);
    playCountdownBeep(false);

    let count = delaySeconds;
    const timer = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdownValue(count);
        playCountdownBeep(false);
      } else {
        clearInterval(timer);
        setCountdownValue(null);
        playCountdownBeep(true);
        executePhotoSnap();
      }
    }, 1000);
  };

  // Start Video Recording
  const startRecording = () => {
    if (!streamObj) return;

    playRecordSound(true);
    recordedChunksRef.current = [];
    setRecordingDuration(0);
    setIsPaused(false);

    // Create mixed stream with frame overlay if a frame is active
    let recordingStream = streamObj.stream;
    const canvas = overlayCanvasRef.current;
    const video = videoRef.current;

    if (selectedFrameId && selectedFrameId !== 'none' && canvas && video) {
      // Record from composite canvas
      const compCanvas = document.createElement('canvas');
      compCanvas.width = 1280;
      compCanvas.height = 720;
      const compCtx = compCanvas.getContext('2d')!;

      let frameLoop = true;
      const drawComp = () => {
        if (!frameLoop) return;
        compCtx.drawImage(video, 0, 0, compCanvas.width, compCanvas.height);
        drawFrameOnCanvas(
          compCtx,
          compCanvas.width,
          compCanvas.height,
          selectedFrameId,
          'video',
          recordingDuration
        );
        requestAnimationFrame(drawComp);
      };
      drawComp();

      const canvasStream = compCanvas.captureStream(30);
      const audioTrack = streamObj.stream.getAudioTracks()[0];
      if (audioTrack) {
        canvasStream.addTrack(audioTrack);
      }
      recordingStream = canvasStream;
    }

    try {
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : MediaRecorder.isTypeSupported('video/webm')
          ? 'video/webm'
          : 'video/mp4';

      const mr = new MediaRecorder(recordingStream, { mimeType });
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      mr.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        const durFormatted = formatTime(recordingDuration);
        onFinishVideo(blob, recordingDuration, durFormatted);
        setIsRecording(false);
        setIsPaused(false);
      };

      mr.start(1000);
      mediaRecorderRef.current = mr;
      setIsRecording(true);
    } catch (err) {
      console.warn('Error starting MediaRecorder', err);
    }
  };

  // Pause / Resume Video Recording
  const handleTogglePause = () => {
    if (!mediaRecorderRef.current) return;
    if (isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    } else {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  // Stop Video Recording
  const handleStopRecording = () => {
    if (!mediaRecorderRef.current) return;
    playRecordSound(false);
    mediaRecorderRef.current.stop();
  };

  return (
    <main className="relative flex-1 w-full h-full bg-white flex flex-col justify-between overflow-hidden">
      {/* Visual Flash overlay when photo is taken */}
      {isFlashing && (
        <div className="absolute inset-0 bg-white z-50 pointer-events-none animate-out fade-out duration-200" />
      )}

      {/* Viewfinder Main Container: FILLS THE WHOLE SCREEN BETWEEN HEADER AND FOOTER */}
      <div
        ref={containerRef}
        className="relative flex-1 w-full h-full bg-black overflow-hidden select-none"
      >
        {/* Video Stream Element fills 100% of the screen */}
        <video
          ref={videoRef}
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover select-none transition-transform duration-300 ${
            isRotated ? 'rotate-90 scale-125' : ''
          }`}
        />

        {/* Frame & HUD overlay canvas filling 100% */}
        <canvas
          ref={overlayCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
        />

        {/* Flashlight Torch Glow simulation over entire viewport */}
        {flashlightOn && (
          <div className="absolute inset-0 bg-amber-200/20 pointer-events-none mix-blend-screen z-10" />
        )}

        {/* Top Interface Buttons Row (inside interface just before top bar) */}
        <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-3 sm:p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto">
          {/* 2 buttons left aligned with OVER 90% ROUNDED CORNERS (rounded-full):
              'Live photo' on left side
              'Video' on right side */}
          <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/20 shadow-md">
            {/* Live photo button (over 90% rounded corners) */}
            <button
              type="button"
              onClick={() => {
                if (!isRecording) onSetMode('photo');
              }}
              disabled={isRecording}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold transition shadow-xs ${
                mode === 'photo'
                  ? 'bg-white text-[#4a2e18]'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <CameraIcon className="w-3.5 h-3.5" />
              <span>Live photo</span>
            </button>

            {/* Video button (over 90% rounded corners) */}
            <button
              type="button"
              onClick={() => {
                if (!isRecording) onSetMode('video');
              }}
              disabled={isRecording}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold transition shadow-xs ${
                mode === 'video'
                  ? 'bg-white text-[#4a2e18]'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <VideoIcon className="w-3.5 h-3.5" />
              <span>Video</span>
            </button>
          </div>

          {/* Right side inside interface:
              Flash light button & Flip camera button (rounded-full) */}
          <div className="flex items-center space-x-2">
            {/* Flash light button */}
            <button
              type="button"
              onClick={toggleFlashlight}
              className={`p-2.5 rounded-full border transition backdrop-blur-md shadow-md ${
                flashlightOn
                  ? 'bg-amber-400 text-[#4a2e18] border-amber-300'
                  : 'bg-black/40 text-white border-white/20 hover:bg-black/60'
              }`}
              title={flashlightOn ? 'Flashlight ON' : 'Flashlight OFF'}
              aria-label="Flashlight"
            >
              {flashlightOn ? (
                <Zap className="w-4 h-4 fill-amber-300" />
              ) : (
                <ZapOff className="w-4 h-4" />
              )}
            </button>

            {/* Flip camera button */}
            <button
              type="button"
              onClick={handleFlipCamera}
              disabled={isRecording}
              className="p-2.5 rounded-full bg-black/40 text-white border border-white/20 hover:bg-black/60 transition backdrop-blur-md shadow-md"
              title={`Switch camera (currently: ${facingMode})`}
              aria-label="Flip camera"
            >
              <SwitchCamera className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Countdown Overlay if delay capture is running */}
        {countdownValue !== null && (
          <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-xs flex items-center justify-center">
            <div className="w-28 h-28 rounded-full border-4 border-amber-400 bg-[#4a2e18]/90 flex items-center justify-center text-white text-6xl font-black font-mono shadow-2xl animate-ping-once">
              {countdownValue}
            </div>
          </div>
        )}

        {/* Live broadcast / sharing badge over viewfinder if sharing */}
        {settings.connectionType === 'send' && settings.selectedSendDevices.length > 0 && (
          <div className="absolute bottom-4 left-4 z-30 bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full flex items-center space-x-2 text-[11px] font-bold text-white shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              LIVE CAST: {settings.connectionMethod.toUpperCase()} ({settings.selectedSendDevices.length} devices)
            </span>
          </div>
        )}
      </div>

      {/* Footer & Bottom Controls Row (Reduced size, mobile optimized)
          "footer and the entire screen should have same (white) automatic color,
          only that the top bar and the footer are separated from the main screen by dark brown border." */}
      <footer className="w-full bg-white border-t-2 border-[#4a2e18] py-2 px-3 sm:px-6 z-30 select-none">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          {/* Left of capturing button:
              1. Saved preview in rounded thumbnail
              2. Or time display of video (hour. Minutes.seconds: 00.00.00) when recording */}
          <div className="flex items-center space-x-2 w-1/3 justify-start">
            {mode === 'video' && isRecording ? (
              <div className="flex items-center space-x-1.5 bg-stone-100 border border-[#4a2e18]/30 px-2.5 py-1.5 rounded-full shadow-inner">
                <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-500' : 'bg-red-600 animate-pulse'}`} />
                <span className="font-mono font-bold text-xs sm:text-sm text-[#4a2e18] tracking-wider">
                  {formatTime(recordingDuration)}
                </span>
                {isPaused && (
                  <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1 py-0.5 rounded-full">
                    PAUSED
                  </span>
                )}
              </div>
            ) : (
              /* Saved photo or video thumbnail */
              lastSavedMedia ? (
                <div
                  onClick={onOpenMediaViewer}
                  role="button"
                  tabIndex={0}
                  className="group relative w-12 h-12 rounded-full border-2 border-[#4a2e18] overflow-hidden bg-stone-100 shadow-sm cursor-pointer hover:ring-2 hover:ring-[#4a2e18]/40 transition"
                  title="Click to view saved media"
                >
                  {lastSavedMedia.type === 'photo' ? (
                    <img
                      src={lastSavedMedia.url}
                      alt="Saved Preview"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  ) : (
                    <div className="w-full h-full relative bg-stone-900">
                      <video
                        src={lastSavedMedia.url}
                        className="w-full h-full object-cover opacity-85"
                      />
                      {lastSavedMedia.durationFormatted && (
                        <span className="absolute bottom-0.5 right-0.5 text-[7px] font-mono font-bold bg-black/80 text-white px-1 py-0.2 rounded-full leading-none">
                          {lastSavedMedia.durationFormatted}
                        </span>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-3 h-3 text-white fill-white/80" />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full border-2 border-stone-200 bg-stone-50 flex flex-col items-center justify-center text-stone-400">
                  <CameraIcon className="w-4 h-4" />
                  <span className="text-[7px] font-bold mt-0.5">EMPTY</span>
                </div>
              )
            )}
          </div>

          {/* Middle position:
              Capturing button, and adjusted to the left a bit on its right side is the stop red button */}
          <div className="flex items-center justify-center w-1/3 relative">
            <div className="flex items-center justify-center">
              {mode === 'photo' ? (
                /* Photo capturing button: green with white thick border round dot */
                <button
                  type="button"
                  onClick={handlePhotoCaptureClick}
                  className="w-16 h-16 rounded-full border-4 border-white bg-green-500 shadow-lg ring-3 ring-[#4a2e18]/20 hover:bg-green-600 active:scale-95 transition flex items-center justify-center cursor-pointer"
                  title={
                    settings.delayCapture !== 'off'
                      ? `Take photo (${settings.delayCapture} delay)`
                      : 'Take photo'
                  }
                  aria-label="Capture photo"
                >
                  <span className="w-6 h-6 rounded-full bg-white shadow-xs" />
                </button>
              ) : (
                /* Video mode */
                !isRecording ? (
                  /* Initial state: green with white thick border round dot */
                  <button
                    type="button"
                    onClick={startRecording}
                    className="w-16 h-16 rounded-full border-4 border-white bg-green-500 shadow-lg ring-3 ring-[#4a2e18]/20 hover:bg-green-600 active:scale-95 transition flex items-center justify-center cursor-pointer"
                    title="Start video recording"
                    aria-label="Start recording"
                  >
                    <span className="w-6 h-6 rounded-full bg-white shadow-xs" />
                  </button>
                ) : (
                  /* During video recording: capturing button + red stop button adjusted closer to left */
                  <div className="flex items-center">
                    {/* Capture button changes shape to 2 thick short lines (pause) button for pulse */}
                    <button
                      type="button"
                      onClick={handleTogglePause}
                      className="w-16 h-16 rounded-full border-4 border-white bg-amber-500 shadow-lg ring-3 ring-[#4a2e18]/20 hover:bg-amber-600 active:scale-95 transition flex items-center justify-center cursor-pointer text-white"
                      title={isPaused ? 'Resume video' : 'Pause video (pulse)'}
                      aria-label={isPaused ? 'Resume video' : 'Pause video'}
                    >
                      {isPaused ? (
                        <Play className="w-7 h-7 fill-white ml-0.5" />
                      ) : (
                        /* 2 thick short lines (pause) */
                        <div className="flex space-x-1.5 items-center justify-center">
                          <div className="w-2 h-6 bg-white rounded-full" />
                          <div className="w-2 h-6 bg-white rounded-full" />
                        </div>
                      )}
                    </button>

                    {/* Stop button (red colored with small square) adjusted to the left a bit, right beside the capture button! */}
                    <button
                      type="button"
                      onClick={handleStopRecording}
                      className="ml-2.5 w-11 h-11 rounded-full bg-red-600 hover:bg-red-700 text-white border-2 border-white shadow-md active:scale-95 transition flex items-center justify-center cursor-pointer shrink-0"
                      title="Stop video capturing"
                      aria-label="Stop video recording"
                    >
                      <span className="w-4 h-4 bg-white rounded-xs" />
                    </button>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Right side of the footer:
              'Recents' button on the right side of the footer */}
          <div className="flex items-center space-x-2 w-1/3 justify-end">
            <button
              type="button"
              onClick={onOpenRecents}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-[#4a2e18]/25 bg-stone-50 hover:bg-amber-50 active:bg-amber-100 text-[#4a2e18] text-xs font-bold transition shadow-2xs"
              title="Open Recents (Photos and Videos folders)"
            >
              <Folder className="w-3.5 h-3.5 fill-amber-300 text-[#4a2e18]" />
              <span>Recents</span>
              {totalMediaCount > 0 && (
                <span className="text-[10px] bg-[#4a2e18] text-white px-1.5 py-0.2 rounded-full font-mono">
                  {totalMediaCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
};
