import { GROCY_API_KEY } from "enums/api"

export const fetchOptions = {
  headers: {
    "GROCY-API-KEY": GROCY_API_KEY,
    accept: "application/json",
    "Content-Type": "application/json",
  },
}
