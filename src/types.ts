export type CameraMode = 'photo' | 'video';

export type DelayCapture = 'off' | '3s' | '5s' | '10s';

export type PictureSizeId = '4:3' | '1:1' | '19.5:9' | '16:9' | '3:2';

export interface PictureSize {
  id: PictureSizeId;
  label: string;
  resolution: string;
  width: number;
  height: number;
  aspectRatio: string;
}

export type ConnectionMethod = 'usb' | 'bluetooth' | 'wifi';
export type ConnectionType = 'send' | 'receive';

export interface ConnectedDevice {
  id: string;
  name: string;
  type: 'phone' | 'tablet' | 'laptop' | 'tv';
  os: string;
  ipOrAddress: string;
  signalStrength: number; // 1-100
  connected: boolean;
}

export type StorageTarget = 'internal' | 'sdcard';

export interface StorageInfo {
  type: StorageTarget;
  title: string;
  totalMB: number;
  freeMB: number;
  usedMB: number;
}

export interface AppSettings {
  shutterSound: boolean;
  delayCapture: DelayCapture;
  pictureSize: PictureSizeId;
  connectionMethod: ConnectionMethod;
  connectionType: ConnectionType;
  selectedSendDevices: string[]; // max 3
  selectedReceiveDevice: string | null;
  storageLocation: StorageTarget;
}

export interface FrameOption {
  id: string;
  name: string;
  mode: CameraMode;
  description: string;
  borderStyle?: string;
  accentColor?: string;
}

export interface MediaItem {
  id: string;
  type: CameraMode;
  url: string;
  timestamp: number;
  duration?: number; // seconds, for video
  durationFormatted?: string;
  sizeMB: number;
  width: number;
  height: number;
  frameId?: string;
  storageTarget: StorageTarget;
}
