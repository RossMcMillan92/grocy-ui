import { GROCY_API_KEY_LOUISE, GROCY_API_KEY_ROSS } from "enums/api"

export const getFetchOptions = ({
  userId = "2",
}: { userId?: string } = {}) => ({
  headers: {
    "GROCY-API-KEY": userId === "3" ? GROCY_API_KEY_LOUISE : GROCY_API_KEY_ROSS,
    accept: "application/json",
    "Content-Type": "application/json",
  },
})
