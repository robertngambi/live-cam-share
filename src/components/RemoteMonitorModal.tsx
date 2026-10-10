import React, { useState, useEffect } from 'react';
import { X, Tv, Wifi, Bluetooth, Usb, Radio, RefreshCw, Volume2, Maximize2, ShieldCheck } from 'lucide-react';
import { ConnectedDevice, ConnectionMethod } from '../types';

interface RemoteMonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDevice: ConnectedDevice | null;
  connectionMethod: ConnectionMethod;
}

export const RemoteMonitorModal: React.FC<RemoteMonitorModalProps> = ({
  isOpen,
  onClose,
  selectedDevice,
  connectionMethod,
}) => {
  const [latency, setLatency] = useState(14);
  const [fps, setFps] = useState(60);
  const [bitrate, setBitrate] = useState(12.4);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setLatency(Math.floor(12 + Math.random() * 8));
      setFps(Math.floor(58 + Math.random() * 3));
      setBitrate(Number((11.8 + Math.random() * 1.5).toFixed(1)));
    }, 2000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !selectedDevice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border-2 border-[#4a2e18] rounded-3xl shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden text-[#4a2e18]">
        {/* Header */}
        <div className="px-5 py-3 border-b-2 border-[#4a2e18] flex items-center justify-between bg-stone-50">
          <div className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-emerald-600 animate-pulse" />
            <div>
              <h3 className="font-bold text-sm text-[#4a2e18]">
                Receiving Live Stream from {selectedDevice.name}
              </h3>
              <p className="text-[11px] text-stone-500 font-medium">
                Protocol: Via {connectionMethod.toUpperCase()} • IP: {selectedDevice.ipOrAddress}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-500 hover:text-[#4a2e18] hover:bg-stone-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Incoming Feed Simulator */}
        <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden">
          {/* Animated incoming feed */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center text-white">
            <div className="w-20 h-20 rounded-full border-2 border-emerald-500/60 flex items-center justify-center animate-pulse">
              <Tv className="w-10 h-10 text-emerald-400" />
            </div>
            <p className="mt-3 text-sm font-bold tracking-wider">LIVE REMOTE CAMERA SYNCED</p>
            <p className="text-xs text-stone-400 mt-1">Direct P2P Hardware Decoded Feed</p>
          </div>

          {/* Telemetry Overlays */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-emerald-400 border border-emerald-500/30">
            ● REC-RECEIVE • {fps} FPS • {latency}ms ping
          </div>

          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-white border border-white/20">
            {bitrate} Mbps • 1080p60
          </div>
        </div>

        {/* Controls footer */}
        <div className="px-5 py-3 border-t-2 border-[#4a2e18] bg-stone-50 flex items-center justify-between">
          <div className="text-xs text-stone-600">
            Audio & video synced via {connectionMethod.toUpperCase()}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#4a2e18] text-white rounded-full text-xs font-bold hover:bg-[#382212] transition shadow-xs"
          >
            Close Stream Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
