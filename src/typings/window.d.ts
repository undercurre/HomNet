import { IpcRenderer } from "electron";

declare global {
  interface Window {
    api: IpcRenderer;
  }
  interface Navigator {
    msSaveOrOpenBlob: (blob: Blob, fileName: string) => void;
    browserLanguage: string;
  }
}

export {};
