import { AddChoreButton } from "./AddChoreButton"
import { Chore, DetailedChore, Settings } from "types/grocy"
import { ChoreDetails } from "./ChoreDetails"
import { H1 } from "components/ui/Heading"
import { getChore, getChores } from "api/chores"
import { getSettings } from "api/settings"
import { getUsers } from "api/users"
import { sortBy } from "ramda"
import { withErrorHandling } from "api/error-handling"
import React, { Suspense } from "react"
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
          <div className="text-2xl mb-x">
            {choresDoneToday.length} done today
            {choresDoneToday.length > 0 ? `! 🎉` : " 😔"}
          </div>
          {/* <div className="opacity-90">
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
          </div> */}
        </div>
      </div>

      <ul className={classNames("divide-y divide-gray-300")}>
        {sortedChores.map((chore) => (
          <li key={chore.chore_id}>
            <Suspense fallback={<p className="py-4">Loading chore...</p>}>
              <Thing
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

const Thing = async ({
  choreId,
  chores,
  dueSoonDays,
}: {
  choreId: Chore["chore_id"]
  chores: Chore[]
  dueSoonDays: number
}) => {
  const detailedChore = await getChore(choreId).then(
    (data) => data as DetailedChore,
  )
  return (
    <ChoreDetails
      chore={detailedChore}
      chores={chores}
      dueSoonDays={dueSoonDays}
    ></ChoreDetails>
  )
}

export default ChoresRoute
