import * as Dialog from '@radix-ui/react-dialog'
import React from 'react'

import { IconCross } from '~/icons'

export default function Modal({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog.Root>
  )
}

function ModalContent({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="z-10 fixed inset-0 bg-black/50 data-[state=open]:animate-[overlay-show_200ms] data-[state=closed]:animate-[overlay-hide_200ms]" />
      <Dialog.Content className="z-20 fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-8 shadow data-[state=open]:animate-[dialog-show_200ms] data-[state=closed]:animate-[dialog-hide_200ms] text-gray-600">
        <div className="flex items-center justify-between gap-4">
          <Dialog.Title className="text-xl text-black font-medium">{title}</Dialog.Title>
          <Dialog.Close className="hover:text-gray-700 focus-visible:ring-2 outline-none rounded-full ring-gray-600 ring-offset-2">
            <IconCross />
          </Dialog.Close>
        </div>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  )
}

Modal.Button = Dialog.Trigger
Modal.Close = Dialog.Close
Modal.Content = ModalContent
