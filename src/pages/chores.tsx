import PageTitle from "components/PageTitle/PageTitle"
import classNames from "helpers/classNames"
import { GetServerSideProps } from "next"
import { Chore, DetailedChore, Settings } from "types/grocy"
import { withErrorHandling } from "api/error-handling"
import { useQuery } from "react-query"
import { getChores } from "api/chores"
import { getSettings } from "api/settings"
import {
  getHoursUntil,
  inShortTextualDateFormat,
  inTimeFormat,
  isDueWithin,
} from "helpers/date-utils"
import Heading from "components/ui/Heading"
import React from "react"
import {
  CheckOutline,
  ChevronRight,
  Pencil,
  PencilAltOutline,
  PencilOutline,
  PlusOutline,
  QuestionMarkCircle,
} from "heroicons-react"
import MultiParagraphs from "components/ui/MultiParagraphs"
import SummaryList from "components/ui/SummaryList"
import Tag, { TagColors } from "components/ui/Tag"
import TrackChoreModal from "components/TrackChoreModal"
import AddChoreModal from "components/AddChoreModal"
import { sortBy } from "ramda"

type WithError<T> = T | (Partial<T> & { errorStatus: number })
type HomeProps = { chores?: Chore[]; dueSoonDays: number }

const ChoresRoute: React.FC<HomeProps> = ({
  chores: initialChores,
  dueSoonDays,
}) => {
  const [status, setStatus] = React.useState<"pending" | "adding-chore">(
    "pending",
  )
  const { data: chores } = useQuery(
    "chores",
    async () => {
      const { data } = await withErrorHandling<Chore[]>(
        fetch(`/api/chores`).then((d) => d.json()) as Promise<Chore[]>,
      )
      return data
    },
    { initialData: initialChores },
  )
  const sortedChores = chores
    ? sortBy((chore) => chore.next_estimated_execution_time ?? "0", chores)
    : []

  return (
    <>
      <PageTitle>Chores</PageTitle>
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

      <ul className={classNames("divide-y divide-gray-300")}>
        {sortedChores.map((chore) => (
          <li key={chore.chore_id}>
            <ChoreDetails chore={chore} dueSoonDays={dueSoonDays} />
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

export const getServerSideProps: GetServerSideProps<
  WithError<HomeProps>
> = async () => {
  const {
    data: settings,
    error: settingsError,
  } = await withErrorHandling<Settings>(getSettings())
  const { data: chores, error: choresError } = await withErrorHandling<Chore[]>(
    getChores(),
  )

  if (choresError || settingsError) return { props: { errorStatus: 500 } }
  return {
    props: { chores, dueSoonDays: Number(settings?.chores_due_soon_days ?? 5) },
  }
}

const ChoreDetails: React.FC<{ chore: Chore; dueSoonDays: number }> = ({
  chore,
  dueSoonDays,
}) => {
  const [status, setStatus] = React.useState<"pending" | "tracking-chore">(
    "pending",
  )
  const { data: fullChore, isLoading } = useChore(chore.chore_id)
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const nextAssignedUser = isLoading
    ? "Loading..."
    : fullChore?.next_execution_assigned_user?.display_name ?? "Anyone"
  const lastAssignedUser = isLoading
    ? "Loading..."
    : fullChore?.last_done_by?.display_name ?? "Unknown"

  return (
    <div
      className={classNames(
        "transition-all duration-150",
        isOpen && "mb-8 mt-4",
      )}
    >
      <div className={classNames("flex items-center", "py-4 w-full")}>
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
              <div className="min-w-0 truncate mr-2">{chore.chore_name}</div>

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
          !isOpen && "opacity-0 h-0 ease-out -translate-y-3",
          "overflow-hidden",
          "transform transition-all duration-150",
        )}
      >
        {fullChore?.chore.description ? (
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
                {fullChore?.chore.description}
              </MultiParagraphs>
            </div>
          </div>
        ) : null}

        <SummaryList
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
              value: chore.last_tracked_time
                ? `${lastAssignedUser}, ${getLastExecutionTime(chore)}`
                : "Not tracked yet",
              wrapperProps: {
                className: "border-l-4 border-white pl-2",
              },
            },
          ]}
        />
      </div>

      {status === "tracking-chore" && fullChore ? (
        <TrackChoreModal
          onClose={() => setStatus("pending")}
          chore={fullChore}
        />
      ) : null}
    </div>
  )
}

const useChore = (choreId: Chore["chore_id"]) =>
  useQuery(["chore", choreId], async () => {
    const { data } = await withErrorHandling<DetailedChore>(
      fetch(`/api/chores/${choreId}`).then((d) =>
        d.json(),
      ) as Promise<DetailedChore>,
    )
    return data
  })

export default ChoresRoute

const ChoreTag: React.FC<{
  chore: Chore
  className?: string
  dueSoonDays: number
}> = ({ chore, className, dueSoonDays }) => {
  const hoursUntilTomorrow = getHoursUntil(1)
  console.log(
    "🚀 ~ file: chores.tsx ~ line 310 ~ hoursUntilTomorrow",
    hoursUntilTomorrow,
  )
  const isDueToday =
    chore.next_estimated_execution_time &&
    isDueWithin(hoursUntilTomorrow, chore.next_estimated_execution_time)
  console.log("🚀 ~ file: chores.tsx ~ line 315 ~ isDueToday", isDueToday)
  const isDueSoon =
    !isDueToday &&
    chore.next_estimated_execution_time &&
    isDueWithin(
      hoursUntilTomorrow + 24 * dueSoonDays,
      chore.next_estimated_execution_time,
    )
  console.log("🚀 ~ file: chores.tsx ~ line 319 ~ isDueSoon", isDueSoon)
  const isUntracked =
    !chore.last_tracked_time && !chore.next_estimated_execution_time
  console.log("🚀 ~ file: chores.tsx ~ line 327 ~ isUntracked", isUntracked)

  if (!isUntracked && !isDueToday && !isDueSoon) return null
  const color = isDueToday
    ? TagColors.RED
    : isDueSoon
    ? TagColors.YELLOW
    : TagColors.BLUE
  console.log("🚀 ~ file: chores.tsx ~ line 325 ~ color", color)
  return (
    <Tag
      className={classNames("transition duration-200 ease-in-out", className)}
      color={color}
    >
      {isDueToday ? "Due" : isDueSoon ? "Soon" : "Untracked"}
    </Tag>
  )
}

function getNextExecutionTime(chore: Chore): React.ReactNode {
  return (
    inShortTextualDateFormat(chore.next_estimated_execution_time as string) +
    (chore.track_date_only === "0"
      ? `, ${inTimeFormat(chore.next_estimated_execution_time as string)}`
      : "")
  )
}

function getLastExecutionTime(chore: Chore): React.ReactNode {
  return (
    inShortTextualDateFormat(chore.last_tracked_time) +
    (chore.track_date_only === "0"
      ? `, ${inTimeFormat(chore.last_tracked_time)}`
      : "")
  )
}
