import React, { FC } from "react"
import classNames from "helpers/classNames"

export type Props = React.HTMLAttributes<HTMLSpanElement> & {
  children: React.ReactNode
}

const Hint: FC<Props> = ({ className, children, ...additionalProps }) => (
  <span className={classNames("text-gray-700", className)} {...additionalProps}>
    {children}
  </span>
)

export default Hint
