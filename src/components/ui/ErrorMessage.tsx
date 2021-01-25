import PropTypes from "prop-types"
import React, { FC } from "react"
import classNames from "helpers/classNames"

export type Props = React.HTMLAttributes<HTMLSpanElement>

const ErrorMessage: FC<Props> = ({
  children,
  className,
  ...additionalProps
}) => (
  <span
    className={classNames("block text-red-500", className)}
    {...additionalProps}
  >
    <span className={"sr-only"}>Error: </span>
    {children}
  </span>
)

ErrorMessage.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}

export default ErrorMessage
