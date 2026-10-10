/**
 * Camera Stream Manager
 * Manages native navigator.mediaDevices.getUserMedia with fallback to
 * high-fidelity animated synthetic camera feed if camera is unavailable in test environment.
 */

export interface CameraStreamResult {
  stream: MediaStream;
  isSimulated: boolean;
  hasTorch: boolean;
  stop: () => void;
  toggleTorch: (enabled: boolean) => Promise<boolean>;
}

export async function initCameraStream(
  facingMode: 'user' | 'environment' = 'environment',
  targetWidth = 1920,
  targetHeight = 1080
): Promise<CameraStreamResult> {
  // Try real getUserMedia first
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: targetWidth },
          height: { ideal: targetHeight },
        },
        audio: true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const videoTrack = stream.getVideoTracks()[0];

      // Check torch capability
      let hasTorch = false;
      if (videoTrack) {
        const capabilities = videoTrack.getCapabilities ? (videoTrack.getCapabilities() as { torch?: boolean }) : {};
        hasTorch = !!capabilities.torch;
      }

      const toggleTorch = async (enabled: boolean): Promise<boolean> => {
        if (!videoTrack) return false;
        try {
          const trackAny = videoTrack as unknown as {
            applyConstraints: (c: { advanced: Array<{ torch?: boolean }> }) => Promise<void>;
          };
          if (trackAny.applyConstraints) {
            await trackAny.applyConstraints({
              advanced: [{ torch: enabled }],
            });
            return true;
          }
        } catch (e) {
          console.warn('Torch not supported on track', e);
        }
        return false;
      };

      const stop = () => {
        stream.getTracks().forEach((t) => t.stop());
      };

      return {
        stream,
        isSimulated: false,
        hasTorch,
        stop,
        toggleTorch,
      };
    } catch (err) {
      console.warn('Real camera not available or permission denied, using live simulator stream', err);
    }
  }

  // Fallback: Animated Synthetic Live Viewfinder Stream
  return createSimulatedCameraStream(facingMode, targetWidth, targetHeight);
}

/**
 * Creates a synthetic animated canvas MediaStream for environments without camera access
 */
function createSimulatedCameraStream(
  facingMode: 'user' | 'environment',
  width = 1280,
  height = 720
): CameraStreamResult {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  let animationFrameId: number;
  let startTime = Date.now();
  let torchActive = false;

  const renderScene = () => {
    const elapsed = (Date.now() - startTime) / 1000;
    const cx = width / 2;
    const cy = height / 2;

    // Background gradient (simulated outdoor landscape or studio room)
    const grad = ctx.createLinearGradient(0, 0, width, height);
    if (torchActive) {
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.3, '#ca8a04');
      grad.addColorStop(1, '#854d0e');
    } else if (facingMode === 'environment') {
      // Outdoor landscape simulation
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.4, '#1e293b');
      grad.addColorStop(0.7, '#334155');
      grad.addColorStop(1, '#1e1b4b');
    } else {
      // Warm indoor portrait backdrop
      grad.addColorStop(0, '#3f2c20');
      grad.addColorStop(0.5, '#2e1c12');
      grad.addColorStop(1, '#1a0e08');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle moving optical bokeh orbs
    for (let i = 0; i < 7; i++) {
      const orbX = cx + Math.sin(elapsed * 0.7 + i * 1.2) * (width * 0.35);
      const orbY = cy + Math.cos(elapsed * 0.5 + i * 1.4) * (height * 0.3);
      const radius = 60 + Math.sin(elapsed + i) * 30;

      const orbGrad = ctx.createRadialGradient(orbX, orbY, 5, orbX, orbY, radius);
      orbGrad.addColorStop(0, 'rgba(251, 191, 36, 0.25)');
      orbGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');

      ctx.fillStyle = orbGrad;
      ctx.beginPath();
      ctx.arc(orbX, orbY, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Grid lines for rule of thirds
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    // vertical
    ctx.beginPath();
    ctx.moveTo(width / 3, 0);
    ctx.lineTo(width / 3, height);
    ctx.moveTo((width * 2) / 3, 0);
    ctx.lineTo((width * 2) / 3, height);
    // horizontal
    ctx.moveTo(0, height / 3);
    ctx.lineTo(width, height / 3);
    ctx.moveTo(0, (height * 2) / 3);
    ctx.lineTo(width, (height * 2) / 3);
    ctx.stroke();

    // Central focus reticle
    const pulse = Math.sin(elapsed * 3) * 6;
    ctx.strokeStyle = torchActive ? '#facc15' : '#22c55e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 40 + pulse, 0, Math.PI * 2);
    ctx.stroke();

    // Corner brackets around center
    const bLen = 14;
    const bOff = 50;
    ctx.beginPath();
    ctx.moveTo(cx - bOff, cy - bOff + bLen);
    ctx.lineTo(cx - bOff, cy - bOff);
    ctx.lineTo(cx - bOff + bLen, cy - bOff);

    ctx.moveTo(cx + bOff - bLen, cy - bOff);
    ctx.lineTo(cx + bOff, cy - bOff);
    ctx.lineTo(cx + bOff, cy - bOff + bLen);

    ctx.moveTo(cx - bOff, cy + bOff - bLen);
    ctx.lineTo(cx - bOff, cy + bOff);
    ctx.lineTo(cx - bOff + bLen, cy + bOff);

    ctx.moveTo(cx + bOff - bLen, cy + bOff);
    ctx.lineTo(cx + bOff, cy + bOff);
    ctx.lineTo(cx + bOff, cy + bOff - bLen);
    ctx.stroke();

    // Lens HUD info text
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px monospace';
    ctx.fillText(
      `SENSOR: ${facingMode.toUpperCase()} CAM • F/1.8 • ISO 200`,
      24,
      height - 40
    );

    const now = new Date();
    ctx.fillText(
      `LIVE: ${now.toLocaleTimeString()} .${Math.floor((now.getMilliseconds() / 100))}`,
      24,
      height - 20
    );

    if (torchActive) {
      ctx.fillStyle = '#eab308';
      ctx.fillText('⚡ TORCH ILLUMINATION ACTIVE', width - 260, height - 20);
    }

    animationFrameId = requestAnimationFrame(renderScene);
  };

  renderScene();

  const stream = canvas.captureStream(30);

  // Add dummy silent audio track for MediaRecorder compatibility
  try {
    const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const dest = audioCtx.createMediaStreamDestination();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    gain.gain.value = 0; // silence
    osc.connect(gain);
    gain.connect(dest);
    osc.start();
    const audioTrack = dest.stream.getAudioTracks()[0];
    if (audioTrack) {
      stream.addTrack(audioTrack);
    }
  } catch (e) {
    console.warn('Audio context mock not available', e);
  }

  const stop = () => {
    cancelAnimationFrame(animationFrameId);
    stream.getTracks().forEach((t) => t.stop());
  };

  const toggleTorch = async (enabled: boolean): Promise<boolean> => {
    torchActive = enabled;
    return true;
  };

  return {
    stream,
    isSimulated: true,
    hasTorch: true,
    stop,
    toggleTorch,
  };
}
