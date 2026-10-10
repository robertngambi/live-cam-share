import React from 'react';
import { Video, Check, X, HardDrive } from 'lucide-react';
import { StorageTarget } from '../types';

interface VideoSaveConfirmModalProps {
  isOpen: boolean;
  durationFormatted: string;
  storageTarget: StorageTarget;
  onConfirmSave: () => void;
  onCancelSave: () => void;
}

export const VideoSaveConfirmModal: React.FC<VideoSaveConfirmModalProps> = ({
  isOpen,
  durationFormatted,
  storageTarget,
  onConfirmSave,
  onCancelSave,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border-2 border-[#4a2e18] rounded-3xl shadow-2xl max-w-sm w-full p-5 text-[#4a2e18]">
        {/* Header icon & title */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-[#4a2e18] shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#4a2e18]">Save Video Recording</h3>
            <p className="text-[11px] text-stone-500 font-medium">Recorded duration: {durationFormatted}</p>
          </div>
        </div>

        {/* Note Box */}
        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs font-semibold text-[#4a2e18] mb-4">
          Click on 'OK' button to save your video
        </div>

        <div className="flex items-center space-x-1.5 text-[11px] text-stone-600 mb-5">
          <HardDrive className="w-3.5 h-3.5 text-stone-400" />
          <span>
            Target: <strong>{storageTarget === 'internal' ? 'Internal Storage' : 'SD Card'}</strong>
          </span>
        </div>

        {/* Action Buttons: Cancel on left, OK on right (Over 90% rounded corners) */}
        <div className="flex items-center justify-between space-x-3 pt-2 border-t border-stone-200">
          <button
            type="button"
            onClick={onCancelSave}
            className="flex-1 py-2.5 px-4 border border-stone-300 rounded-full text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 transition text-center shadow-xs"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirmSave}
            className="flex-1 py-2.5 px-4 border border-[#4a2e18] rounded-full text-xs font-bold text-white bg-[#4a2e18] hover:bg-[#382212] transition shadow-xs text-center"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
