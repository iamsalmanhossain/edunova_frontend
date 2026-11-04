/**
 * Reliable cross-browser and mobile blob file downloader.
 * Ensures direct in-page file streaming without popup blocking or blank tab triggers.
 */
export function triggerFileDownload(blob: Blob, filename: string): void {
  if (typeof window === "undefined" || !blob) return;

  if (blob.size === 0) {
    throw new Error("Downloaded file is empty (0 bytes received).");
  }

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.setAttribute("download", filename);
  a.download = filename;

  document.body.appendChild(a);
  a.click();

  // Extend timeout to 10s to ensure mobile browsers and slow disks start downloading before revoke
  setTimeout(() => {
    try {
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
      window.URL.revokeObjectURL(url);
    } catch {
      // Ignore cleanup error
    }
  }, 10000);
}
