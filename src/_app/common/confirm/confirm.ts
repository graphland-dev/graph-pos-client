import { modals } from "@mantine/modals";

interface IConfirmModal {
  title: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  isDangerous?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
}

export const confirmModal = (args: IConfirmModal) => {
  modals.openConfirmModal({
    title: args.title,
    labels: {
      confirm: args.confirmLabel ?? "Confirm",
      cancel: args.cancelLabel ?? "Cancel",
    },
    onCancel: args.onCancel,
    onConfirm: args.onConfirm,
    confirmProps: { color: args.isDangerous ? "red" : undefined },
  });
};
