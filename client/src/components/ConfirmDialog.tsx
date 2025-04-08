import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useLocalization } from "../lib/LocalizationContext";

type ConfirmDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
};

export function ConfirmDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  onConfirm,
}: ConfirmDialogProps) {
  const { t } = useLocalization();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500"
          >
            {t("common.delete")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
