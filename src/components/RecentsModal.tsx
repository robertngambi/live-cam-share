import React, { useState } from 'react';
import {
  X,
  HardDrive,
  Image as ImageIcon,
  Film,
  Play,
  Download,
  Trash2,
  Clock,
  Layers,
  FolderOpen
} from 'lucide-react';
import { MediaItem, StorageTarget } from '../types';

interface RecentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaList: MediaItem[];
  onOpenMediaItem: (item: MediaItem) => void;
  onDeleteMedia: (id: string) => void;
}

type LocationFilter = 'all' | 'internal' | 'sdcard';
type TypeFilter = 'all' | 'photos' | 'videos';

export const RecentsModal: React.FC<RecentsModalProps> = ({
  isOpen,
  onClose,
  mediaList,
  onOpenMediaItem,
  onDeleteMedia,
}) => {
  // Active selected location filter: default to 'internal' or 'all'
  const [activeLocation, setActiveLocation] = useState<LocationFilter>('internal');
  const [activeType, setActiveType] = useState<TypeFilter>('all');

  if (!isOpen) return null;

  // Filter files by active location
  const locationFiles = mediaList.filter((m) => {
    if (activeLocation === 'all') return true;
    return m.storageTarget === activeLocation;
  });

  // Further filter by type (All, Photos, Videos) if desired
  const filteredFiles = locationFiles.filter((m) => {
    if (activeType === 'all') return true;
    if (activeType === 'photos') return m.type === 'photo';
    if (activeType === 'videos') return m.type === 'video';
    return true;
  });

  const internalCount = mediaList.filter((m) => m.storageTarget === 'internal').length;
  const sdcardCount = mediaList.filter((m) => m.storageTarget === 'sdcard').length;

  const totalSizeMB = filteredFiles.reduce((acc, m) => acc + m.sizeMB, 0).toFixed(1);

  const handleDownload = (item: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const a = document.createElement('a');
    a.href = item.url;
    a.download = `live_share_${item.type}_${Date.now()}.${item.type === 'photo' ? 'jpg' : 'webm'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteMedia(id);
  };

  const getLocationLabel = () => {
    switch (activeLocation) {
      case 'internal':
        return 'Internal Storage';
      case 'sdcard':
        return 'External SD Card';
      case 'all':
      default:
        return 'All Locations';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150 select-none">
      <div className="bg-white border-2 border-[#4a2e18] rounded-3xl shadow-2xl max-w-2xl w-full max-h-[88vh] flex flex-col overflow-hidden text-[#4a2e18]">
        {/* Header: Page name 'Recents' followed directly by Locations Buttons */}
        <div className="p-4 sm:px-6 sm:py-4 border-b-2 border-[#4a2e18] bg-stone-50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-[#4a2e18]">
                <FolderOpen className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#4a2e18] leading-tight">Recents</h2>
                <p className="text-[11px] text-stone-500 font-medium">
                  {mediaList.length} total captured files
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-500 hover:text-[#4a2e18] hover:bg-stone-200 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Locations buttons listed just after page name 'Recents' (Over 90% rounded corners) */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
              File Locations:
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Internal Storage Button */}
              <button
                type="button"
                onClick={() => setActiveLocation('internal')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold transition shadow-xs ${
                  activeLocation === 'internal'
                    ? 'bg-[#4a2e18] text-white ring-2 ring-[#4a2e18]/40'
                    : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <HardDrive className="w-3.5 h-3.5" />
                <span>Internal storage</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    activeLocation === 'internal'
                      ? 'bg-white/20 text-white'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {internalCount}
                </span>
              </button>

              {/* SD Card Button */}
              <button
                type="button"
                onClick={() => setActiveLocation('sdcard')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold transition shadow-xs ${
                  activeLocation === 'sdcard'
                    ? 'bg-[#4a2e18] text-white ring-2 ring-[#4a2e18]/40'
                    : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <HardDrive className="w-3.5 h-3.5" />
                <span>SD card</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    activeLocation === 'sdcard'
                      ? 'bg-white/20 text-white'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {sdcardCount}
                </span>
              </button>

              {/* All Locations Button */}
              <button
                type="button"
                onClick={() => setActiveLocation('all')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-full text-xs font-bold transition shadow-xs ${
                  activeLocation === 'all'
                    ? 'bg-[#4a2e18] text-white ring-2 ring-[#4a2e18]/40'
                    : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All locations</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    activeLocation === 'all'
                      ? 'bg-white/20 text-white'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {mediaList.length}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Sub-bar: Status and Type Filter Tabs */}
        <div className="px-5 py-2 bg-stone-100/70 border-b border-stone-200 flex items-center justify-between text-xs">
          <div className="font-semibold text-stone-700">
            Location: <span className="text-[#4a2e18] font-bold">{getLocationLabel()}</span>
            <span className="text-stone-500 font-normal ml-2">
              ({filteredFiles.length} items • {totalSizeMB} MB)
            </span>
          </div>

          {/* Quick filter pills */}
          <div className="flex items-center space-x-1">
            {(['all', 'photos', 'videos'] as TypeFilter[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setActiveType(type)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize transition ${
                  activeType === type
                    ? 'bg-[#4a2e18] text-white'
                    : 'text-stone-600 hover:bg-stone-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Area: Where all the recents files are organised, appearing when file location is active */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {filteredFiles.length === 0 ? (
            <div className="text-center py-14 text-stone-400 space-y-2.5">
              <HardDrive className="w-12 h-12 mx-auto stroke-1 text-stone-300" />
              <p className="text-sm font-semibold text-stone-600">
                No files found in {getLocationLabel()}
              </p>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                Files saved to this location when capturing live photos or recording videos will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredFiles.map((item) => {
                const isVideo = item.type === 'video';
                return (
                  <div
                    key={item.id}
                    onClick={() => onOpenMediaItem(item)}
                    role="button"
                    tabIndex={0}
                    className="group relative rounded-2xl border-2 border-stone-200 hover:border-[#4a2e18] bg-stone-50 overflow-hidden cursor-pointer transition shadow-2xs flex flex-col justify-between"
                  >
                    {/* Media Thumbnail */}
                    <div className="aspect-4/3 bg-stone-900 overflow-hidden relative">
                      {isVideo ? (
                        <>
                          <video
                            src={item.url}
                            className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">
                              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                            </div>
                          </div>
                          {/* Duration badge in hour. Minutes.seconds (00.00.00) format */}
                          <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-full bg-black/85 text-white font-mono text-[9px] font-bold">
                            {item.durationFormatted || '00.00.00'}
                          </div>
                        </>
                      ) : (
                        <img
                          src={item.url}
                          alt="Captured photo"
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      )}

                      {/* Type badge on top left */}
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold uppercase flex items-center space-x-1">
                        {isVideo ? (
                          <Film className="w-2.5 h-2.5 text-amber-300" />
                        ) : (
                          <ImageIcon className="w-2.5 h-2.5 text-emerald-300" />
                        )}
                        <span>{item.type}</span>
                      </div>
                    </div>

                    {/* Metadata & Location info */}
                    <div className="p-2.5 space-y-1 bg-white">
                      <div className="flex items-center justify-between text-[10px] text-stone-500">
                        <span>{item.sizeMB.toFixed(1)} MB</span>
                        <span className="capitalize font-semibold text-[#4a2e18]">
                          {item.storageTarget === 'internal' ? 'Internal' : 'SD Card'}
                        </span>
                      </div>
                      <div className="text-[11px] font-bold text-[#4a2e18] truncate">
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </div>
                    </div>

                    {/* Quick Action buttons */}
                    <div className="absolute top-2 right-2 flex space-x-1 opacity-90 group-hover:opacity-100 transition z-10">
                      <button
                        type="button"
                        onClick={(e) => handleDownload(item, e)}
                        className="p-1 rounded-full bg-white/90 hover:bg-white text-[#4a2e18] shadow-sm"
                        title="Download file"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(item.id, e)}
                        className="p-1 rounded-full bg-white/90 hover:bg-red-50 text-red-600 shadow-sm"
                        title="Delete file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer (Over 90% rounded corners button) */}
        <div className="px-5 py-3 border-t-2 border-[#4a2e18] bg-stone-50 flex items-center justify-between">
          <div className="text-xs text-stone-600 font-medium">
            Showing files from: <strong>{getLocationLabel()}</strong>
          </div>

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
