import { DetailedChore, Settings } from "types/grocy"
import { getChore, getChores } from "api/chores"
import { getSettings } from "api/settings"
import { withErrorHandling } from "api/error-handling"
import ChoresPage from "./chores"

const ChoresRoute = async () => {
  const { data: settings, error: settingsError } =
    await withErrorHandling<Settings>(getSettings())
  const chores = await Promise.all(
    (await getChores()).map((chore) =>
      getChore(chore.chore_id).then((data) => data as DetailedChore),
    ),
  )
  if (settingsError) return "Error!"
  const dueSoonDays = Number(settings?.chores_due_soon_days ?? 5)

  return <ChoresPage chores={chores} dueSoonDays={dueSoonDays} />
}

export default ChoresRoute
