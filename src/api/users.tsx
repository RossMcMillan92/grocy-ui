import { GROCY_HOST } from "enums/api"
import { User } from "types/grocy"
import { getFetchOptions } from "./utils"

export const getUsers = (): Promise<User[]> =>
  fetch(`http://${GROCY_HOST}/api/users`, getFetchOptions()).then((d) =>
    d.json(),
  )
