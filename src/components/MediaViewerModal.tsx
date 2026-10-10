import React from 'react';
import { X, Download, Trash2, Calendar, HardDrive, Play, Film, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaItem } from '../types';

interface MediaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaList: MediaItem[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  onDeleteMedia: (id: string) => void;
}

export const MediaViewerModal: React.FC<MediaViewerModalProps> = ({
  isOpen,
  onClose,
  mediaList,
  currentIndex,
  onSelectIndex,
  onDeleteMedia,
}) => {
  if (!isOpen || mediaList.length === 0) return null;

  const currentItem = mediaList[currentIndex] || mediaList[0];

  const handleDownload = () => {
    if (!currentItem) return;
    const a = document.createElement('a');
    a.href = currentItem.url;
    a.download = `live_share_${currentItem.type}_${Date.now()}.${currentItem.type === 'photo' ? 'jpg' : 'webm'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative bg-white border-2 border-[#4a2e18] rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden text-[#4a2e18]">
        {/* Header */}
        <div className="px-4 py-3 border-b-2 border-[#4a2e18] flex items-center justify-between bg-stone-50">
          <div className="flex items-center space-x-2">
            {currentItem.type === 'photo' ? (
              <ImageIcon className="w-5 h-5 text-[#4a2e18]" />
            ) : (
              <Film className="w-5 h-5 text-[#4a2e18]" />
            )}
            <div>
              <h3 className="font-bold text-sm text-[#4a2e18]">
                {currentItem.type === 'photo' ? 'Saved Photo' : 'Saved Video'}{' '}
                <span className="text-xs font-normal text-stone-500">
                  ({currentIndex + 1} of {mediaList.length})
                </span>
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-full border border-[#4a2e18] bg-white text-[#4a2e18] hover:bg-stone-100 text-xs font-bold transition shadow-2xs"
              title="Download file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save / Download</span>
            </button>

            <button
              onClick={() => onDeleteMedia(currentItem.id)}
              className="p-1.5 rounded-full text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition"
              title="Delete item"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-500 hover:text-[#4a2e18] hover:bg-stone-200 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Media Preview Stage */}
        <div className="relative flex-1 bg-stone-950 flex items-center justify-center p-2 min-h-[300px] max-h-[58vh] overflow-hidden select-none">
          {currentItem.type === 'photo' ? (
            <img
              src={currentItem.url}
              alt="Captured"
              className="max-h-full max-w-full object-contain rounded shadow-lg"
            />
          ) : (
            <video
              src={currentItem.url}
              controls
              autoPlay
              className="max-h-full max-w-full rounded shadow-lg"
            />
          )}

          {/* Prev / Next buttons */}
          {mediaList.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => onSelectIndex((currentIndex - 1 + mediaList.length) % mediaList.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => onSelectIndex((currentIndex + 1) % mediaList.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Metadata Bar */}
        <div className="px-4 py-2.5 bg-stone-50 border-t-2 border-[#4a2e18] flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600">
          <div className="flex items-center space-x-4">
            <span>
              Size: <strong>{currentItem.sizeMB.toFixed(2)} MB</strong>
            </span>
            <span>
              Resolution: <strong>{currentItem.width}x{currentItem.height}</strong>
            </span>
            {currentItem.durationFormatted && (
              <span>
                Duration: <strong>{currentItem.durationFormatted}</strong>
              </span>
            )}
            <span className="flex items-center space-x-1">
              <HardDrive className="w-3.5 h-3.5 text-stone-400" />
              <span>
                Location: <strong>{currentItem.storageTarget === 'internal' ? 'Internal Storage' : 'SD Card'}</strong>
              </span>
            </span>
          </div>

          <div className="text-[11px] text-stone-500">
            {new Date(currentItem.timestamp).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};
