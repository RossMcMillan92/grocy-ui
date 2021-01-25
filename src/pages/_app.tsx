import "../styles/globals.css"
import "focus-visible"

import type { AppProps } from "next/app"
import Head from "next/head"
import Header from "components/ui/header"
import { QueryCache, ReactQueryCacheProvider, useQuery } from "react-query"
import { withErrorHandling } from "api/error-handling"
import { User } from "types/grocy"
import UsersContext from "contexts/users"

const queryCache = new QueryCache()

export const APP_CONTAINER_ID = "app-container"

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { data: users, isError } = useQuery("users", async () => {
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
        <main className="max-w-screen-lg mx-auto" id={APP_CONTAINER_ID}>
          <ReactQueryCacheProvider queryCache={queryCache}>
            <UsersContext.Provider value={users ?? []}>
              <Component {...pageProps} />
            </UsersContext.Provider>
          </ReactQueryCacheProvider>
        </main>
      </div>
    </>
  )
}

export default MyApp
