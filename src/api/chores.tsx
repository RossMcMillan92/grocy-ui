import { GROCY_HOST } from "enums/api"
import { prop, sortBy } from "ramda"
import { Chore, DetailedChore } from "types/grocy"
import { fetchOptions } from "./utils"

export const createChore = (formData: string): Promise<DetailedChore> =>
  fetch(`http://${GROCY_HOST}/api/objects/chores`, {
    ...fetchOptions,
    method: "POST",
    body: formData,
  }).then(async (d) => {
    const data = await d.json()
    if (d.status < 200 || d.status >= 300)
      throw new Error(data.error_message ?? data.message)
    return data
  })

export const getChores = (): Promise<Chore[]> =>
  (fetch(`http://${GROCY_HOST}/api/chores`, fetchOptions).then((d) =>
    d.json(),
  ) as Promise<Chore[]>).then(sortBy(prop("next_estimated_execution_time")))

export const getChore = (choreId: Chore["chore_id"]): Promise<DetailedChore> =>
  fetch(`http://${GROCY_HOST}/api/chores/${choreId}`, fetchOptions).then((d) =>
    d.json(),
  )

export const executeChore = (
  choreId: Chore["chore_id"],
  formData: string,
): Promise<DetailedChore> =>
  fetch(`http://${GROCY_HOST}/api/chores/${choreId}/execute`, {
    ...fetchOptions,
    method: "POST",
    body: formData,
  }).then(async (d) => {
    if (d.status < 200 || d.status >= 300)
      throw new Error((await d.json()).error_message)
    return d.json()
  })