"use client"
import { Chore, DetailedChore } from "types/grocy"
import { omit, prop, uniq } from "ramda"
import { useRouter } from "next/navigation"
import { useUsers } from "contexts/users"
import Button from "components/ui/Button"
import CheckboxesField from "./ui/CheckboxesField"
import DynamicForm from "components/ui/DynamicForm"
import InputField from "./ui/InputField"
import Modal from "components/ui/Modal"
import RadiosField from "./ui/RadiosField"
import React from "react"
import TextareaField from "./ui/TextareaField"
import classNames from "helpers/classNames"

const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]
const AddChoreModal: React.FC<{
  chore?: DetailedChore
  chores: Chore[]
}> = ({ chore, chores }) => {
  const [status, setStatus] = React.useState<
    "pending" | "editing-chore" | "removing-chore" | "tracking-chore"
  >("pending")
  const users = useUsers()
  const [currentPage, setCurrentPage] = React.useState(1)
  const [formStatus, setFormStatus] = React.useState<
    "pending" | "submitting" | "successful"
  >("pending")
  const [selectedDays, setSelectedDays] = React.useState<string[]>(
    chore?.chore.period_config.split(",") ?? [],
  )
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>(
    chore
      ? `${chore.chore.assignment_config}`.split(",")
      : users.map(prop("id")).map((x) => `${x}`),
  )
  const [periodType, setPeriodType] = React.useState<
    "daily" | "weekly" | "monthly"
  >(chore?.chore?.period_type ?? "daily")
  const totalPages = 3
  const isLastPage = currentPage === totalPages
  const isFirstPage = currentPage === 1
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
          "mr-2",
        )}
        onClick={() => setStatus("editing-chore")}
      >
        Edit
      </button>
      {status === "editing-chore" ? (
        <Modal
          title={chore ? "Edit chore" : "Add chore"}
          onRequestClose={() => setStatus("pending")}
        >
          <DynamicForm
            action={`/api/objects/chores${chore ? `/${chore.chore.id}` : ""}`}
            editFormData={omit(["day", "user"])}
            method={chore ? "PUT" : "POST"}
            onSuccess={onSuccess}
            className="p-4 sm:p-6"
            getFormErrors={(formData) => {
              if (currentPage === 1) {
                return {
                  name:
                    (formData.name?.length ?? 0) === 0
                      ? "Enter a chore name"
                      : !chore &&
                        chores.some(
                          (chore) => chore.chore_name === formData.name,
                        )
                      ? "A chore with this name already exists. Enter a unique name"
                      : null,
                }
              }

              if (currentPage === 2) {
                return {}
              }

              if (currentPage === 3) {
                return {
                  period_interval:
                    periodType === "daily" &&
                    (Number.isNaN(Number(formData.period_interval)) ||
                      Number(formData.period_interval) < 1)
                      ? "Enter a number above 0"
                      : periodType === "monthly" &&
                        (Number.isNaN(Number(formData.period_interval)) ||
                          Number(formData.period_interval) < 1 ||
                          Number(formData.period_interval) > 31)
                      ? "Enter a number between 1 and 31"
                      : null,
                  day:
                    periodType === "weekly" && selectedDays.length === 0
                      ? "Select at least one day"
                      : null,
                }
              }

              return {}
            }}
          >
            {({ formErrors, isValid }) => (
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
                      errorMessage={formErrors.name ?? ""}
                      id="name"
                      name="name"
                      label="Chore name"
                      defaultValue={chore?.chore.name}
                      tabIndex={currentPage !== 1 ? -1 : 0}
                    />
                    <TextareaField
                      className="w-full"
                      id="description"
                      name="description"
                      label="Chore description (optional)"
                      rows={2}
                      defaultValue={chore?.chore.description}
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
                      checkboxes={users.map((user) => {
                        const userId = `${user.id}`
                        return {
                          checked: selectedUsers.includes(userId),
                          label: user.display_name,
                          name: "user",
                          tabIndex: currentPage !== 2 ? -1 : undefined,
                          value: userId,
                          onChange: (event) =>
                            setSelectedUsers(
                              (event.currentTarget.checked
                                ? uniq(selectedUsers.concat(userId))
                                : selectedUsers.filter(
                                    (selectedUser) => selectedUser !== userId,
                                  )
                              ).sort(),
                            ),
                        }
                      })}
                    />

                    {selectedUsers.length === 0 ? (
                      <p className="px-4 italic text-center text-gray-600">
                        When no users are assigned, anyone can complete the
                        chore
                      </p>
                    ) : (
                      <RadiosField
                        id="assignment_type"
                        name="assignment_type"
                        title="In which order?"
                        radios={[
                          {
                            defaultChecked:
                              (chore?.chore.assignment_type ??
                                "who-least-did-first") ===
                              "who-least-did-first",
                            label: "Whoever has done it least",
                            tabIndex:
                              currentPage !== 2 || selectedUsers.length === 1
                                ? -1
                                : undefined,
                            value: "who-least-did-first",
                          },
                          {
                            defaultChecked:
                              chore?.chore.assignment_type ===
                                "in-alphabetical-order" ?? false,
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
                      title="When will this chore be done?"
                      radios={[
                        {
                          checked: periodType === "daily",
                          label: 'Once every "X" days',
                          tabIndex: currentPage !== 3 ? -1 : undefined,
                          onChange: () => setPeriodType("daily"),
                          value: "daily",
                        },
                        {
                          checked: periodType === "weekly",
                          label: "Certain days of the week",
                          tabIndex: currentPage !== 3 ? -1 : undefined,
                          onChange: () => setPeriodType("weekly"),
                          value: "weekly",
                        },
                        {
                          checked: periodType === "monthly",
                          label: "A certain day of the month",
                          tabIndex: currentPage !== 3 ? -1 : undefined,
                          onChange: () => setPeriodType("monthly"),
                          value: "monthly",
                        },
                      ]}
                    />

                    {periodType === "daily" ? (
                      <InputField
                        className="w-full"
                        errorMessage={formErrors["period_interval"] ?? ""}
                        id="period_interval"
                        name="period_interval"
                        label={"How many days?"}
                        defaultValue={chore?.chore.period_interval ?? "7"}
                        tabIndex={currentPage !== 3 ? -1 : 0}
                      />
                    ) : null}

                    {periodType === "monthly" ? (
                      <>
                        <InputField
                          className="w-full"
                          errorMessage={formErrors["period_days"] ?? ""}
                          id="period_days"
                          name="period_days"
                          label={"Which day of the month?"}
                          defaultValue={chore?.chore.period_days ?? "7"}
                          tabIndex={currentPage !== 3 ? -1 : 0}
                        />
                        <input type="hidden" name="period_interval" value="1" />
                      </>
                    ) : null}

                    {periodType === "weekly" ? (
                      <CheckboxesField
                        id="selectedDays"
                        title="Who's going to do this chore?"
                        errorMessage={formErrors.day || ""}
                        checkboxes={DAYS_OF_WEEK.map((day) => ({
                          checked: selectedDays.includes(day),
                          label: day[0].toUpperCase() + day.slice(1),
                          name: "day",
                          tabIndex: currentPage !== 3 ? -1 : undefined,
                          value: day,
                          onChange: (event) =>
                            setSelectedDays(
                              event.currentTarget.checked
                                ? uniq(selectedDays.concat(day))
                                : selectedDays.filter(
                                    (selectedDay) => selectedDay !== day,
                                  ),
                            ),
                        }))}
                      />
                    ) : null}
                  </div>

                  <input
                    type="hidden"
                    name="assignment_config"
                    value={selectedUsers.join(",")}
                  />

                  <input
                    type="hidden"
                    name="period_config"
                    value={DAYS_OF_WEEK.filter((day) =>
                      selectedDays.includes(day),
                    ).join(",")}
                  />

                  <input
                    type="hidden"
                    name="consume_product_on_execution"
                    value={"0"}
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
                  {isLastPage ? "Save" : "Next"}
                </Button.Positive>
                <Button.Secondary
                  className="block w-full"
                  onClick={() => {
                    if (isFirstPage) return setStatus("pending")
                    setCurrentPage((page) => page - 1)
                  }}
                >
                  {isFirstPage ? "Cancel" : "Back"}
                </Button.Secondary>
              </>
            )}
          </DynamicForm>
        </Modal>
      ) : null}
    </>
  )
}

export default AddChoreModal
