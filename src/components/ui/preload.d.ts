import { ElectronHandler } from '@/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electronHandler: ElectronHandler;
  }
}

export {};