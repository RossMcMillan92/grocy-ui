"use client"
import { DetailedChore } from "types/grocy"
import { useRouter } from "next/navigation"
import Button from "components/ui/Button"
import DynamicForm from "components/ui/DynamicForm"
import Modal from "components/ui/Modal"
import React from "react"
import classNames from "helpers/classNames"

const RemoveChoreModal: React.FC<{
  chore: DetailedChore
}> = ({ chore }) => {
  const [status, setStatus] = React.useState<
    "pending" | "editing-chore" | "removing-chore" | "tracking-chore"
  >("pending")
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
      const timeout = setTimeout(() => setStatus("pending"), 1500)
      return () => clearTimeout(timeout)
    }
  }, [formStatus])

  return (
    <>
      <button
        className={classNames(
          "flex items-center justify-center",
          "px-4 py-2 mt-4 rounded",
          "bg-gray-100 text-gray-700",
        )}
        onClick={() => setStatus("removing-chore")}
      >
        Remove
      </button>
      {status === "removing-chore" ? (
        <Modal title="Remove chore" onRequestClose={() => setStatus("pending")}>
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
                  onClick={() => setStatus("pending")}
                >
                  Cancel
                </Button.Secondary>
              </>
            )}
          </DynamicForm>
        </Modal>
      ) : null}
    </>
  )
}

export default RemoveChoreModal
