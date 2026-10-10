import React, { useState, useRef, useEffect } from 'react';
import {
  RotateCw,
  RotateCcw,
  Usb,
  Bluetooth,
  Wifi,
  Upload,
  MoreVertical,
  Film,
  Info,
  Settings,
  HelpCircle,
  Radio,
  Cast
} from 'lucide-react';
import { ConnectionMethod } from '../types';

interface TopBarProps {
  isRotated: boolean;
  onToggleRotate: () => void;
  connectionMethod: ConnectionMethod;
  isSharingActive: boolean;
  onOpenFrames: () => void;
  onOpenAbout: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  activeFrameName?: string;
  connectedDevicesCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  isRotated,
  onToggleRotate,
  connectionMethod,
  isSharingActive,
  onOpenFrames,
  onOpenAbout,
  onOpenSettings,
  onOpenHelp,
  activeFrameName,
  connectedDevicesCount,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Connection icon based on method
  const renderConnectionIcon = () => {
    switch (connectionMethod) {
      case 'usb':
        return <Usb className="w-5 h-5 text-[#4a2e18]" title="USB Live Connection" />;
      case 'bluetooth':
        return <Bluetooth className="w-5 h-5 text-[#4a2e18]" title="Bluetooth Live Connection" />;
      case 'wifi':
      default:
        return <Wifi className="w-5 h-5 text-[#4a2e18]" title="Wi-Fi Live Connection" />;
    }
  };

  return (
    <header className="relative w-full bg-white border-b-2 border-[#4a2e18] px-4 py-2.5 z-40 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: App Title and Live Badge */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#4a2e18] flex items-center justify-center text-white shadow-sm">
              <Radio className="w-4 h-4 animate-pulse text-amber-300" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-[#4a2e18] tracking-tight leading-none">
                Live Share Camera
              </h1>
              <p className="text-[11px] text-stone-500 font-medium leading-tight hidden xs:block mt-0.5">
                {activeFrameName && activeFrameName !== 'No Frame' ? `Frame: ${activeFrameName}` : 'Live Camera & Stream Cast'}
              </p>
            </div>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Rotate / Unrotate Button (Over 90% rounded corners) */}
          <button
            onClick={onToggleRotate}
            type="button"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border border-[#4a2e18]/25 bg-white text-[#4a2e18] hover:bg-stone-50 active:bg-stone-100 transition shadow-xs text-xs font-semibold"
            title={isRotated ? 'Unrotate screen' : 'Rotate screen'}
            aria-label={isRotated ? 'Unrotate screen' : 'Rotate screen'}
          >
            {isRotated ? (
              <>
                <RotateCcw className="w-4 h-4 text-[#4a2e18]" />
                <span className="hidden sm:inline">Unrotate</span>
              </>
            ) : (
              <>
                <RotateCw className="w-4 h-4 text-[#4a2e18]" />
                <span className="hidden sm:inline">Rotate</span>
              </>
            )}
          </button>

          {/* Connection display / show out symbol (Over 90% rounded corners) */}
          <div
            onClick={onOpenSettings}
            role="button"
            tabIndex={0}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-[#4a2e18]/25 bg-white text-[#4a2e18] hover:bg-stone-50 transition shadow-xs cursor-pointer"
            title={`Connection: Via ${connectionMethod.toUpperCase()} (${isSharingActive ? 'Active Sharing' : 'Ready / Idle'})`}
          >
            <div className="flex items-center space-x-1">
              {renderConnectionIcon()}
              {/* Uploading icon blinking if connected / sharing */}
              {isSharingActive && (
                <Upload
                  className="w-4 h-4 text-emerald-600 animate-bounce"
                  strokeWidth={2.6}
                  title="Uploading / Sharing Camera to devices"
                />
              )}
            </div>
            <span className="text-[11px] font-bold text-[#4a2e18] uppercase hidden md:inline">
              {connectionMethod}
              {isSharingActive && ` (${connectedDevicesCount})`}
            </span>
          </div>

          {/* Drop-down menu button (Over 90% rounded corners) */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              type="button"
              className="p-2 rounded-full border border-[#4a2e18]/30 bg-white text-[#4a2e18] hover:bg-stone-50 active:bg-stone-100 transition shadow-xs"
              title="Menu"
              aria-label="Menu"
            >
              <MoreVertical className="w-4 h-4 text-[#4a2e18]" />
            </button>

            {/* Drop-Down Menu List */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border-2 border-[#4a2e18] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Menu Options
                </div>

                <div className="space-y-1 pt-1">
                  {/* Frames button */}
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenFrames();
                    }}
                    className="w-full text-left px-3.5 py-2 text-sm text-[#4a2e18] font-semibold hover:bg-amber-50 rounded-full flex items-center space-x-2.5 transition"
                  >
                    <Film className="w-4 h-4 text-[#4a2e18]" />
                    <span>Frames</span>
                  </button>

                  {/* About the app button */}
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenAbout();
                    }}
                    className="w-full text-left px-3.5 py-2 text-sm text-[#4a2e18] font-semibold hover:bg-amber-50 rounded-full flex items-center space-x-2.5 transition"
                  >
                    <Info className="w-4 h-4 text-[#4a2e18]" />
                    <span>About the app</span>
                  </button>

                  {/* Settings button */}
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenSettings();
                    }}
                    className="w-full text-left px-3.5 py-2 text-sm text-[#4a2e18] font-semibold hover:bg-amber-50 rounded-full flex items-center space-x-2.5 transition"
                  >
                    <Settings className="w-4 h-4 text-[#4a2e18]" />
                    <span>Settings</span>
                  </button>

                  {/* Help button */}
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenHelp();
                    }}
                    className="w-full text-left px-3.5 py-2 text-sm text-[#4a2e18] font-semibold hover:bg-amber-50 rounded-full flex items-center space-x-2.5 transition"
                  >
                    <HelpCircle className="w-4 h-4 text-[#4a2e18]" />
                    <span>Help</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
