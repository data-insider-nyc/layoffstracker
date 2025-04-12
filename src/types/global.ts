declare global {
  interface Navigator {
    msSaveBlob?: (blob: Blob, defaultName?: string) => boolean;
  }
}
