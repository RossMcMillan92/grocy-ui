import { NextApiHandler } from "next"
import { executeChore } from "api/chores"
import { withErrorHandling } from "api/error-handling"

const handler: NextApiHandler = async ({ query: { choreId }, ...req }, res) => {
  res.statusCode = 200
  const { data, error } = await withErrorHandling(
    executeChore(choreId as string, JSON.stringify(req.body)),
  )
  if (error) {
    res.status(500).send(error.message)
    return
  }
  res.json(data)
}

export default handler
