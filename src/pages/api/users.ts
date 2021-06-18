import { NextApiHandler } from "next"
import { getUsers } from "api/users"

const handler: NextApiHandler = async (req, res) => {
  res.statusCode = 200
  res.json(await getUsers())
}

export default handler
