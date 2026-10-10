import React from 'react';
import { X, Check, Sparkles, Film, Image as ImageIcon } from 'lucide-react';
import { CameraMode, FrameOption } from '../types';
import { PHOTO_FRAMES, VIDEO_FRAMES } from '../utils/frames';

interface FramesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: CameraMode;
  selectedFrameId: string;
  onSelectFrame: (frameId: string) => void;
}

export const FramesModal: React.FC<FramesModalProps> = ({
  isOpen,
  onClose,
  currentMode,
  selectedFrameId,
  onSelectFrame,
}) => {
  if (!isOpen) return null;

  const frames = currentMode === 'photo' ? PHOTO_FRAMES : VIDEO_FRAMES;
  const isPhotoMode = currentMode === 'photo';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border-2 border-[#4a2e18] rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b-2 border-[#4a2e18] flex items-center justify-between bg-stone-50">
          <div className="flex items-center space-x-2">
            {isPhotoMode ? (
              <ImageIcon className="w-5 h-5 text-[#4a2e18]" />
            ) : (
              <Film className="w-5 h-5 text-[#4a2e18]" />
            )}
            <h2 className="text-base font-bold text-[#4a2e18]">
              {isPhotoMode ? 'Picture Frames (Photo Mode)' : 'Broadcast Frames (Video Mode)'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-500 hover:text-[#4a2e18] hover:bg-stone-200/60 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Note / instruction */}
        <div className="px-5 py-2.5 bg-amber-50/70 border-b border-stone-200 text-xs text-[#4a2e18] flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            Select a frame below to preview it live. It will be burned together into your captured{' '}
            {isPhotoMode ? 'photo' : 'video'} upon saving.
          </span>
        </div>

        {/* Frames List Grid */}
        <div className="p-4 overflow-y-auto space-y-3 divide-y divide-stone-100 flex-1">
          {frames.map((frame: FrameOption) => {
            const isSelected = selectedFrameId === frame.id;
            return (
              <div
                key={frame.id}
                onClick={() => {
                  onSelectFrame(frame.id);
                }}
                role="button"
                tabIndex={0}
                className={`pt-3 first:pt-0 group flex items-start justify-between p-3 rounded-2xl border cursor-pointer transition ${
                  isSelected
                    ? 'border-[#4a2e18] bg-amber-50/50 shadow-sm'
                    : 'border-stone-200 hover:border-stone-400 bg-white'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className="w-12 h-12 rounded-xl border flex items-center justify-center font-bold text-xs shrink-0 shadow-inner"
                    style={{
                      borderColor: frame.accentColor || '#4a2e18',
                      backgroundColor: isSelected ? '#fef3c7' : '#f9fafb',
                      color: frame.accentColor || '#4a2e18',
                    }}
                  >
                    {frame.id === 'none' ? 'None' : frame.name.slice(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm text-[#4a2e18]">{frame.name}</h4>
                      {isSelected && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                      {frame.description}
                    </p>
                  </div>
                </div>

                <div className="ml-2 flex items-center pt-2">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-[#4a2e18] bg-[#4a2e18] text-white'
                        : 'border-stone-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer (Over 90% rounded corners button) */}
        <div className="px-5 py-3 border-t-2 border-[#4a2e18] bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#4a2e18] text-white rounded-full font-semibold text-xs hover:bg-[#382212] transition shadow-sm"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
