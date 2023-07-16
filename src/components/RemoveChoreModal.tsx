"use client"
import { DetailedChore } from "types/grocy"
import { useRouter } from "next/navigation"
import Button from "components/ui/Button"
import DynamicForm from "components/ui/DynamicForm"
import Modal from "components/ui/Modal"
import React from "react"

const RemoveChoreModal: React.FC<{
  chore: DetailedChore
  onClose: () => void
}> = ({ chore, onClose }) => {
  const [formStatus, setFormStatus] = React.useState<
    "pending" | "submitting" | "successful"
  >("pending")
  const { refresh } = useRouter()

  const onSuccess = () => {
    setFormStatus("successful")
    refresh()
  }

  React.useEffect(() => {
    if (formStatus === "successful") {
      const timeout = setTimeout(onClose, 1500)
      return () => clearTimeout(timeout)
    }
  }, [formStatus])

  return (
    <Modal title="Remove chore" onRequestClose={onClose}>
      <DynamicForm
        action={`/api/objects/chores/${chore.chore.id}`}
        method="DELETE"
        onSuccess={onSuccess}
        className="p-4 sm:p-6"
      >
        {() => (
          <>
            <Button.Warning type="submit" className="block w-full mb-4">
              Remove
            </Button.Warning>
            <Button.Secondary
              className="block w-full"
              onClick={() => onClose()}
            >
              Cancel
            </Button.Secondary>
          </>
        )}
      </DynamicForm>
    </Modal>
  )
}

export default RemoveChoreModal
