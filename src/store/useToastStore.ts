import { create } from "zustand";

export interface ToastItem {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title?: string;
  message: string;
  duration?: number;
}

interface ToastStore {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  showToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, toast.duration || 4500);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  success: (message, title) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, type: "success", message, title }],
    }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4500);
  },
  error: (message, title) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, type: "error", message, title }],
    }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 5500);
  },
  info: (message, title) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, type: "info", message, title }],
    }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4500);
  },
  warning: (message, title) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, type: "warning", message, title }],
    }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 5000);
  },
}));

/**
 * Universal Toast Dispatcher callable from anywhere (components, hooks, utilities)
 */
export const appToast = {
  success: (message: string, title?: string) => useToastStore.getState().success(message, title),
  error: (message: string, title?: string) => useToastStore.getState().error(message, title),
  info: (message: string, title?: string) => useToastStore.getState().info(message, title),
  warning: (message: string, title?: string) => useToastStore.getState().warning(message, title),
  attendanceSaved: (count?: number) =>
    useToastStore.getState().success(
      count !== undefined ? `Attendance record for ${count} students saved successfully.` : "Attendance saved successfully.",
      "Attendance Recorded"
    ),
  resultPublished: (subject?: string) =>
    useToastStore.getState().success(
      subject ? `Assessment results for ${subject} submitted successfully.` : "Examination results submitted successfully.",
      "Results Saved"
    ),
  diaryCreated: () =>
    useToastStore.getState().success(
      "Classroom diary entry published and visible to students.",
      "Diary Published"
    ),
};

