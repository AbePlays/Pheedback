import { Button, Modal } from '~/components'
import { IconCross, IconLoading } from '~/icons'

type Props = {
  acceptHandler: () => void
  isSubmitting: boolean
}

export default function CommentDeletionDialog({ acceptHandler, isSubmitting }: Props) {
  return (
    <Modal>
      <Modal.Button asChild>
        <Button
          aria-label="Delete Comment"
          className="rounded-full p-1 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 hover:dark:text-gray-400"
          title="Delete Comment"
          variant="unstyled"
        >
          <IconCross aria-hidden />
        </Button>
      </Modal.Button>
      <Modal.Content title="Are you absolutely sure?">
        <p className="mt-6">
          This action cannot be undone. This will permanently delete your comment and remove your data from our servers.
        </p>

        <div className="mt-6 flex gap-4 justify-end">
          <Modal.Close asChild>
            <Button className="bg-red-600 focus:ring-red-600 max-w-fit" disabled={isSubmitting}>
              Cancel
            </Button>
          </Modal.Close>
          <Button className="max-w-fit" disabled={isSubmitting} onClick={acceptHandler}>
            {isSubmitting ? <IconLoading className="mr-2" /> : null}
            Okay
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  )
}
