import { APP_CONTAINER_ID } from "components/ui/Modal"
import { NextResponse } from "next/server"
import { User } from "types/grocy"
import { UsersProvider } from "contexts/users"
import { getUsers } from "api/users"
import { withErrorHandling } from "api/error-handling"
import Header from "components/ui/header"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: users, error } = await withErrorHandling<User[]>(getUsers())

  if (error) return "Error getting users"
  return (
    <html>
      <body>
        <Header />
        <div className="p-4">
          <main className="mx-auto max-w-screen-lg" id={APP_CONTAINER_ID}>
            <UsersProvider users={users ?? []}>{children}</UsersProvider>
          </main>
        </div>
      </body>
    </html>
  )
}
