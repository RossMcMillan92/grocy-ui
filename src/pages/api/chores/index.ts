import { getChores } from "api/chores"
import { NextApiHandler } from "next"

const handler: NextApiHandler = async (req, res) => {
  res.statusCode = 200
  let chores = await getChores()

  const filterUntil = req.query.until
  console.log(
    "🚀 ~ file: index.ts ~ line 9 ~ consthandler:NextApiHandler= ~ filterUntil",
    filterUntil,
  )
  if (filterUntil) {
    chores = chores.filter(
      (chore) =>
        chore.next_estimated_execution_time.split(" ")[0] <= filterUntil,
    )
  }

  res.json(chores)
}

export default handler
