import { createChore } from "api/chores"
import { withErrorHandling } from "api/error-handling"
import { NextApiHandler } from "next"

const handler: NextApiHandler = async (req, res) => {
  console.log(
    "🚀 ~ file: index.ts ~ line 10 ~ consthandler:NextApiHandler= ~ JSON.stringify(req.body)",
    JSON.stringify(req.body),
  )
  const { data, error } = await withErrorHandling(
    createChore(JSON.stringify(req.body)),
  )
  if (error) {
    res.status(500).send(error.message)
    return
  }
  res.statusCode = 200
  res.json(data)
}

export default handler
