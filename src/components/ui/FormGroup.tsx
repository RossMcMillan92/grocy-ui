import classNames from "helpers/classNames"
import PropTypes from "prop-types"
import React, { FC } from "react"

export type Props = React.HTMLAttributes<HTMLDivElement> & {
  hasError?: boolean
  children: React.ReactNode
}

const FormGroup: FC<Props> = ({
  className,
  children,
  hasError = false,
  ...additionalProps
}) => (
  <div
    className={classNames(
      "mb-4 transition-all duration-75",
      hasError && "border-l-2 border-red-500 pl-2",
      className,
    )}
    {...additionalProps}
  >
    {children}
  </div>
)

FormGroup.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  hasError: PropTypes.bool,
}

FormGroup.defaultProps = {
  hasError: false,
}

export default FormGroup
