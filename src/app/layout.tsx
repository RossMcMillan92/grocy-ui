import "../styles/globals.css"
import "focus-visible"

import { APP_CONTAINER_ID } from "components/ui/Modal"
import { UsersProvider } from "contexts/users"
import { getUsers } from "api/users"
import { withErrorHandling } from "api/error-handling"
import Header from "components/ui/header"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: users } = await withErrorHandling(getUsers())
  if (!users) return "Error getting users"
  return (
    <html>
      <body>
        <Header />
        <div className="p-4">
          <main className="mx-auto max-w-screen-lg" id={APP_CONTAINER_ID}>
            <UsersProvider users={users}>{children}</UsersProvider>
          </main>
        </div>
      </body>
    </html>
  )
}
