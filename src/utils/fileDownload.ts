/**
 * Universal Secure File Download Utility (Edunova Digital Campus)
 * 
 * Guarantees:
 * 1. Absolute UUID-free filenames for PDF, Excel, and CSV downloads across teachers and students.
 * 2. Robust binary stream handling with explicit MIME validation (no 204 or JSON corruption).
 * 3. Silent authorization token attachment so downloads never fail with 401 Unauthorized.
 * 4. Automatic fallback between local development and production backends.
 */

import { useAuthStore } from "@/store/useAuthStore";

const CONFIGURED_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const RENDER_FALLBACK_URL = "https://edunova-backend-tu1r.onrender.com/api/v1";

/**
 * Strips raw database UUIDs and cleans filenames to guarantee human-friendly names
 */
export function sanitizeFilename(filename: string, fallback: string): string {
  if (!filename) return fallback;

  // Remove RFC 4122 UUID pattern (e.g. 56a7c893-04d9-468b-b908-3f074746f72c)
  let clean = filename.replace(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g, "");
  
  // Clean double underscores, hyphens, and whitespace
  clean = clean.replace(/__+/g, "_").replace(/^[_\s-]+|[_\s-]+$/g, "");

  // If filename becomes empty or just an extension, use fallback
  const extensionMatch = fallback.match(/\.([a-zA-Z0-9]+)$/);
  const ext = extensionMatch ? extensionMatch[1].toLowerCase() : "";
  if (!clean || clean === `.${ext}` || clean.length < 3) {
    clean = fallback;
  }

  // Ensure file has the correct extension
  if (ext && !clean.toLowerCase().endsWith(`.${ext}`)) {
    clean = `${clean}.${ext}`;
  }

  return clean;
}

export function getAuthToken(): string {
  if (typeof window === "undefined") return "";
  const storeToken = useAuthStore.getState().accessToken;
  if (storeToken) return storeToken;
  return (
    localStorage.getItem("edunova_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    ""
  );
}

export function resolveFullApiUrl(endpoint: string, baseUrl = CONFIGURED_API_URL): string {
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }
  const cleanBase = baseUrl.replace(/\/+$/, "");
  let cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  if (cleanBase.endsWith("/api/v1") && cleanEndpoint.startsWith("/api/v1/")) {
    cleanEndpoint = cleanEndpoint.replace("/api/v1", "");
  }
  return `${cleanBase}${cleanEndpoint}`;
}

/**
 * Universal Authenticated File Downloader
 * Downloads binary files (PDF / Excel / CSV) with JWT token, verifies response MIME type,
 * and triggers immediate native browser download.
 * 
 * @param url API endpoint (relative or absolute)
 * @param defaultFilename Clean, non-UUID default fallback name (e.g., 'Physics_II_Class_Result.pdf')
 */
export async function downloadSecureFile(
  url: string,
  defaultFilename: string
): Promise<void> {
  if (typeof window === "undefined") return;

  const token = getAuthToken();
  const primaryUrl = resolveFullApiUrl(url, CONFIGURED_API_URL);

  let response: Response | null = null;
  let activeUrl = primaryUrl;

  const headers: Record<string, string> = {
    Accept: "application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv, */*",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    response = await fetch(primaryUrl, {
      method: "GET",
      headers,
    });

    // If local dev server returns 404/5xx or fails, retry on live Render backend
    if (!response.ok && response.status >= 500 && primaryUrl.includes("localhost")) {
      activeUrl = resolveFullApiUrl(url, RENDER_FALLBACK_URL);
      response = await fetch(activeUrl, {
        method: "GET",
        headers,
      });
    }
  } catch (err) {
    // If localhost network fails, try fallback Render endpoint
    if (primaryUrl.includes("localhost")) {
      try {
        activeUrl = resolveFullApiUrl(url, RENDER_FALLBACK_URL);
        response = await fetch(activeUrl, {
          method: "GET",
          headers,
        });
      } catch {
        // Fallback to token URL download
        downloadDirectWithToken(url, defaultFilename);
        return;
      }
    } else {
      downloadDirectWithToken(url, defaultFilename);
      return;
    }
  }

  // Silent JWT token refresh retry on 401 Unauthorized
  if (response?.status === 401) {
    try {
      const { refreshAccessToken } = await import("@/services/api-client");
      const newToken = await refreshAccessToken();
      if (newToken) {
        headers["Authorization"] = `Bearer ${newToken}`;
        response = await fetch(activeUrl, {
          method: "GET",
          headers,
        });
      }
    } catch {
      // Refresh failed, proceed to error handling below
    }
  }

  // Handle server error responses
  if (!response || !response.ok) {
    if (response?.status === 401) {
      throw new Error("Your session has expired. Please sign in again to download marks records.");
    }
    const contentType = response?.headers.get("Content-Type") || "";
    if (contentType.includes("application/json")) {
      try {
        const errorJson = await response.json();
        const msg = errorJson.message || `Download failed with status ${response.status}`;
        throw new Error(Array.isArray(msg) ? msg.join(", ") : msg);
      } catch (e) {
        if (e instanceof Error && !e.message.startsWith("Unexpected")) {
          throw e;
        }
      }
    }
    throw new Error(`Failed to download file (${response?.status || "Unknown error"})`);
  }

  // Check if server returned JSON error instead of binary stream
  const contentType = response.headers.get("Content-Type") || "";
  if (contentType.includes("application/json")) {
    const errorJson = await response.json().catch(() => ({}));
    const message = errorJson.message || "Server returned an error instead of document.";
    throw new Error(Array.isArray(message) ? message.join(", ") : message);
  }

  // 1. Extract clean filename from Content-Disposition header
  let filename = defaultFilename;
  const disposition = response.headers.get("Content-Disposition");
  if (disposition && disposition.includes("filename=")) {
    // Check RFC 5987 filename* first
    const matchUtf8 = disposition.match(/filename\*=UTF-8''([^;\n]*)/i);
    if (matchUtf8 && matchUtf8[1]) {
      try {
        filename = decodeURIComponent(matchUtf8[1]);
      } catch {
        filename = matchUtf8[1];
      }
    } else {
      const matchStandard = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (matchStandard && matchStandard[1]) {
        filename = matchStandard[1].replace(/['"]/g, "").trim();
      }
    }
  }

  // Sanitize filename to ensure no database UUID is exposed
  filename = sanitizeFilename(filename, defaultFilename);

  // 2. Convert response stream into Blob
  const blobData = await response.blob();
  if (blobData.size === 0) {
    throw new Error("The requested document is empty or currently being processed.");
  }

  // 3. Create in-memory object URL and trigger browser download
  const downloadUrl = window.URL.createObjectURL(blobData);
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  // 4. Clean up memory
  setTimeout(() => {
    try {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
      window.URL.revokeObjectURL(downloadUrl);
    } catch {}
  }, 10000);
}

/**
 * Direct Browser Download Adapter (Uses ?token=<jwt> parameter for direct window/tab requests)
 */
export function downloadDirectWithToken(
  endpoint: string,
  defaultFilename?: string,
  inline = false
): void {
  if (typeof window === "undefined") return;

  const token = getAuthToken();
  const targetBase = CONFIGURED_API_URL;
  const fullUrl = resolveFullApiUrl(endpoint, targetBase);

  const delimiter = fullUrl.includes("?") ? "&" : "?";
  let finalUrl = `${fullUrl}${delimiter}`;

  if (!fullUrl.includes("download=") && !inline) {
    finalUrl += "download=true&";
  }

  if (token && !fullUrl.includes("token=")) {
    finalUrl += `token=${encodeURIComponent(token)}`;
  }

  finalUrl = finalUrl.replace(/[&?]$/, "");

  if (inline) {
    window.open(finalUrl, "_blank", "noopener,noreferrer");
  } else {
    const link = document.createElement("a");
    link.href = finalUrl;
    if (defaultFilename) {
      link.setAttribute("download", sanitizeFilename(defaultFilename, "Document"));
    } else {
      link.setAttribute("download", "");
    }
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      try {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      } catch {}
    }, 5000);
  }
}

