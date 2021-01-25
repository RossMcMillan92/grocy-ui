import { getUsers } from "api/users"
import { NextApiHandler } from "next"

const handler: NextApiHandler = async (req, res) => {
  res.statusCode = 200
  res.json(await getUsers())
}

export default handler
