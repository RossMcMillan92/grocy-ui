import { NextApiHandler } from "next"
import { getChore } from "api/chores"

const handler: NextApiHandler = async ({ query: { choreId } }, res) => {
  res.statusCode = 200
  res.json(await getChore(choreId as string))
}

export default handler
