import * as Dialog from '@radix-ui/react-dialog'

import { Button } from '~/components'
import { IconCross, IconLoading } from '~/icons'

type Props = {
  acceptHandler: () => void
  isSubmitting: boolean
}

export default function CommentDeletionDialog({ acceptHandler, isSubmitting }: Props) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          aria-label="Delete Comment"
          className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 hover:dark:text-gray-400"
          title="Delete Comment"
          variant="unstyled"
        >
          <IconCross />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-[overlay-show_200ms] data-[state=closed]:animate-[overlay-hide_200ms] bg-black/30 z-10 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="z-20 data-[state=open]:animate-[dialog-show_200ms] data-[state=closed]:animate-[dialog-hide_200ms] fixed top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-8 shadow-lg focus:outline-none">
          <Dialog.Title className="text-xl font-medium">Are you absolutely sure?</Dialog.Title>
          <Dialog.Description className="text-gray-500 mt-6 leading-normal">
            This action cannot be undone. This will permanently delete your comment and remove your data from our
            servers.
          </Dialog.Description>
          <Dialog.Close asChild>
            <button
              aria-label="Close"
              className="absolute top-4 right-4 inline-flex h-6 w-6 appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none hover:bg-gray-200"
              disabled={isSubmitting}
            >
              <IconCross />
            </button>
          </Dialog.Close>

          <div className="mt-6 flex gap-4 justify-end">
            <Dialog.Close asChild>
              <Button
                className="bg-red-600 focus:ring-red-600 max-w-fit"
                disabled={isSubmitting}
                onClick={acceptHandler}
              >
                Cancel
              </Button>
            </Dialog.Close>
            <Button className="max-w-fit" disabled={isSubmitting} onClick={acceptHandler}>
              {isSubmitting ? <IconLoading className="mr-2" /> : null}
              Okay
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
