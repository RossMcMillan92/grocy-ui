import { User } from "types/grocy"
import React from "react"

const UsersContext = React.createContext<User[]>([])

export const useUsers = () => React.useContext<User[]>(UsersContext)

export default UsersContext
