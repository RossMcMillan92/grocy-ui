"use client"

import { User } from "types/grocy"
import React from "react"

const UsersContext = React.createContext<User[]>([])

export const useUsers = () => React.useContext<User[]>(UsersContext)

export const UsersProvider = ({
  children,
  users,
}: {
  children: React.ReactNode
  users: User[]
}) => {
  return <UsersContext.Provider value={users}>{children}</UsersContext.Provider>
}

export default UsersContext
