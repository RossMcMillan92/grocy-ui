import React, { FC } from "react"
import classNames from "helpers/classNames"

export type Props = React.HTMLAttributes<HTMLSpanElement>

const ErrorMessage: FC<Props> = ({
  children,
  className,
  ...additionalProps
}) => (
  <span
    className={classNames("block text-red-500 mb-2 font-medium", className)}
    {...additionalProps}
  >
    <span className={"sr-only"}>Error: </span>
    {children}
  </span>
)

export default ErrorMessage
