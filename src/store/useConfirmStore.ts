import { create } from "zustand";

export type ConfirmVariant = "default" | "destructive" | "warning";

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

interface ConfirmStoreState {
  isOpen: boolean;
  isLoading: boolean;
  options: ConfirmOptions | null;
  openConfirm: (options: ConfirmOptions) => void;
  closeConfirm: () => void;
  setLoading: (loading: boolean) => void;
}

export const useConfirmStore = create<ConfirmStoreState>((set) => ({
  isOpen: false,
  isLoading: false,
  options: null,
  openConfirm: (options) =>
    set({
      isOpen: true,
      isLoading: false,
      options,
    }),
  closeConfirm: () =>
    set({
      isOpen: false,
      isLoading: false,
      options: null,
    }),
  setLoading: (isLoading) => set({ isLoading }),
}));

/**
 * Universal Promise-based confirmation dialog dispatcher.
 * Returns true if user confirmed, false if cancelled or dismissed.
 * Example:
 *   const confirmed = await appConfirm({
 *     title: "Approve Registration",
 *     message: "Are you sure you want to approve registration for John Doe?",
 *     confirmText: "Approve Faculty",
 *     variant: "default",
 *   });
 *   if (!confirmed) return;
 */
export const appConfirm = (options: ConfirmOptions): Promise<boolean> => {
  return new Promise((resolve) => {
    useConfirmStore.getState().openConfirm({
      ...options,
      onConfirm: async () => {
        try {
          useConfirmStore.getState().setLoading(true);
          if (options.onConfirm) {
            await options.onConfirm();
          }
          useConfirmStore.getState().closeConfirm();
          resolve(true);
        } catch (err) {
          useConfirmStore.getState().setLoading(false);
          throw err;
        }
      },
      onCancel: () => {
        if (options.onCancel) {
          options.onCancel();
        }
        useConfirmStore.getState().closeConfirm();
        resolve(false);
      },
    });
  });
};
