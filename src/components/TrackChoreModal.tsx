import { CheckCircleOutline } from "heroicons-react"
import { DetailedChore } from "types/grocy"
import { inDateFormat, inTimeFormat } from "helpers/date-utils"
import { useQueryCache } from "react-query"
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
  chore: DetailedChore
  onClose: () => void
}> = ({ chore, onClose }) => {
  const [formStatus, setFormStatus] = React.useState<
    "pending" | "submitting" | "successful"
  >("pending")
  const users = useUsers()
  const cache = useQueryCache()
  const [selectedTime, setSelectedTime] = React.useState<"now" | "specific">(
    "now",
  )
  const [dateInput, setDateInput] = React.useState<string>(inDateFormat())
  const [timeInput, setTimeInput] = React.useState<string>(inTimeFormat())
  const dateTracked = dayjs(
    selectedTime === "now" ? undefined : `${dateInput  }T${  timeInput}`,
  ).format("YYYY-MM-DD HH:mm:ss")

  const onSuccess = () => {
    cache.invalidateQueries("chores")
    cache.invalidateQueries(["chore", chore.chore.id])
    setFormStatus("successful")
  }

  React.useEffect(() => {
    if (formStatus === "successful") {
      const timeout = setTimeout(onClose, 1500)
      return () => clearTimeout(timeout)
    }
  }, [formStatus])

  return (
    <Modal title="Track chore" onRequestClose={onClose}>
      <DynamicForm
        action={`/api/chores/${chore.chore.id}/execute`}
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
                  {chore.chore.name}
                </Paragraph>
              </div>

              <SelectField
                label="Completed by"
                id="user"
                name="done_by"
                defaultValue={chore.next_execution_assigned_user?.id ?? "0"}
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

              <input type="hidden" name="tracked_time" value={dateTracked} />

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
                {chore.chore.track_date_only === "1" ? null : (
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
            <Button.Secondary className="block w-full" onClick={onClose}>
              Cancel
            </Button.Secondary>
          </>
        )}
      </DynamicForm>
    </Modal>
  )
}

export default TrackChoreModal
