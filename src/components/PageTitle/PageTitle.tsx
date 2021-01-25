import Head from "next/head"
import React from "react"

type PageTitleProps = {
  children: React.ReactNode
}

const PageTitle: React.FC<PageTitleProps> = ({ children }) => (
  <Head>
    <title>{children}</title>
  </Head>
)

export default PageTitle
