import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";

interface IConfirmModal {
  title: string;
  description?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  isDangerous?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
}

export const confirmModal = (args: IConfirmModal) => {
  modals.openConfirmModal({
    title: <Text size={"lg"}>{args.title}</Text>,
    children: args?.description && <Text>{args?.description}</Text>,
    labels: {
      confirm: args.confirmLabel ?? "Confirm",
      cancel: args.cancelLabel ?? "Cancel",
    },
    onCancel: args.onCancel,
    onConfirm: args.onConfirm,
    confirmProps: { color: args.isDangerous ? "red" : undefined },
  });
};
