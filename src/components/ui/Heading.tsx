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

export interface IHeadingComposition {
  H1: FC<Props>
  H2: FC<Props>
  H3: FC<Props>
  H4: FC<Props>
  H5: FC<Props>
  H6: FC<Props>
}

export type Props = React.HTMLAttributes<HTMLHeadingElement> & {
  size?: HeadingSizes
  type?: HeadingTypes
  children: React.ReactNode
}

const Heading: FC<Props> & IHeadingComposition = ({
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

Heading.H1 = (props) => <Heading {...props} type={HeadingTypes.H1} />
Heading.H2 = (props) => <Heading {...props} type={HeadingTypes.H2} />
Heading.H3 = (props) => <Heading {...props} type={HeadingTypes.H3} />
Heading.H4 = (props) => <Heading {...props} type={HeadingTypes.H4} />
Heading.H5 = (props) => <Heading {...props} type={HeadingTypes.H5} />
Heading.H6 = (props) => <Heading {...props} type={HeadingTypes.H6} />
Heading.H1.displayName = "Heading.H1"
Heading.H2.displayName = "Heading.H2"
Heading.H3.displayName = "Heading.H3"
Heading.H4.displayName = "Heading.H4"
Heading.H5.displayName = "Heading.H5"
Heading.H6.displayName = "Heading.H6"

export default Heading
