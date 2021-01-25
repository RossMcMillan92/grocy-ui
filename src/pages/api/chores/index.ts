import { getChores } from "api/chores"
import { NextApiHandler } from "next"

const handler: NextApiHandler = async (req, res) => {
  res.statusCode = 200
  res.json(await getChores())
}

export default handler
