import classNames from "helpers/classNames"
import React, { FC } from "react"

export type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  hasError?: boolean
}

const Textarea: FC<Props> = ({
  className,
  hasError = false,
  ...additionalProps
}) => (
  <textarea
    className={classNames(
      "py-1 px-2",
      "block xs:inline-block w-full",
      "text-gray-800 text-lg bg-gray-100 rounded appearance-none",
      hasError && "",
      className,
    )}
    {...additionalProps}
  />
)

export default Textarea
