import React, { useState } from 'react';
import {
  X,
  RefreshCw,
  Usb,
  Bluetooth,
  Wifi,
  HardDrive,
  RotateCcw,
  Volume2,
  VolumeX,
  Smartphone,
  Tablet,
  Laptop,
  Tv,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Maximize2
} from 'lucide-react';
import {
  AppSettings,
  ConnectedDevice,
  DelayCapture,
  PictureSizeId,
  StorageInfo,
  StorageTarget
} from '../types';
import { DEFAULT_SETTINGS, PICTURE_SIZES } from '../constants';
import { playCameraShutterSound } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onResetSettings: () => void;
  storage: { internal: StorageInfo; sdcard: StorageInfo };
  availableDevices: ConnectedDevice[];
  onRefreshDevices: () => void;
  isRefreshingDevices: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetSettings,
  storage,
  availableDevices,
  onRefreshDevices,
  isRefreshingDevices,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dropdown open states for Shutter Sound, Delay Capture, and Picture Size
  const [shutterDropdownOpen, setShutterDropdownOpen] = useState(false);
  const [delayDropdownOpen, setDelayDropdownOpen] = useState(false);
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);

  if (!isOpen) return null;

  // Check if any setting differs from defaults
  const isChangedFromDefault =
    settings.shutterSound !== DEFAULT_SETTINGS.shutterSound ||
    settings.delayCapture !== DEFAULT_SETTINGS.delayCapture ||
    settings.pictureSize !== DEFAULT_SETTINGS.pictureSize ||
    settings.connectionMethod !== DEFAULT_SETTINGS.connectionMethod ||
    settings.connectionType !== DEFAULT_SETTINGS.connectionType ||
    settings.storageLocation !== DEFAULT_SETTINGS.storageLocation ||
    JSON.stringify([...settings.selectedSendDevices].sort()) !==
      JSON.stringify([...DEFAULT_SETTINGS.selectedSendDevices].sort()) ||
    settings.selectedReceiveDevice !== DEFAULT_SETTINGS.selectedReceiveDevice;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Device type icon helper
  const getDeviceIcon = (type: ConnectedDevice['type']) => {
    switch (type) {
      case 'phone':
        return <Smartphone className="w-4 h-4 text-[#4a2e18]" />;
      case 'tablet':
        return <Tablet className="w-4 h-4 text-[#4a2e18]" />;
      case 'laptop':
        return <Laptop className="w-4 h-4 text-[#4a2e18]" />;
      case 'tv':
        return <Tv className="w-4 h-4 text-[#4a2e18]" />;
    }
  };

  // Toggle send device marking (max 3)
  const handleToggleSendDevice = (deviceId: string) => {
    const current = [...settings.selectedSendDevices];
    if (current.includes(deviceId)) {
      onUpdateSettings({
        selectedSendDevices: current.filter((id) => id !== deviceId),
      });
    } else {
      if (current.length >= 3) {
        showToast('Maximum of 3 devices can be marked for streaming at once.');
        return;
      }
      onUpdateSettings({
        selectedSendDevices: [...current, deviceId],
      });
    }
  };

  const selectedSizeObj =
    PICTURE_SIZES.find((s) => s.id === settings.pictureSize) || PICTURE_SIZES[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border-2 border-[#4a2e18] rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-[#4a2e18]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b-2 border-[#4a2e18] flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#4a2e18]">Camera & Share Settings</h2>
            <p className="text-xs text-stone-500">Configure shutter, delay, picture sizes, and streaming protocols</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-500 hover:text-[#4a2e18] hover:bg-stone-200/60 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast notification */}
        {toastMessage && (
          <div className="bg-amber-100 border-b border-amber-300 px-4 py-2 text-xs font-semibold text-amber-900 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Settings Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* 1. Shutter sound button (drop menu list type with radio buttons) */}
          <section className="space-y-2 border-b border-stone-200 pb-5">
            <div>
              <span className="font-bold text-sm text-[#4a2e18]">Shutter sound</span>
              <p className="text-xs text-stone-600 mt-0.5">
                Set the shutter sound when capturing your picture
              </p>
            </div>

            {/* Dropdown Menu Trigger Button (Over 90% rounded corners) */}
            <button
              type="button"
              onClick={() => setShutterDropdownOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-full border-2 border-[#4a2e18]/40 bg-white hover:bg-stone-50 transition shadow-xs text-xs font-bold"
            >
              <div className="flex items-center space-x-2.5">
                {settings.shutterSound ? (
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <VolumeX className="w-4 h-4 text-stone-400" />
                )}
                <span>
                  Shutter Sound: <strong>{settings.shutterSound ? 'Sound ON' : 'Sound OFF'}</strong>
                </span>
              </div>
              <div className="flex items-center space-x-1 text-stone-500">
                <span className="text-[11px] font-medium hidden xs:inline">Select</span>
                {shutterDropdownOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#4a2e18]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#4a2e18]" />
                )}
              </div>
            </button>

            {/* Dropdown List with Radio Buttons (Over 90% rounded corners) */}
            {shutterDropdownOpen && (
              <div className="p-2 bg-stone-50 rounded-2xl border border-[#4a2e18]/20 space-y-1.5 animate-in fade-in duration-150">
                {/* Radio Option: Sound ON */}
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSettings({ shutterSound: true });
                    playCameraShutterSound();
                    setShutterDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full border text-xs font-bold transition ${
                    settings.shutterSound
                      ? 'border-[#4a2e18] bg-amber-50 text-[#4a2e18] shadow-xs'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Volume2 className="w-4 h-4 text-[#4a2e18]" />
                    <span>Sound ON (Play mechanical shutter click on capture)</span>
                  </div>
                  {/* Radio button circle */}
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      settings.shutterSound ? 'border-[#4a2e18] bg-[#4a2e18]' : 'border-stone-400 bg-white'
                    }`}
                  >
                    {settings.shutterSound && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>

                {/* Radio Option: Sound OFF */}
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSettings({ shutterSound: false });
                    setShutterDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full border text-xs font-bold transition ${
                    !settings.shutterSound
                      ? 'border-[#4a2e18] bg-amber-50 text-[#4a2e18] shadow-xs'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <VolumeX className="w-4 h-4 text-stone-500" />
                    <span>Sound OFF (Mute shutter click sound)</span>
                  </div>
                  {/* Radio button circle */}
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      !settings.shutterSound ? 'border-[#4a2e18] bg-[#4a2e18]' : 'border-stone-400 bg-white'
                    }`}
                  >
                    {!settings.shutterSound && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              </div>
            )}
          </section>

          {/* 2. Delay capture button (drop menu list type with radio buttons) */}
          <section className="space-y-2 border-b border-stone-200 pb-5">
            <div>
              <span className="font-bold text-sm text-[#4a2e18]">Delay capture</span>
              <p className="text-xs text-stone-600 mt-0.5">Set delay time of capturing your picture</p>
            </div>

            {/* Dropdown Menu Trigger Button (Over 90% rounded corners) */}
            <button
              type="button"
              onClick={() => setDelayDropdownOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-full border-2 border-[#4a2e18]/40 bg-white hover:bg-stone-50 transition shadow-xs text-xs font-bold"
            >
              <div className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-[#4a2e18]" />
                <span>
                  Delay Time:{' '}
                  <strong>{settings.delayCapture === 'off' ? 'Off (No delay)' : settings.delayCapture}</strong>
                </span>
              </div>
              <div className="flex items-center space-x-1 text-stone-500">
                <span className="text-[11px] font-medium hidden xs:inline">Select</span>
                {delayDropdownOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#4a2e18]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#4a2e18]" />
                )}
              </div>
            </button>

            {/* Dropdown List with Radio Buttons (Over 90% rounded corners) */}
            {delayDropdownOpen && (
              <div className="p-2 bg-stone-50 rounded-2xl border border-[#4a2e18]/20 space-y-1.5 animate-in fade-in duration-150">
                {(
                  [
                    { id: 'off', label: 'Off – No delay (default)' },
                    { id: '3s', label: '3s – 3 seconds delay' },
                    { id: '5s', label: '5s – 5 seconds delay' },
                    { id: '10s', label: '10s – 10 seconds delay' },
                  ] as { id: DelayCapture; label: string }[]
                ).map((opt) => {
                  const isSelected = settings.delayCapture === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        onUpdateSettings({ delayCapture: opt.id });
                        setDelayDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full border text-xs font-bold transition ${
                        isSelected
                          ? 'border-[#4a2e18] bg-amber-50 text-[#4a2e18] shadow-xs'
                          : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="w-5 text-center font-mono">{opt.id}</span>
                        <span>{opt.label}</span>
                      </div>
                      {/* Radio button circle */}
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-[#4a2e18] bg-[#4a2e18]' : 'border-stone-400 bg-white'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* 3. Picture size button (drop menu list type with radio buttons) */}
          <section className="space-y-2 border-b border-stone-200 pb-5">
            <div>
              <span className="font-bold text-sm text-[#4a2e18]">Picture size</span>
              <p className="text-xs text-stone-600 mt-0.5">Choose a size of your picture</p>
            </div>

            {/* Dropdown Menu Trigger Button (Over 90% rounded corners) */}
            <button
              type="button"
              onClick={() => setSizeDropdownOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-full border-2 border-[#4a2e18]/40 bg-white hover:bg-stone-50 transition shadow-xs text-xs font-bold"
            >
              <div className="flex items-center space-x-2.5">
                <Maximize2 className="w-4 h-4 text-[#4a2e18]" />
                <span>
                  Size: <strong>{selectedSizeObj.label}</strong>
                </span>
              </div>
              <div className="flex items-center space-x-1 text-stone-500">
                <span className="text-[11px] font-medium hidden xs:inline">Select</span>
                {sizeDropdownOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#4a2e18]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#4a2e18]" />
                )}
              </div>
            </button>

            {/* Dropdown List with Radio Buttons (Over 90% rounded corners) */}
            {sizeDropdownOpen && (
              <div className="p-2 bg-stone-50 rounded-2xl border border-[#4a2e18]/20 space-y-1.5 animate-in fade-in duration-150">
                {PICTURE_SIZES.map((size) => {
                  const isSelected = settings.pictureSize === size.id;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => {
                        onUpdateSettings({ pictureSize: size.id });
                        setSizeDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full border text-xs font-bold transition ${
                        isSelected
                          ? 'border-[#4a2e18] bg-amber-50 text-[#4a2e18] shadow-xs'
                          : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <div className="text-left">
                        <div>{size.label}</div>
                        <div className="text-[10px] font-normal text-stone-500">
                          Aspect Ratio: {size.aspectRatio}
                        </div>
                      </div>
                      {/* Radio button circle */}
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 ${
                          isSelected ? 'border-[#4a2e18] bg-[#4a2e18]' : 'border-stone-400 bg-white'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* 4. Connections button (Over 90% rounded corners on buttons) */}
          <section className="space-y-3 border-b border-stone-200 pb-5">
            <div>
              <span className="font-bold text-sm text-[#4a2e18]">Connections</span>
              <p className="text-xs text-stone-600 mt-0.5">
                Set connection for sharing your camera to other devices
              </p>
            </div>

            {/* Connection through */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-stone-700">Select connection through</p>
              <div className="grid grid-cols-3 gap-2">
                {/* Via USB */}
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ connectionMethod: 'usb' })}
                  className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-full border text-xs font-bold transition ${
                    settings.connectionMethod === 'usb'
                      ? 'border-[#4a2e18] bg-[#4a2e18] text-white shadow-xs'
                      : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Usb className="w-4 h-4" />
                  <span>Via USB</span>
                </button>

                {/* Via Bluetooth */}
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ connectionMethod: 'bluetooth' })}
                  className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-full border text-xs font-bold transition ${
                    settings.connectionMethod === 'bluetooth'
                      ? 'border-[#4a2e18] bg-[#4a2e18] text-white shadow-xs'
                      : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Bluetooth className="w-4 h-4" />
                  <span>Via Bluetooth</span>
                </button>

                {/* Via Wi-Fi */}
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ connectionMethod: 'wifi' })}
                  className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-full border text-xs font-bold transition ${
                    settings.connectionMethod === 'wifi'
                      ? 'border-[#4a2e18] bg-[#4a2e18] text-white shadow-xs'
                      : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Wifi className="w-4 h-4" />
                  <span>Via Wi-Fi</span>
                </button>
              </div>
            </div>

            {/* Connection type */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-700">Select connection type</span>
                <button
                  type="button"
                  onClick={onRefreshDevices}
                  disabled={isRefreshingDevices}
                  className="flex items-center space-x-1.5 text-xs font-bold text-[#4a2e18] hover:text-[#382212] px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 transition border border-stone-200 shadow-2xs"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isRefreshingDevices ? 'animate-spin' : ''}`}
                  />
                  <span>Refresh</span>
                </button>
              </div>

              {/* Send / Receive buttons (Over 90% rounded corners) */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ connectionType: 'send' })}
                  className={`py-2.5 px-4 rounded-full border text-xs font-bold transition text-center ${
                    settings.connectionType === 'send'
                      ? 'border-[#4a2e18] bg-[#4a2e18] text-white shadow-xs'
                      : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  Send
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateSettings({ connectionType: 'receive' })}
                  className={`py-2.5 px-4 rounded-full border text-xs font-bold transition text-center ${
                    settings.connectionType === 'receive'
                      ? 'border-[#4a2e18] bg-[#4a2e18] text-white shadow-xs'
                      : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  Receive
                </button>
              </div>

              {/* Dynamic device list based on connectionType (Over 90% rounded rows) */}
              {settings.connectionType === 'send' ? (
                <div className="mt-3 p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                  <div className="text-[11px] font-semibold text-stone-600 px-1">
                    Select up to 3 connected devices to send camera to: (
                    {settings.selectedSendDevices.length}/3 marked)
                  </div>

                  <div className="space-y-1.5">
                    {availableDevices.map((device) => {
                      const isMarked = settings.selectedSendDevices.includes(device.id);
                      return (
                        <div
                          key={device.id}
                          onClick={() => handleToggleSendDevice(device.id)}
                          role="button"
                          tabIndex={0}
                          className={`flex items-center justify-between p-2.5 px-4 rounded-full border text-xs cursor-pointer transition ${
                            isMarked
                              ? 'border-[#4a2e18] bg-amber-50 font-bold'
                              : 'border-stone-200 bg-white hover:bg-stone-100'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            {getDeviceIcon(device.type)}
                            <div>
                              <div className="text-[#4a2e18]">{device.name}</div>
                              <div className="text-[10px] text-stone-500 font-normal">
                                {device.os} • {device.ipOrAddress} • Signal {device.signalStrength}%
                              </div>
                            </div>
                          </div>

                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              isMarked
                                ? 'border-[#4a2e18] bg-[#4a2e18] text-white'
                                : 'border-stone-300 bg-white'
                            }`}
                          >
                            {isMarked && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="mt-3 p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                  <div className="text-[11px] font-semibold text-stone-600 px-1">
                    Choose one device to receive camera stream from:
                  </div>

                  <div className="space-y-1.5">
                    {availableDevices.map((device) => {
                      const isSelected = settings.selectedReceiveDevice === device.id;
                      return (
                        <div
                          key={device.id}
                          onClick={() =>
                            onUpdateSettings({
                              selectedReceiveDevice: isSelected ? null : device.id,
                            })
                          }
                          role="button"
                          tabIndex={0}
                          className={`flex items-center justify-between p-2.5 px-4 rounded-full border text-xs cursor-pointer transition ${
                            isSelected
                              ? 'border-[#4a2e18] bg-amber-50 font-bold'
                              : 'border-stone-200 bg-white hover:bg-stone-100'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            {getDeviceIcon(device.type)}
                            <div>
                              <div className="text-[#4a2e18]">{device.name}</div>
                              <div className="text-[10px] text-stone-500 font-normal">
                                {device.os} • {device.ipOrAddress}
                              </div>
                            </div>
                          </div>

                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? 'border-[#4a2e18] bg-[#4a2e18]'
                                : 'border-stone-300 bg-white'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* 5. Storage location button (EXCEPT storage location: keep containers rectangular cards!) */}
          <section className="space-y-3 border-b border-stone-200 pb-5">
            <div>
              <span className="font-bold text-sm text-[#4a2e18]">Storage location</span>
              <p className="text-xs text-stone-600 mt-0.5">
                Choose location where to save your output files
              </p>
            </div>

            {/* 2 containers placed vertically (RETAINED AS CLEAR RECTANGULAR CARDS PER PROMPT SPEC) */}
            <div className="space-y-3">
              {/* Internal Storage Container */}
              <div
                onClick={() => onUpdateSettings({ storageLocation: 'internal' })}
                role="button"
                tabIndex={0}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition ${
                  settings.storageLocation === 'internal'
                    ? 'border-[#4a2e18] bg-amber-50/50 shadow-xs'
                    : 'border-stone-200 bg-stone-50 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <HardDrive className="w-4 h-4 text-[#4a2e18]" />
                    <span className="text-xs font-bold text-[#4a2e18]">
                      {storage.internal.title}
                    </span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      settings.storageLocation === 'internal'
                        ? 'border-[#4a2e18] bg-[#4a2e18]'
                        : 'border-stone-300 bg-white'
                    }`}
                  >
                    {settings.storageLocation === 'internal' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </div>

                <div className="text-xs text-stone-600 flex justify-between">
                  <span>Total: <strong>{storage.internal.totalMB.toLocaleString()} MB</strong></span>
                  <span>Free remaining: <strong className="text-emerald-700">{storage.internal.freeMB.toLocaleString()} MB</strong></span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-200 rounded-full h-2 mt-2 overflow-hidden">
                  <div
                    className="bg-[#4a2e18] h-2 rounded-full"
                    style={{
                      width: `${((storage.internal.totalMB - storage.internal.freeMB) / storage.internal.totalMB) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* External inserted (SD card) storage Container */}
              <div
                onClick={() => onUpdateSettings({ storageLocation: 'sdcard' })}
                role="button"
                tabIndex={0}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition ${
                  settings.storageLocation === 'sdcard'
                    ? 'border-[#4a2e18] bg-amber-50/50 shadow-xs'
                    : 'border-stone-200 bg-stone-50 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <HardDrive className="w-4 h-4 text-[#4a2e18]" />
                    <span className="text-xs font-bold text-[#4a2e18]">
                      {storage.sdcard.title}
                    </span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      settings.storageLocation === 'sdcard'
                        ? 'border-[#4a2e18] bg-[#4a2e18]'
                        : 'border-stone-300 bg-white'
                    }`}
                  >
                    {settings.storageLocation === 'sdcard' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </div>

                <div className="text-xs text-stone-600 flex justify-between">
                  <span>Total: <strong>{storage.sdcard.totalMB.toLocaleString()} MB</strong></span>
                  <span>Free remaining: <strong className="text-emerald-700">{storage.sdcard.freeMB.toLocaleString()} MB</strong></span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-200 rounded-full h-2 mt-2 overflow-hidden">
                  <div
                    className="bg-[#4a2e18] h-2 rounded-full"
                    style={{
                      width: `${((storage.sdcard.totalMB - storage.sdcard.freeMB) / storage.sdcard.totalMB) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 6. Reset settings button (Over 90% rounded corners) */}
          <section className="space-y-2">
            <span className="font-bold text-sm text-[#4a2e18]">Reset settings</span>
            <p className="text-xs text-stone-600">Reset all functions to defaults</p>
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  if (isChangedFromDefault) {
                    onResetSettings();
                    showToast('All app settings have been reset to defaults.');
                  }
                }}
                disabled={!isChangedFromDefault}
                className={`flex items-center space-x-2 px-6 py-2.5 rounded-full text-xs font-bold transition shadow-xs ${
                  isChangedFromDefault
                    ? 'bg-[#4a2e18] text-white hover:bg-[#382212] cursor-pointer'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed opacity-60'
                }`}
                title={
                  isChangedFromDefault
                    ? 'Reset all settings back to default values'
                    : 'No changes detected. Reset button is inactive.'
                }
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </section>
        </div>

        {/* Footer (Over 90% rounded corners button) */}
        <div className="px-5 py-3 border-t-2 border-[#4a2e18] bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#4a2e18] text-white rounded-full font-semibold text-xs hover:bg-[#382212] transition shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
