import { AddChoreButton } from "./AddChoreButton"
import { Chore, DetailedChore, Settings } from "types/grocy"
import { ChoreDetails } from "./ChoreDetails"
import { H1 } from "components/ui/Heading"
import { Suspense } from "react"
import { getChore, getChores } from "api/chores"
import { getSettings } from "api/settings"
import { getUsers } from "api/users"
import { headers } from "next/headers"
import { sortBy } from "ramda"
import { withErrorHandling } from "api/error-handling"
import classNames from "helpers/classNames"

const ChoresRoute = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  console.log(
    "😅😅😅 ~ X-Forwarded-For:",
    JSON.stringify(headers().get("X-Forwarded-For"), null, 2),
  )
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

      <ul className={classNames("divide-y divide-slate-300")}>
        {sortedChores.map((chore) => (
          <li key={chore.chore_id}>
            <Suspense fallback={<p className="py-4">Loading chore...</p>}>
              <Thing
                choreId={chore.chore_id}
                chores={sortedChores}
                dueSoonDays={dueSoonDays}
                openString={(searchParams.open as string) ?? "[]"}
              />
            </Suspense>
          </li>
        ))}
      </ul>
    </>
  )
}

const Thing = async ({
  choreId,
  chores,
  dueSoonDays,
  openString,
}: {
  choreId: Chore["chore_id"]
  chores: Chore[]
  dueSoonDays: number
  openString: string
}) => {
  const detailedChore = await getChore(choreId).then(
    (data) => data as DetailedChore,
  )
  return (
    <ChoreDetails
      chore={detailedChore}
      chores={chores}
      dueSoonDays={dueSoonDays}
      open={JSON.parse(openString)}
    ></ChoreDetails>
  )
}

export default ChoresRoute
