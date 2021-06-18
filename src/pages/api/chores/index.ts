import { NextApiHandler } from "next"
import { getChores } from "api/chores"

const handler: NextApiHandler = async (req, res) => {
  res.statusCode = 200
  let chores = await getChores()

  const filterUntil = req.query.until as string | null

  if (filterUntil) {
    chores = chores.filter(
      (chore) =>
        (chore.next_estimated_execution_time?.split(" ")[0] ?? "0") <=
        filterUntil,
    )
  }

  res.json(chores)
}

export default handler
