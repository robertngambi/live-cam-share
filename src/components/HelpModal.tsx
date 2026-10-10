import React from 'react';
import { X, HelpCircle, Camera, Video, Zap, RotateCw, Share2, Settings, HardDrive } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border-2 border-[#4a2e18] rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden text-[#4a2e18]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b-2 border-[#4a2e18] flex items-center justify-between bg-stone-50">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-[#4a2e18]" />
            <h2 className="text-base font-bold text-[#4a2e18]">App User Guide & Help</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-500 hover:text-[#4a2e18] hover:bg-stone-200/60 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs leading-relaxed text-stone-700 flex-1">
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <p className="font-semibold text-stone-800">
              Welcome to Live Share Camera! Here is a step-by-step guide on how to go about using each feature.
            </p>
          </div>

          <div className="space-y-3.5">
            {/* 1. Photo & Video */}
            <div className="flex items-start space-x-3">
              <div className="w-7 h-7 rounded-md bg-stone-100 border border-stone-300 flex items-center justify-center shrink-0">
                <Camera className="w-4 h-4 text-[#4a2e18]" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-xs">Switching Modes</h4>
                <p className="text-stone-600 mt-0.5">
                  Tap <strong>'Live photo'</strong> on the top left of the viewfinder for taking still photos, or tap{' '}
                  <strong>'Video'</strong> for live video streaming and recording.
                </p>
              </div>
            </div>

            {/* 2. Flashlight & Flip */}
            <div className="flex items-start space-x-3">
              <div className="w-7 h-7 rounded-md bg-stone-100 border border-stone-300 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-[#4a2e18]" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-xs">Flashlight & Flip Camera</h4>
                <p className="text-stone-600 mt-0.5">
                  Tap the flash icon on the top right inside the interface to illuminate dark scenes. Tap the flip camera
                  icon beside it to toggle between rear and selfie cameras.
                </p>
              </div>
            </div>

            {/* 3. Capturing & Video controls */}
            <div className="flex items-start space-x-3">
              <div className="w-7 h-7 rounded-md bg-stone-100 border border-stone-300 flex items-center justify-center shrink-0">
                <Video className="w-4 h-4 text-[#4a2e18]" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-xs">Capturing Photos & Recording Videos</h4>
                <p className="text-stone-600 mt-0.5">
                  Tap the central green round button to capture a photo or start recording. During video recording, tap
                  the 2 thick short lines (pause) button to pause/resume. Tap the red square stop button to finish. A
                  dialog will prompt you to click 'OK' to save or 'Cancel'.
                </p>
              </div>
            </div>

            {/* 4. Rotating the screen */}
            <div className="flex items-start space-x-3">
              <div className="w-7 h-7 rounded-md bg-stone-100 border border-stone-300 flex items-center justify-center shrink-0">
                <RotateCw className="w-4 h-4 text-[#4a2e18]" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-xs">Rotating / Unrotating the Screen</h4>
                <p className="text-stone-600 mt-0.5">
                  In the top bar, tap the <strong>Rotate</strong> button to lock or manually rotate your camera feed
                  into landscape mode. Tap <strong>Unrotate</strong> to revert back.
                </p>
              </div>
            </div>

            {/* 5. Device Connections & Sharing */}
            <div className="flex items-start space-x-3">
              <div className="w-7 h-7 rounded-md bg-stone-100 border border-stone-300 flex items-center justify-center shrink-0">
                <Share2 className="w-4 h-4 text-[#4a2e18]" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-xs">Live Device Sharing (USB, Bluetooth, Wi-Fi)</h4>
                <p className="text-stone-600 mt-0.5">
                  Check the top bar connection indicator. In <strong>Settings &gt; Connections</strong>, select your
                  transport: Via USB, Via Bluetooth, or Via Wi-Fi. Choose <strong>Send</strong> to stream your camera
                  to up to 3 selected target devices (the upload icon blinks in the top bar while streaming). Or choose{' '}
                  <strong>Receive</strong> to view an incoming stream from another device.
                </p>
              </div>
            </div>

            {/* 6. Frames & Storage */}
            <div className="flex items-start space-x-3">
              <div className="w-7 h-7 rounded-md bg-stone-100 border border-stone-300 flex items-center justify-center shrink-0">
                <Settings className="w-4 h-4 text-[#4a2e18]" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-xs">Frames, Delay & Storage</h4>
                <p className="text-stone-600 mt-0.5">
                  Open <strong>Frames</strong> from the top menu to select creative photo and video frames that get
                  burned directly into your media files. In <strong>Settings</strong>, customize delay timer (Off, 3s,
                  5s, 10s), select picture resolutions, and pick between internal memory and SD card storage.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer (Over 90% rounded corners button) */}
        <div className="px-5 py-3 border-t-2 border-[#4a2e18] bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#4a2e18] text-white rounded-full font-semibold text-xs hover:bg-[#382212] transition shadow-sm"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
