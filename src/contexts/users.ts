import React from "react"
import { User } from "types/grocy"

const UsersContext = React.createContext<User[]>([])

export const useUsers = () => React.useContext<User[]>(UsersContext)

export default UsersContext
