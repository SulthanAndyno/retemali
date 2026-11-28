import type { ReactNode } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';

interface BookFilterSheetProps {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
  onResetDraft: () => void;
  onApply: () => void;
}

export function BookFilterSheet({
  open,
  title,
  description,
  children,
  onClose,
  onResetDraft,
  onApply,
}: BookFilterSheetProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      variant="sheet"
      footer={
        <div className="flex w-full gap-2">
          <Button
            type="button"
            variant="secondary"
            size="md"
            className="flex-1"
            onClick={onResetDraft}
          >
            Atur ulang
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            className="flex-1"
            onClick={onApply}
          >
            Terapkan Filter
          </Button>
        </div>
      }
    >
      <div className="space-y-5">{children}</div>
    </Modal>
  );
}
