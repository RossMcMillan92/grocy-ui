import { GROCY_HOST } from "enums/api"
import { Settings } from "types/grocy"
import { getFetchOptions } from "./utils"

export const getSettings = (): Promise<Settings> =>
  fetch(`http://${GROCY_HOST}/api/user/settings`, getFetchOptions()).then((d) =>
    d.json(),
  )
