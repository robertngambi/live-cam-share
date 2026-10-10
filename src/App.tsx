/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppSettings, CameraMode, ConnectedDevice, MediaItem, StorageInfo, StorageTarget } from './types';
import { AVAILABLE_DEVICES, DEFAULT_SETTINGS, INITIAL_STORAGE } from './constants';
import { TopBar } from './components/TopBar';
import { CameraView } from './components/CameraView';
import { FramesModal } from './components/FramesModal';
import { SettingsModal } from './components/SettingsModal';
import { AboutModal } from './components/AboutModal';
import { HelpModal } from './components/HelpModal';
import { VideoSaveConfirmModal } from './components/VideoSaveConfirmModal';
import { MediaViewerModal } from './components/MediaViewerModal';
import { RemoteMonitorModal } from './components/RemoteMonitorModal';
import { RecentsModal } from './components/RecentsModal';
import { PHOTO_FRAMES, VIDEO_FRAMES } from './utils/frames';

export default function App() {
  // App settings state
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('live_share_camera_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved settings', e);
    }
    return DEFAULT_SETTINGS;
  });

  // Storage info state
  const [storage, setStorage] = useState<{ internal: StorageInfo; sdcard: StorageInfo }>(() => {
    try {
      const saved = localStorage.getItem('live_share_camera_storage');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse storage', e);
    }
    return INITIAL_STORAGE;
  });

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('live_share_camera_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings', e);
    }
  }, [settings]);

  // Save storage to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('live_share_camera_storage', JSON.stringify(storage));
    } catch (e) {
      console.warn('Failed to save storage', e);
    }
  }, [storage]);

  // Active Camera Mode: 'photo' | 'video'
  const [mode, setMode] = useState<CameraMode>('photo');

  // Screen rotation state (Rotate / Unrotate button)
  const [isRotated, setIsRotated] = useState(false);

  // Selected frame id
  const [selectedFrameId, setSelectedFrameId] = useState<string>('none');

  // Available devices list
  const [availableDevices, setAvailableDevices] = useState<ConnectedDevice[]>(AVAILABLE_DEVICES);
  const [isRefreshingDevices, setIsRefreshingDevices] = useState(false);

  // Saved Media Items List
  const [savedMedia, setSavedMedia] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem('live_share_camera_media');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved media', e);
    }
    return [];
  });

  // Save media items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('live_share_camera_media', JSON.stringify(savedMedia));
    } catch (e) {
      console.warn('Failed to save media', e);
    }
  }, [savedMedia]);

  // Modal display states
  const [isFramesOpen, setIsFramesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isRecentsOpen, setIsRecentsOpen] = useState(false);

  // Video Save Confirmation state
  const [pendingVideo, setPendingVideo] = useState<{
    blob: Blob;
    url: string;
    durationSeconds: number;
    durationFormatted: string;
  } | null>(null);

  // Remote monitor viewer (for Receive mode)
  const [isRemoteMonitorOpen, setIsRemoteMonitorOpen] = useState(false);

  // Switch frame when mode switches if current frame is not compatible
  useEffect(() => {
    if (selectedFrameId === 'none') return;
    const isPhotoFrame = PHOTO_FRAMES.some((f) => f.id === selectedFrameId);
    const isVideoFrame = VIDEO_FRAMES.some((f) => f.id === selectedFrameId);
    if (mode === 'photo' && !isPhotoFrame) {
      setSelectedFrameId('none');
    } else if (mode === 'video' && !isVideoFrame) {
      setSelectedFrameId('none');
    }
  }, [mode, selectedFrameId]);

  // Handle Refreshing Devices
  const handleRefreshDevices = () => {
    setIsRefreshingDevices(true);
    setTimeout(() => {
      // Simulate discovering or updating signals
      setAvailableDevices((prev) =>
        prev.map((d) => ({
          ...d,
          signalStrength: Math.min(100, Math.max(60, d.signalStrength + Math.floor(Math.random() * 9) - 4)),
        }))
      );
      setIsRefreshingDevices(false);
    }, 800);
  };

  // Update Settings
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  // Reset Settings to defaults
  const handleResetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  // Deduct storage capacity
  const deductStorage = (target: StorageTarget, sizeMB: number) => {
    setStorage((prev) => {
      const current = prev[target];
      const newFree = Math.max(0, current.freeMB - Math.round(sizeMB));
      const newUsed = current.totalMB - newFree;
      return {
        ...prev,
        [target]: {
          ...current,
          freeMB: newFree,
          usedMB: newUsed,
        },
      };
    });
  };

  // Handle Captured Photo
  const handleCapturePhoto = (dataUrl: string, width: number, height: number) => {
    const sizeMB = Number(((width * height * 3) / (1024 * 1024 * 6)).toFixed(2)); // estimated jpeg size ~2-4MB
    const targetStorage = settings.storageLocation;
    deductStorage(targetStorage, sizeMB);

    const newItem: MediaItem = {
      id: `photo-${Date.now()}`,
      type: 'photo',
      url: dataUrl,
      timestamp: Date.now(),
      sizeMB,
      width,
      height,
      frameId: selectedFrameId,
      storageTarget: targetStorage,
    };

    setSavedMedia((prev) => [newItem, ...prev]);
  };

  // Handle Finished Video Recording (prompts confirmation dialog)
  const handleFinishVideo = (blob: Blob, durationSeconds: number, durationFormatted: string) => {
    const videoUrl = URL.createObjectURL(blob);
    setPendingVideo({
      blob,
      url: videoUrl,
      durationSeconds,
      durationFormatted,
    });
  };

  // Confirm saving video
  const handleConfirmSaveVideo = () => {
    if (!pendingVideo) return;

    const sizeMB = Number(
      Math.max(0.5, (pendingVideo.durationSeconds * 2.2)).toFixed(2)
    );
    const targetStorage = settings.storageLocation;
    deductStorage(targetStorage, sizeMB);

    const newItem: MediaItem = {
      id: `video-${Date.now()}`,
      type: 'video',
      url: pendingVideo.url,
      timestamp: Date.now(),
      duration: pendingVideo.durationSeconds,
      durationFormatted: pendingVideo.durationFormatted,
      sizeMB,
      width: 1920,
      height: 1080,
      frameId: selectedFrameId,
      storageTarget: targetStorage,
    };

    setSavedMedia((prev) => [newItem, ...prev]);
    setPendingVideo(null);
  };

  // Cancel saving video
  const handleCancelSaveVideo = () => {
    if (pendingVideo?.url) {
      URL.revokeObjectURL(pendingVideo.url);
    }
    setPendingVideo(null);
  };

  // Delete media item
  const handleDeleteMedia = (id: string) => {
    setSavedMedia((prev) => {
      const next = prev.filter((m) => m.id !== id);
      if (next.length === 0) {
        setIsMediaViewerOpen(false);
      } else {
        setActiveMediaIndex(0);
      }
      return next;
    });
  };

  // Open Media Viewer at specific item
  const handleOpenMediaViewer = () => {
    if (savedMedia.length > 0) {
      setActiveMediaIndex(0);
      setIsMediaViewerOpen(true);
    }
  };

  // Latest saved media item (displayed in rounded rectangle left of capture button)
  const lastSavedMedia = savedMedia[0] || null;

  // Selected frame object name
  const currentFrameObj =
    mode === 'photo'
      ? PHOTO_FRAMES.find((f) => f.id === selectedFrameId)
      : VIDEO_FRAMES.find((f) => f.id === selectedFrameId);

  // Active sharing status:
  // Sharing is active when in 'send' mode with at least 1 device selected,
  // or in 'receive' mode with a device connected.
  const isSharingActive =
    (settings.connectionType === 'send' && settings.selectedSendDevices.length > 0) ||
    (settings.connectionType === 'receive' && !!settings.selectedReceiveDevice);

  const connectedDevicesCount =
    settings.connectionType === 'send'
      ? settings.selectedSendDevices.length
      : settings.selectedReceiveDevice
        ? 1
        : 0;

  // Active receive device obj
  const activeReceiveDeviceObj =
    availableDevices.find((d) => d.id === settings.selectedReceiveDevice) || null;

  return (
    <div className="flex flex-col h-screen w-screen bg-white text-[#4a2e18] overflow-hidden select-none">
      {/* Top Bar (Header)
          "header (top bar), footer and the entire screen should have same (white) automatic color,
          only that the top bar and the footer are separated from the main screen by dark brown border." */}
      <TopBar
        isRotated={isRotated}
        onToggleRotate={() => setIsRotated((prev) => !prev)}
        connectionMethod={settings.connectionMethod}
        isSharingActive={isSharingActive}
        onOpenFrames={() => setIsFramesOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        activeFrameName={currentFrameObj?.name}
        connectedDevicesCount={connectedDevicesCount}
      />

      {/* Main Screen (Camera Interface) */}
      <CameraView
        mode={mode}
        onSetMode={setMode}
        settings={settings}
        isRotated={isRotated}
        selectedFrameId={selectedFrameId}
        onCapturePhoto={handleCapturePhoto}
        onFinishVideo={handleFinishVideo}
        lastSavedMedia={lastSavedMedia}
        onOpenMediaViewer={handleOpenMediaViewer}
        onOpenRecents={() => setIsRecentsOpen(true)}
        totalMediaCount={savedMedia.length}
      />

      {/* Video Save Confirmation Modal
          “Click on 'OK' button to save your video",
          'Cancel' on left, 'OK' on right */}
      <VideoSaveConfirmModal
        isOpen={pendingVideo !== null}
        durationFormatted={pendingVideo?.durationFormatted || '00.00.00'}
        storageTarget={settings.storageLocation}
        onConfirmSave={handleConfirmSaveVideo}
        onCancelSave={handleCancelSaveVideo}
      />

      {/* Frames Selection Modal */}
      <FramesModal
        isOpen={isFramesOpen}
        onClose={() => setIsFramesOpen(false)}
        currentMode={mode}
        selectedFrameId={selectedFrameId}
        onSelectFrame={setSelectedFrameId}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetSettings={handleResetSettings}
        storage={storage}
        availableDevices={availableDevices}
        onRefreshDevices={handleRefreshDevices}
        isRefreshingDevices={isRefreshingDevices}
      />

      {/* About The App Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Recents Modal (File locations: Internal storage & SD card) */}
      <RecentsModal
        isOpen={isRecentsOpen}
        onClose={() => setIsRecentsOpen(false)}
        mediaList={savedMedia}
        onOpenMediaItem={(item) => {
          const idx = savedMedia.findIndex((m) => m.id === item.id);
          setActiveMediaIndex(idx >= 0 ? idx : 0);
          setIsRecentsOpen(false);
          setIsMediaViewerOpen(true);
        }}
        onDeleteMedia={handleDeleteMedia}
      />

      {/* Media Viewer Modal */}
      <MediaViewerModal
        isOpen={isMediaViewerOpen}
        onClose={() => setIsMediaViewerOpen(false)}
        mediaList={savedMedia}
        currentIndex={activeMediaIndex}
        onSelectIndex={setActiveMediaIndex}
        onDeleteMedia={handleDeleteMedia}
      />

      {/* Remote Monitor Viewer (When in receive mode) */}
      <RemoteMonitorModal
        isOpen={isRemoteMonitorOpen}
        onClose={() => setIsRemoteMonitorOpen(false)}
        selectedDevice={activeReceiveDeviceObj}
        connectionMethod={settings.connectionMethod}
      />
    </div>
  );
}
