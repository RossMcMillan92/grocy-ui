import { GROCY_HOST } from "enums/api"
import { User } from "types/grocy"
import { fetchOptions } from "./utils"

export const getUsers = (): Promise<User[]> =>
  fetch(`http://${GROCY_HOST}/api/users`, fetchOptions).then((d) => d.json())
