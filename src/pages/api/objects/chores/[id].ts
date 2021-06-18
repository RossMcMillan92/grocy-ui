import { NextApiHandler } from "next"
import { deleteChore, editChore } from "api/chores"
import { withErrorHandling } from "api/error-handling"

const handler: NextApiHandler = async (req, res) => {
  if (!req.query.id || Array.isArray(req.query.id)) {
    res.status(400)
    return
  }
  const { error } = await withErrorHandling(
    (req.method === "PUT" ? editChore : deleteChore)(
      req.query.id,
      JSON.stringify(req.body),
    ),
  )
  if (error) {
    res.status(500).send(error.message)
    return
  }
  res.statusCode = 200
  res.json({})
}

export default handler
