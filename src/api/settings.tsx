import { GROCY_HOST } from "enums/api"
import { Settings } from "types/grocy"
import { fetchOptions } from "./utils"

export const getSettings = (): Promise<Settings> =>
  fetch(`http://${GROCY_HOST}/api/user/settings`, fetchOptions).then((d) =>
    d.json(),
  )
