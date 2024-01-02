"use client"
import { CheckCircleOutline, CheckOutline } from "heroicons-react"
import { Chore } from "types/grocy"
import { inDateFormat, inTimeFormat } from "helpers/date-utils"
import { useRouter } from "next/navigation"
import { useUsers } from "contexts/users"
import Button from "components/ui/Button"
import DateField from "components/ui/DateField"
import DynamicForm from "components/ui/DynamicForm"
import Modal from "components/ui/Modal"
import Paragraph from "components/ui/Paragraph"
import RadiosField from "./ui/RadiosField"
import React from "react"
import SelectField from "components/ui/SelectField"
import TimeField from "components/ui/TimeField"
import classNames from "helpers/classNames"
import dayjs from "dayjs"

const TrackChoreModal: React.FC<{
  chore: Chore
}> = ({ chore }) => {
  const [status, setStatus] = React.useState<
    "pending" | "editing-chore" | "removing-chore" | "tracking-chore"
  >("pending")
  const [formStatus, setFormStatus] = React.useState<
    "pending" | "submitting" | "successful"
  >("pending")
  const users = useUsers()
  const [selectedTime, setSelectedTime] = React.useState<"now" | "specific">(
    "now",
  )
  const [dateInput, setDateInput] = React.useState<string>(inDateFormat())
  const [timeInput, setTimeInput] = React.useState<string>(inTimeFormat())
  const dateTracked = dayjs(
    selectedTime === "now" ? undefined : `${dateInput}T${timeInput}`,
  ).format("YYYY-MM-DD HH:mm:ss")
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

  const [defaultUser, setDefaultUser] = useLocalStorage(
    "defaultUser",
    chore.next_execution_assigned_to_user_id ?? "0",
  )

  return (
    <>
      <button
        className={classNames(
          "flex items-center justify-center",
          "h-12 w-12 bg-gray-100 text-gray-400 rounded-full",
        )}
        onClick={() => setStatus("tracking-chore")}
      >
        <CheckOutline className={classNames("h-7 w-7")} />
      </button>

      {status === "tracking-chore" && chore ? (
        <Modal title="Track chore" onRequestClose={() => setStatus("pending")}>
          <DynamicForm
            action={`/api/chores/${chore.chore_id}/execute`}
            method="POST"
            onSuccess={onSuccess}
            className="p-4 sm:p-6"
          >
            {() => (
              <>
                <div className="mb-8">
                  <div className="flex items-center mb-6">
                    <CheckCircleOutline className="w-8 h-8 mr-2 text-green-500" />
                    <Paragraph className={classNames("text-xl font-medium")}>
                      {chore.chore_name}
                    </Paragraph>
                  </div>

                  <SelectField
                    label="Completed by"
                    id="user"
                    name="done_by"
                    defaultValue={defaultUser}
                    onChange={(event) => setDefaultUser(event.target.value)}
                  >
                    <option value="0">Not assigned</option>

                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.display_name}
                      </option>
                    ))}
                  </SelectField>

                  <RadiosField
                    id="time"
                    name="time"
                    title="When?"
                    radios={[
                      {
                        label: "Now",
                        value: "now",
                        checked: selectedTime === "now",
                        onChange: () => setSelectedTime("now"),
                      },
                      {
                        label: "Enter manually...",
                        value: "specific",
                        checked: selectedTime === "specific",
                        onChange: () => setSelectedTime("specific"),
                      },
                    ]}
                  />

                  <input
                    type="hidden"
                    name="tracked_time"
                    value={dateTracked}
                  />

                  <div
                    className={classNames(
                      "xs:flex items-center",
                      "transform ease-out",
                      selectedTime === "specific"
                        ? "opacity-100 transition duration-200 delay-75"
                        : "absolute opacity-0 pointer-events-none -translate-y-3",
                    )}
                  >
                    <DateField
                      label="Date"
                      name="date"
                      id="date"
                      className={classNames("mr-4")}
                      value={dateInput}
                      onChange={(event) => setDateInput(event.target.value)}
                    />
                    {chore.track_date_only === "1" ? null : (
                      <TimeField
                        label="Time"
                        name="time"
                        id="time"
                        value={timeInput}
                        onChange={(event) => setTimeInput(event.target.value)}
                      />
                    )}
                  </div>
                </div>

                <Button.Positive type="submit" className="block w-full mb-4">
                  Continue
                </Button.Positive>
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

export default TrackChoreModal

const useLocalStorage = <T extends string | number | boolean>(
  key: string,
  defaultValue: T,
) => {
  const [value, setValue] = React.useState<T>(() => {
    const storedValue =
      typeof window !== "undefined" ? window.localStorage.getItem(key) : ""
    return storedValue ? (storedValue as T) : defaultValue
  })

  React.useEffect(() => {
    localStorage.setItem(key, value.toString())
  }, [key, value])

  return [value, setValue] as const
}
