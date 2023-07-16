import "../styles/globals.css"
import "focus-visible"

import { User } from "types/grocy"
import { useQuery } from "react-query"
import { withErrorHandling } from "api/error-handling"
import Head from "next/head"
import Header from "components/ui/header"
import React from "react"
import UsersContext from "contexts/users"
import type { AppProps } from "next/app"

export const APP_CONTAINER_ID = "app-container"

const MyApp = ({ Component, pageProps }: AppProps): React.ReactElement => {
  const { data: users } = useQuery("users", async () => {
    const { data } = await withErrorHandling<User[]>(
      fetch(`/api/users`).then((d) => d.json()) as Promise<User[]>,
    )
    return data
  })

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="p-4">
        <main className="mx-auto max-w-screen-lg" id={APP_CONTAINER_ID}>
          <UsersContext.Provider value={users ?? []}>
            <Component {...pageProps} />
          </UsersContext.Provider>
        </main>
      </div>
    </>
  )
}

export default MyApp
