import { Chore, DetailedChore } from "types/grocy"
import { GROCY_HOST } from "enums/api"
import { getFetchOptions } from "./utils"
import { prop, sortBy } from "ramda"

export const createChore = (formData: string): Promise<DetailedChore> =>
  fetch(`http://${GROCY_HOST}/api/objects/chores`, {
    ...getFetchOptions(),
    method: "POST",
    body: formData,
  }).then(async (d) => {
    const data = await d.json()
    if (d.status < 200 || d.status >= 300)
      throw new Error(data.error_message ?? data.message)
    return data
  })

export const editChore = (
  choreId: Chore["chore_id"],
  formData: string,
): Promise<void> =>
  fetch(`http://${GROCY_HOST}/api/objects/chores/${choreId}`, {
    ...getFetchOptions(),
    method: "PUT",
    body: formData,
  }).then(async (d) => {
    if (d.status < 200 || d.status >= 300) {
      const data = await d.json()
      throw new Error(data.error_message ?? data.message)
    }
  })

export const deleteChore = (
  choreId: Chore["chore_id"],
  formData: string,
): Promise<void> =>
  fetch(`http://${GROCY_HOST}/api/objects/chores/${choreId}`, {
    ...getFetchOptions(),
    method: "DELETE",
    body: formData,
  }).then(async (d) => {
    if (d.status < 200 || d.status >= 300) {
      const data = await d.json()
      throw new Error(data.error_message ?? data.message)
    }
  })

export const getChores = (): Promise<Chore[]> =>
  (
    fetch(`http://${GROCY_HOST}/api/chores`, {
      ...getFetchOptions(),
      next: { revalidate: 0 },
    }).then((d) => d.json()) as Promise<Chore[]>
  ).then(sortBy(prop("next_estimated_execution_time")))

export const getChore = (choreId: Chore["chore_id"]): Promise<DetailedChore> =>
  fetch(`http://${GROCY_HOST}/api/chores/${choreId}`, getFetchOptions()).then(
    (d) => d.json(),
  )

export const getChoreHistory = (choreId: Chore["chore_id"]) =>
  fetch(
    `http://${GROCY_HOST}/choresjournal?embedded&chore=${choreId}&months=9999`,
    {
      ...getFetchOptions(),
    },
  ).then((d) => d.text())

export const executeChore = (
  choreId: Chore["chore_id"],
  formData: string,
): Promise<DetailedChore> =>
  fetch(`http://${GROCY_HOST}/api/chores/${choreId}/execute`, {
    ...getFetchOptions({ userId: JSON.parse(formData).done_by }),
    method: "POST",
    body: formData,
  }).then(async (d) => {
    if (d.status < 200 || d.status >= 300)
      throw new Error((await d.json()).error_message)
    return d.json()
  })