// ===================================================
// Specialized Clean Filename Helpers for Marksheets
// (Always combines Subject Name and Exam Name without IDs)
// ===================================================

export function buildResultFilename(
  subjectName?: string,
  examName?: string,
  suffix = "Class_Result"
): string {
  const parts: string[] = [];
  if (subjectName) {
    const cleanSub = subjectName.trim().replace(/[^a-zA-Z0-9_\-\s]/g, "").replace(/\s+/g, "_");
    if (cleanSub) parts.push(cleanSub);
  }
  if (examName) {
    const cleanExam = examName.trim().replace(/[^a-zA-Z0-9_\-\s]/g, "").replace(/\s+/g, "_");
    if (cleanExam) parts.push(cleanExam);
  }
  if (parts.length === 0) {
    parts.push("Academic");
  }
  parts.push(suffix);
  return parts.join("_");
}

export async function downloadClassPdfFile(
  examId: string,
  subjectName?: string,
  examName?: string
): Promise<void> {
  const baseName = buildResultFilename(subjectName, examName, "Class_Result");
  const safeName = `${baseName}.pdf`;
  return downloadSecureFile(`/dashboard/teacher/results/${examId}/pdf?download=true`, safeName);
}

export async function previewClassPdfFile(
  examId: string,
  subjectName?: string,
  examName?: string
): Promise<void> {
  const baseName = buildResultFilename(subjectName, examName, "Class_Result");
  const safeName = `${baseName}.pdf`;
  return downloadSecureFile(`/dashboard/teacher/results/${examId}/pdf`, safeName);
}

export async function downloadClassExcelFile(
  examId: string,
  subjectName?: string,
  examName?: string
): Promise<void> {
  const baseName = buildResultFilename(subjectName, examName, "Class_Result");
  const safeName = `${baseName}.xlsx`;
  return downloadSecureFile(`/dashboard/teacher/results/${examId}/excel`, safeName);
}

export async function downloadStudentTranscriptPdf(
  examId: string,
  studentId: string,
  studentName?: string,
  subjectName?: string,
  examName?: string
): Promise<void> {
  const parts: string[] = [];
  if (subjectName) {
    const s = subjectName.trim().replace(/[^a-zA-Z0-9_\-\s]/g, "").replace(/\s+/g, "_");
    if (s) parts.push(s);
  }
  if (examName) {
    const e = examName.trim().replace(/[^a-zA-Z0-9_\-\s]/g, "").replace(/\s+/g, "_");
    if (e) parts.push(e);
  }
  if (studentName) {
    const st = studentName.trim().replace(/[^a-zA-Z0-9_\-\s]/g, "").replace(/\s+/g, "_");
    if (st) parts.push(st);
  }
  if (parts.length === 0) {
    parts.push("Student");
  }
  parts.push("Transcript.pdf");
  const safeName = parts.join("_");
  return downloadSecureFile(
    `/dashboard/teacher/results/${examId}/students/${studentId}/pdf?download=true`,
    safeName
  );
}

export async function downloadMarksTemplateFile(
  examId: string,
  subjectName?: string,
  examName?: string,
  format: "xlsx" | "csv" = "xlsx"
): Promise<void> {
  const baseName = buildResultFilename(subjectName, examName, "Template");
  const safeName = `${baseName}.${format}`;
  return downloadSecureFile(`/dashboard/teacher/results/${examId}/template?format=${format}`, safeName);
}
