import React from 'react';
import { X, ShieldCheck, Share2, Sparkles, Smartphone, Wifi, Radio } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border-2 border-[#4a2e18] rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden text-[#4a2e18]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b-2 border-[#4a2e18] flex items-center justify-between bg-stone-50">
          <div className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-[#4a2e18]" />
            <h2 className="text-base font-bold text-[#4a2e18]">About Live Share Camera</h2>
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
          <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200 text-[#4a2e18]">
            <h3 className="font-bold text-sm mb-1">Live Share Camera Workstation</h3>
            <p>
              Live Share Camera is an integrated high-definition live photo capturing, continuous video
              recording, and real-time screen/camera stream transmission application.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#4a2e18] mb-2">Key Advantages</h4>
            <div className="space-y-2.5">
              <div className="flex items-start space-x-2.5">
                <Share2 className="w-4 h-4 text-[#4a2e18] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900">Multi-Channel Sharing:</span>
                  <p className="text-stone-600">
                    Instantly cast your camera viewfinder and microphone audio feed across USB, Bluetooth,
                    or Wi-Fi to up to 3 connected devices simultaneously with zero setup hassle.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Sparkles className="w-4 h-4 text-[#4a2e18] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900">Live Framed Recording:</span>
                  <p className="text-stone-600">
                    Apply artistic photo borders or professional broadcast HUD overlays that are baked directly into
                    the saved photo or video output files.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Smartphone className="w-4 h-4 text-[#4a2e18] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900">Bidirectional Send & Receive:</span>
                  <p className="text-stone-600">
                    Act as either a master camera broadcaster or a remote studio monitor by switching between
                    Send and Receive modes on the fly.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-[#4a2e18] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900">Dual Storage Management:</span>
                  <p className="text-stone-600">
                    Real-time monitoring of internal memory and external SD card space in MBs, ensuring safe
                    captures without running out of capacity.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <span className="font-bold text-stone-900 block mb-1">Version & Compatibility</span>
            <p className="text-stone-500">
              Live Share Camera v2.4 • WebRTC 1.0 • HTML5 MediaStream • Optimized for Mobile & Desktop.
            </p>
          </div>
        </div>

        {/* Footer (Over 90% rounded corners button) */}
        <div className="px-5 py-3 border-t-2 border-[#4a2e18] bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#4a2e18] text-white rounded-full font-semibold text-xs hover:bg-[#382212] transition shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
