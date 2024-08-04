import { AddChoreButton } from "./AddChoreButton"
import { BasicChoreDetails, ChoreDetails } from "./ChoreDetails"
import { Chore, Settings } from "types/grocy"
import { H1 } from "components/ui/Heading"
import { JSDOM } from "jsdom"
import { Suspense } from "react"
import { getChore, getChoreHistory, getChores } from "api/chores"
import { getSettings } from "api/settings"
import { getUsers } from "api/users"
import { sortBy } from "ramda"
import { withErrorHandling } from "api/error-handling"
import classNames from "helpers/classNames"

const ChoresRoute = async () => {
  const [{ data: settings, error: settingsError }, { data: users }, chores] =
    await Promise.all([
      withErrorHandling<Settings>(getSettings()),
      withErrorHandling(getUsers()),
      getChores(),
    ])
  if (settingsError) return "Error!"
  const dueSoonDays = Number(settings?.chores_due_soon_days ?? 5)
  if (!users) return "Error getting users"

  const sortedChores = chores
    ? sortBy((chore) => chore.next_estimated_execution_time ?? "0", chores)
    : []
  const choresDoneToday = sortedChores.filter(
    (chore) =>
      new Date(chore.last_tracked_time).toDateString() ===
      new Date().toDateString(),
  )

  return (
    <>
      <div className={classNames("flex items-center justify-between", "mb-8")}>
        <H1 className={classNames("")}>Chores</H1>
        <AddChoreButton sortedChores={sortedChores} />
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
          <div
            className={classNames(
              "text-2xl",
              choresDoneToday.length > 0 ? "mb-2" : "",
            )}
          >
            {choresDoneToday.length} done today
            {choresDoneToday.length > 0 ? `! 🎉` : " 😔"}
          </div>
          {choresDoneToday.length > 0 ? (
            <details className="text-lime-600">
              <summary>More info</summary>
              <ul>
                {choresDoneToday.map((chore) => (
                  <li key={chore.chore_id}>✅ {chore.chore_name}</li>
                ))}
              </ul>
            </details>
          ) : null}
        </div>
      </div>

      <ul className={classNames("")}>
        {sortedChores.map((chore) => (
          <li key={chore.chore_id}>
            <Suspense
              fallback={
                <BasicChoreDetails
                  chore={chore}
                  dueSoonDays={dueSoonDays}
                  users={users}
                />
              }
            >
              <DetailedChoreComponent
                choreId={chore.chore_id}
                chores={sortedChores}
                dueSoonDays={dueSoonDays}
              />
            </Suspense>
          </li>
        ))}
      </ul>
    </>
  )
}
const DetailedChoreComponent = async ({
  choreId,
  chores,
  dueSoonDays,
}: {
  choreId: Chore["chore_id"]
  chores: Chore[]
  dueSoonDays: number
}) => {
  const detailedChore = await getChore(choreId).then((data) => data)

  return (
    <ChoreDetails
      chore={chores.find((chore) => chore.chore_id === choreId) as Chore}
      detailedChore={detailedChore}
      chores={chores}
      dueSoonDays={dueSoonDays}
    >
      <Suspense
        fallback={
          <div
            className={`text-2xs py-0.5 flex items-center justify-center text-white bg-slate-400`}
          >
            Loading...
          </div>
        }
      >
        <ChoreHistory choreId={choreId} />
      </Suspense>
    </ChoreDetails>
  )
}

const ChoreHistory = async ({ choreId }: { choreId: Chore["chore_id"] }) => {
  const choreHistory = await getChoreHistory(choreId).then((data) => {
    const dom = new JSDOM(data)

    const choreHistory: { chore: string; time: string; doneBy: string }[] = []

    const rows = dom.window.document.querySelectorAll(
      "#chores-journal-table tbody tr",
    )

    rows.forEach((row) => {
      const chore =
        row
          .querySelector("td:nth-child(2) .name-anchor")
          ?.textContent?.trim() || ""
      const time =
        row.querySelector("td:nth-child(3) span")?.textContent?.trim() || ""
      const doneBy =
        row.querySelector("td:nth-child(4)")?.textContent?.trim() || ""

      choreHistory.push({ chore, time, doneBy })
    })

    return choreHistory
  })

  const userChoreCount = choreHistory.reduce(
    (acc, { doneBy }) => {
      acc[doneBy] = (acc[doneBy] || 0) + 1
      return acc
    },
    {} as { [user: string]: number },
  )

  const totalChores = choreHistory.length
  const userColors = {
    "Louise Kelly": { bg: "bg-sky-500", text: "text-sky-200" },
    "Ross McMillan": { bg: "bg-emerald-500", text: "text-emerald-200" },
  }

  return (
    <div className="relative">
      <div className="flex mb-4">
        {Object.entries(userChoreCount)
          .sort((a, b) => b[0].charCodeAt(0) - a[0].charCodeAt(0))
          .map(([user, count]) => {
            const percentage = (count / totalChores) * 100
            const userColor = userColors[user as keyof typeof userColors]

            return (
              <div
                key={user}
                className={`text-2xs py-0.5 flex items-center justify-center text-white ${userColor.bg}`}
                style={{ width: `${percentage}%` }}
              >
                {user.split(" ")[0]}: {count}{" "}
                <span className={classNames("ml-1 ", userColor.text)}>
                  ({percentage.toFixed(0)}%)
                </span>
              </div>
            )
          })}
      </div>
      <svg
        className="absolute top-[100%] left-[50%] transform -translate-x-1/2 scale-[0.1] origin-top"
        height="200"
        width="200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon points="100,10 150,100 50,100" style={{ fill: "#d2d2d2" }} />
      </svg>
    </div>
  )
}

export default ChoresRoute
