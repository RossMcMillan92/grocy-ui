import classNames from "helpers/classNames"
import { Chore } from "types/grocy"
import { useQueryCache } from "react-query"
import React from "react"
import Modal from "components/ui/Modal"
import { useUsers } from "contexts/users"
import Button from "components/ui/Button"
import DynamicForm from "components/ui/DynamicForm"
import RadiosField from "./ui/RadiosField"
import InputField from "./ui/InputField"
import TextareaField from "./ui/TextareaField"
import CheckboxesField from "./ui/CheckboxesField"
import { omit, prop, uniq } from "ramda"

const AddChoreModal: React.FC<{
  chores: Chore[]
  onClose: () => void
}> = ({ chores, onClose }) => {
  const users = useUsers()
  const [currentPage, setCurrentPage] = React.useState(1)
  const [formStatus, setFormStatus] = React.useState<
    "pending" | "submitting" | "successful"
  >("pending")
  const [selectedUsers, setSelectedUsers] = React.useState<String[]>(
    users.map(prop("id")),
  )
  const cache = useQueryCache()
  const totalPages = 3
  const isLastPage = currentPage === totalPages
  const isFirstPage = currentPage === 1

  const onSuccess = () => {
    cache.invalidateQueries("chores")
    setFormStatus("successful")
  }

  React.useEffect(() => {
    if (formStatus === "successful") {
      const timeout = setTimeout(onClose, 1500)
      return () => clearTimeout(timeout)
    }
  }, [formStatus])

  return (
    <Modal title="Add chore" onRequestClose={onClose}>
      <DynamicForm
        action="/api/objects/chores"
        editFormData={omit(["user"])}
        method="POST"
        onSuccess={onSuccess}
        className="p-4 sm:p-6"
        getFormErrors={(formData) => {
          if (currentPage === 1) {
            return {
              name:
                (formData.name?.length ?? 0) === 0
                  ? "Enter a chore name"
                  : chores.some((chore) => chore.chore_name === formData.name)
                  ? "A chore with this name already exists. Enter a unique name"
                  : null,
            }
          }

          if (currentPage === 2) {
            return {}
          }

          if (currentPage === 3) {
            return {}
          }

          return {}
        }}
      >
        {({ isValid }) => (
          <>
            <div className="mb-8">
              <div
                id="page-1"
                className={classNames(
                  currentPage === 1
                    ? "opacity-100 h-auto transition duration-200"
                    : "opacity-0 absolute pointer-events-none",
                )}
              >
                <InputField
                  className="w-full"
                  id="name"
                  name="name"
                  label="Chore name"
                  tabIndex={currentPage !== 1 ? -1 : 0}
                />
                <TextareaField
                  className="w-full"
                  id="description"
                  name="description"
                  label="Chore description (optional)"
                  rows={2}
                  tabIndex={currentPage !== 1 ? -1 : 0}
                />
              </div>

              <div
                id="page-2"
                className={classNames(
                  currentPage === 2
                    ? "opacity-100 h-auto transition duration-200"
                    : "opacity-0 absolute pointer-events-none",
                )}
              >
                <CheckboxesField
                  id="users"
                  title="Who's going to do this chore?"
                  checkboxes={users.map((user) => ({
                    checked: selectedUsers.includes(user.id),
                    label: user.display_name,
                    name: "user",
                    tabIndex: currentPage !== 2 ? -1 : undefined,
                    value: user.id,
                    onChange: (event) =>
                      setSelectedUsers(
                        (event.currentTarget.checked
                          ? uniq(selectedUsers.concat(user.id))
                          : selectedUsers.filter(
                              (selectedUser) => selectedUser !== user.id,
                            )
                        ).sort(),
                      ),
                  }))}
                />

                {selectedUsers.length === 0 ? (
                  <p>
                    When no users are assigned, <em>anyone</em> can do it
                  </p>
                ) : (
                  <RadiosField
                    id="assignment_type"
                    name="assignment_type"
                    title="In what order?"
                    radios={[
                      {
                        defaultChecked: true,
                        label: "Whoever has done it least",
                        tabIndex:
                          currentPage !== 2 || selectedUsers.length === 1
                            ? -1
                            : undefined,
                        value: "who-least-did-first",
                      },
                      {
                        label: "Alphabetic order",
                        tabIndex:
                          currentPage !== 2 || selectedUsers.length === 1
                            ? -1
                            : undefined,
                        value: "in-alphabetical-order",
                      },
                    ]}
                  />
                )}
              </div>

              <div
                id="page-3"
                className={classNames(
                  currentPage === 3
                    ? "opacity-100 h-auto transition duration-200"
                    : "opacity-0 absolute pointer-events-none",
                )}
              >
                <RadiosField
                  id="period_type"
                  name="period_type"
                  title="How often will this chore be done?"
                  radios={[
                    {
                      defaultChecked: true,
                      label: 'Once every "X" days',
                      tabIndex: currentPage !== 3 ? -1 : undefined,
                      value: "dynamic-regular",
                    },
                    {
                      label: "Certain days of the week",
                      tabIndex: currentPage !== 3 ? -1 : undefined,
                      value: "weekly",
                    },
                    {
                      label: "Certain days of the month",
                      tabIndex: currentPage !== 3 ? -1 : undefined,
                      value: "monthly",
                    },
                  ]}
                />
              </div>

              <input
                type="hidden"
                name="assignment_config"
                value={selectedUsers.join(",")}
              />

              <input
                type="hidden"
                name="consume_product_on_execution"
                value={"0"}
              />

              <input type="hidden" name="period_config" value={""} />
              <input type="hidden" name="period_days" value={"3"} />
              <input type="hidden" name="period_interval" value={"1"} />
              <input
                type="hidden"
                name="period_type"
                value={"dynamic-regular"}
              />
              <input type="hidden" name="product_id" value={""} />
              <input type="hidden" name="rollover" value={"1"} />
              <input type="hidden" name="track_date_only" value={"1"} />
            </div>

            <Button.Positive
              type="submit"
              onClick={(event) => {
                if (!isValid()) {
                  event.preventDefault()
                  return
                }

                if (!isLastPage) {
                  event.preventDefault()
                  setCurrentPage((page) => page + 1)
                }
              }}
              className="block w-full mb-4"
            >
              {isLastPage ? "Continue" : "Next"}
            </Button.Positive>
            <Button.Secondary
              className="block w-full"
              onClick={() => {
                if (isFirstPage) return onClose()
                setCurrentPage((page) => page - 1)
              }}
            >
              {isFirstPage ? "Cancel" : "Back"}
            </Button.Secondary>
          </>
        )}
      </DynamicForm>
    </Modal>
  )
}

export default AddChoreModal
