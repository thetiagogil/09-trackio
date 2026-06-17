"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";

type ModalProps = {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

export const Modal = ({ children, onClose, open, title }: ModalProps) => {
  return (
    <DialogPrimitive.Root
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
      open={open}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80" />
        <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none">
          <Card className="overflow-visible p-6" gradient tone="primary">
            <div className="relative mb-5 flex items-center justify-between gap-3">
              <DialogPrimitive.Title className="font-display text-glow-primary text-sm tracking-wider uppercase">
                {title}
              </DialogPrimitive.Title>
              <DialogPrimitive.Close asChild>
                <Button aria-label="Close" size="icon" variant="ghost">
                  <X className="h-4 w-4" />
                </Button>
              </DialogPrimitive.Close>
            </div>
            <div className="relative">{children}</div>
          </Card>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
