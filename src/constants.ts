import { AppSettings, ConnectedDevice, PictureSize, StorageInfo } from './types';

export const PICTURE_SIZES: PictureSize[] = [
  {
    id: '16:9',
    label: '16:9 (8M) 3840x2160',
    resolution: '3840x2160',
    width: 3840,
    height: 2160,
    aspectRatio: '16 / 9',
  },
  {
    id: '4:3',
    label: '4:3 (5M) 2560x1920',
    resolution: '2560x1920',
    width: 2560,
    height: 1920,
    aspectRatio: '4 / 3',
  },
  {
    id: '1:1',
    label: '1:1 (4M) 1920x1920',
    resolution: '1920x1920',
    width: 1920,
    height: 1920,
    aspectRatio: '1 / 1',
  },
  {
    id: '19.5:9',
    label: '19.5:9 (3M) 2496x1152',
    resolution: '2496x1152',
    width: 2496,
    height: 1152,
    aspectRatio: '19.5 / 9',
  },
  {
    id: '3:2',
    label: '3:2 (2M) 1728x1152',
    resolution: '1728x1152',
    width: 1728,
    height: 1152,
    aspectRatio: '3 / 2',
  },
];

export const DEFAULT_SETTINGS: AppSettings = {
  shutterSound: true,
  delayCapture: 'off',
  pictureSize: '4:3',
  connectionMethod: 'wifi',
  connectionType: 'send',
  selectedSendDevices: ['dev-pixel-8'],
  selectedReceiveDevice: null,
  storageLocation: 'internal',
};

export const INITIAL_STORAGE: { internal: StorageInfo; sdcard: StorageInfo } = {
  internal: {
    type: 'internal',
    title: 'Internal Storage',
    totalMB: 64000,
    freeMB: 42150,
    usedMB: 21850,
  },
  sdcard: {
    type: 'sdcard',
    title: 'External SD Card',
    totalMB: 128000,
    freeMB: 98420,
    usedMB: 29580,
  },
};

export const AVAILABLE_DEVICES: ConnectedDevice[] = [
  {
    id: 'dev-pixel-8',
    name: 'Google Pixel 8 Pro',
    type: 'phone',
    os: 'Android 14',
    ipOrAddress: '192.168.1.104',
    signalStrength: 96,
    connected: true,
  },
  {
    id: 'dev-galaxy-s24',
    name: 'Samsung Galaxy S24 Ultra',
    type: 'phone',
    os: 'Android 14',
    ipOrAddress: '192.168.1.112',
    signalStrength: 88,
    connected: true,
  },
  {
    id: 'dev-ipad-pro',
    name: 'iPad Pro 12.9"',
    type: 'tablet',
    os: 'iPadOS 17.5',
    ipOrAddress: '192.168.1.120',
    signalStrength: 82,
    connected: true,
  },
  {
    id: 'dev-macbook-pro',
    name: 'MacBook Pro M3 Studio',
    type: 'laptop',
    os: 'macOS Sonoma',
    ipOrAddress: '192.168.1.145',
    signalStrength: 94,
    connected: false,
  },
  {
    id: 'dev-bravia-tv',
    name: 'Sony Bravia 4K Screen',
    type: 'tv',
    os: 'Google TV',
    ipOrAddress: '192.168.1.180',
    signalStrength: 75,
    connected: false,
  },
];
