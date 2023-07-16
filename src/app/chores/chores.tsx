"use client"

import { CheckOutline, PencilAltOutline, PlusOutline } from "heroicons-react"
import { DetailedChore } from "types/grocy"
import {
  getHoursUntil,
  inShortTextualDateFormat,
  inTimeFormat,
  isDueWithin,
} from "helpers/date-utils"
import { sortBy } from "ramda"
import { useUsers } from "contexts/users"
import AddChoreModal from "components/AddChoreModal"
import Heading from "components/ui/Heading"
import MultiParagraphs from "components/ui/MultiParagraphs"
import React from "react"
import RemoveChoreModal from "components/RemoveChoreModal"
import SummaryList from "components/ui/SummaryList"
import Tag, { TagColors } from "components/ui/Tag"
import TrackChoreModal from "components/TrackChoreModal"
import classNames from "helpers/classNames"

type HomeProps = { chores?: DetailedChore[]; dueSoonDays: number }

const ChoresPage = ({ chores, dueSoonDays }: HomeProps) => {
  const users = useUsers()
  const [status, setStatus] = React.useState<"pending" | "adding-chore">(
    "pending",
  )

  const sortedChores = chores
    ? sortBy((chore) => chore.next_estimated_execution_time ?? "0", chores)
    : []

  const choresDoneToday = sortedChores.filter(
    (chore) =>
      new Date(chore.last_tracked).toDateString() === new Date().toDateString(),
  )
  return (
    <>
      <div className={classNames("flex items-center justify-between", "mb-8")}>
        <Heading.H1 className={classNames("")}>Chores</Heading.H1>
        <button
          className={classNames(
            "flex items-center justify-center",
            "bg-gray-100 text-gray-700 text-sm py-3 px-4 rounded uppercase tracking-wide",
          )}
          aria-label="Add chore"
          onClick={() => setStatus("adding-chore")}
        >
          Add{" "}
          <PlusOutline className={classNames("text-gray-600 h-5 w-5 ml-2")} />
        </button>
      </div>

      <div className="">
        <div
          className={classNames(
            choresDoneToday.length > 0
              ? "bg-lime-100 text-lime-800"
              : "bg-slate-100 text-slate-800",
            " font-medium",
            "rounded py-2 px-4 mb-8",
          )}
        >
          <div className="mb-2 text-2xl">
            {choresDoneToday.length} done today
            {choresDoneToday.length > 0 ? `! 🎉` : " 😔"}
          </div>
          <div className="opacity-90">
            {users.map((user) => {
              const amount = choresDoneToday.filter(
                (chore) => chore.last_done_by?.id === user.id,
              ).length
              return (
                <div key={user.id}>
                  {amount} by {user.display_name} {amount > 0 ? "😄" : "😔"}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <ul className={classNames("divide-y divide-gray-300")}>
        {sortedChores.map((chore) => (
          <li key={chore.chore.id}>
            <ChoreDetails
              chore={chore}
              chores={sortedChores}
              dueSoonDays={dueSoonDays}
            />
          </li>
        ))}
      </ul>
      {status === "adding-chore" ? (
        <AddChoreModal
          chores={sortedChores}
          onClose={() => setStatus("pending")}
        />
      ) : null}
    </>
  )
}

const ChoreDetails: React.FC<{
  chore: DetailedChore
  chores: DetailedChore[]
  dueSoonDays: number
}> = ({ chore, chores, dueSoonDays }) => {
  const [status, setStatus] = React.useState<
    "pending" | "editing-chore" | "removing-chore" | "tracking-chore"
  >("pending")
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const nextAssignedUser =
    chore?.next_execution_assigned_user?.display_name ?? "Anyone"
  const lastAssignedUser = chore?.last_done_by?.display_name ?? "Unknown"

  return (
    <div
      className={classNames(
        "transition-all duration-150",
        isOpen && "mb-8 mt-4",
      )}
    >
      <div
        className={classNames("flex items-center z-10 relative", "py-4 w-full")}
      >
        <button
          className={classNames(
            "flex items-center",
            "w-full",
            "overflow-hidden",
          )}
          onClick={() => setIsOpen((b) => !b)}
        >
          <div
            className={classNames(
              "w-full min-w-0 overflow-hidden relative text-left",
            )}
          >
            <div
              className={classNames(
                isOpen ? "opacity-100" : "opacity-0",
                "absolute fade-right-white inset-0 pointer-events-none z-10",
              )}
            ></div>
            <div
              className={classNames(
                isOpen && "transform-gpu scale-150 translate-y-3 delay-75",
                "origin-left transition-transform duration-200 ease-in-out",
                "font-medium",
                "flex items-center",
              )}
            >
              <div
                className={classNames(
                  "min-w-0 mr-2",
                  isOpen ? "pr-20" : "truncate",
                )}
              >
                {chore.chore.name}
              </div>

              <ChoreTag
                chore={chore}
                className={isOpen ? "opacity-0" : "opacity-100 delay-150"}
                dueSoonDays={dueSoonDays}
              />
            </div>
            <div
              className={classNames(
                isOpen
                  ? "opacity-0 ease-out translate-y-1"
                  : "opacity-100 ease-out delay-150",
                "transform transition-all duration-150",
              )}
            >
              <span>{nextAssignedUser}</span>{" "}
              {chore.next_estimated_execution_time ? (
                <span
                  className={classNames(
                    "text-gray-600 text-sm whitespace-nowrap",
                  )}
                >
                  ({getNextExecutionTime(chore)})
                </span>
              ) : null}
            </div>
          </div>
          <div className={classNames("flex-shrink-0")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="5"
              className={classNames(
                isOpen && "-rotate-180",
                "text-gray-500 ml-2",
                "transform transition-transform duration-150 ease-in-out",
              )}
            >
              <path
                d={"M0 0l5 5 5-5z"}
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </div>
        </button>
        <div className={classNames("flex-shrink-0 ml-4")}>
          <button
            className={classNames(
              "flex items-center justify-center",
              "h-12 w-12 bg-gray-100 text-gray-400 rounded-full",
            )}
            onClick={() => setStatus("tracking-chore")}
          >
            <CheckOutline className={classNames("h-7 w-7")} />
          </button>
        </div>
      </div>
      <div
        className={classNames(
          isOpen && "opacity-100 delay-150 ease-in",
          !isOpen && "opacity-0 h-0 ease-out -translate-y-3 z-0 relative",
          "transform transition-all duration-150",
        )}
      >
        {chore?.chore.description ? (
          <div
            className={classNames(
              "flex items-center justify-between",
              "text-sm p-2 mb-6",
              "bg-gray-50 rounded max-w-md",
            )}
          >
            <div className="flex-shrink-0">
              <PencilAltOutline
                className={classNames("text-gray-300", "h-6 w-6 mr-2")}
              />
            </div>
            <div className="w-full min-w-0 space-y-1">
              <MultiParagraphs className={classNames("text-gray-800 italic")}>
                {chore?.chore.description}
              </MultiParagraphs>
            </div>
          </div>
        ) : null}

        <SummaryList
          className="-ml-3"
          items={[
            {
              key: "Next up",
              value: (
                <>
                  <span className={classNames("mr-2")}>
                    {nextAssignedUser}
                    {chore.next_estimated_execution_time
                      ? `, ${getNextExecutionTime(chore)}`
                      : ""}
                  </span>{" "}
                  <ChoreTag chore={chore} dueSoonDays={dueSoonDays} />
                </>
              ),
              valueProps: { className: "text-lg" },
              wrapperProps: {
                className: "border-l-4 border-gray-300 pl-2 mb-4",
              },
            },
            {
              key: "Previously completed by",
              value: chore.last_tracked
                ? `${lastAssignedUser}, ${getLastExecutionTime(chore)}`
                : "Not tracked yet",
              wrapperProps: {
                className: "border-l-4 border-white pl-2",
              },
            },
          ]}
        />

        <div className={classNames("flex")}>
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
        </div>
      </div>

      {status === "tracking-chore" && chore ? (
        <TrackChoreModal onClose={() => setStatus("pending")} chore={chore} />
      ) : null}

      {status === "editing-chore" ? (
        <AddChoreModal
          chore={chore}
          chores={chores}
          onClose={() => setStatus("pending")}
        />
      ) : null}

      {status === "removing-chore" ? (
        <RemoveChoreModal chore={chore} onClose={() => setStatus("pending")} />
      ) : null}
    </div>
  )
}

export default ChoresPage

const ChoreTag: React.FC<{
  chore: DetailedChore
  className?: string
  dueSoonDays: number
}> = ({ chore, className, dueSoonDays }) => {
  const hoursUntilTomorrow = getHoursUntil(1)

  const isDueToday =
    chore.next_estimated_execution_time &&
    isDueWithin(hoursUntilTomorrow, chore.next_estimated_execution_time)
  const isDueSoon =
    !isDueToday &&
    chore.next_estimated_execution_time &&
    isDueWithin(
      hoursUntilTomorrow + 24 * dueSoonDays,
      chore.next_estimated_execution_time,
    )
  const isUntracked =
    !chore.last_tracked && !chore.next_estimated_execution_time

  if (!isUntracked && !isDueToday && !isDueSoon) return null
  const color = isDueToday
    ? TagColors.RED
    : isDueSoon
    ? TagColors.YELLOW
    : TagColors.BLUE
  return (
    <Tag
      className={classNames("transition duration-200 ease-in-out", className)}
      color={color}
    >
      {isDueToday ? "Due" : isDueSoon ? "Soon" : "Untracked"}
    </Tag>
  )
}

function getNextExecutionTime(chore: DetailedChore): React.ReactNode {
  return (
    inShortTextualDateFormat(chore.next_estimated_execution_time as string) +
    (chore.chore.track_date_only === "0"
      ? `, ${inTimeFormat(chore.next_estimated_execution_time as string)}`
      : "")
  )
}

function getLastExecutionTime(chore: DetailedChore): React.ReactNode {
  return (
    inShortTextualDateFormat(chore.last_tracked) +
    (chore.chore.track_date_only === "0"
      ? `, ${inTimeFormat(chore.last_tracked)}`
      : "")
  )
}
