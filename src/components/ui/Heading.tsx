"use client"
import React, { FC } from "react"
import classNames from "helpers/classNames"

export enum HeadingSizes {
  XL = "xl",
  L = "l",
  M = "m",
  S = "s",
}

export enum HeadingTypes {
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  H4 = "h4",
  H5 = "h5",
  H6 = "h6",
}

const headingTypeClassNameMap = {
  [HeadingTypes.H1]: "text-3xl",
  [HeadingTypes.H2]: "text-2xl",
  [HeadingTypes.H3]: "text-xl",
  [HeadingTypes.H4]: "small",
  [HeadingTypes.H5]: "small",
  [HeadingTypes.H6]: "small",
}

export type Props = React.HTMLAttributes<HTMLHeadingElement> & {
  size?: HeadingSizes
  type?: HeadingTypes
  children: React.ReactNode
}

const Heading: FC<Props> = ({
  children,
  className,
  type = HeadingTypes.H1,
  ...additionalProps
}) => {
  const HeadingType = type
  const headingClassName = classNames(headingTypeClassNameMap[type], className)
  return (
    <HeadingType {...additionalProps} className={headingClassName}>
      {children}
    </HeadingType>
  )
}

export const H1 = (props: Props) => (
  <Heading {...props} type={HeadingTypes.H1} />
)
export const H2 = (props: Props) => (
  <Heading {...props} type={HeadingTypes.H2} />
)
export const H3 = (props: Props) => (
  <Heading {...props} type={HeadingTypes.H3} />
)
export const H4 = (props: Props) => (
  <Heading {...props} type={HeadingTypes.H4} />
)
export const H5 = (props: Props) => (
  <Heading {...props} type={HeadingTypes.H5} />
)
export const H6 = (props: Props) => (
  <Heading {...props} type={HeadingTypes.H6} />
)

export default Heading
