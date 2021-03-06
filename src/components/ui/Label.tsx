import React, { FC } from "react"
import classNames from "helpers/classNames"

export enum LabelSizes {
  XL = "xl",
  L = "l",
  M = "m",
  S = "s",
}

export type Props = React.HTMLAttributes<HTMLLabelElement> & {
  htmlFor: string
  size?: LabelSizes
}

const Label: FC<Props> = ({
  children,
  className = "",
  htmlFor,
  size,
  ...additionalProps
}) => (
  <label
    className={classNames(
      "block mb-1 text-gray-600",
      size === LabelSizes.XL && "text-xl",
      size === LabelSizes.L && "text-l",
      size === LabelSizes.M && "text-m",
      size === LabelSizes.S && "text-s",
      className,
    )}
    htmlFor={htmlFor}
    {...additionalProps}
  >
    {children}
  </label>
)

export default Label
