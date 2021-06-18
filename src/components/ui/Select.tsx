import React, { FC } from "react"
import classNames from "helpers/classNames"

export type Props = React.InputHTMLAttributes<HTMLSelectElement> & {
  hasError?: boolean
}

const Select: FC<Props> = ({
  children,
  className,
  hasError = false,
  ...additionalProps
}) => (
  <div className="relative block w-full xs:inline-block xs:w-auto">
    <select
      className={classNames(
        "py-1 pl-2 pr-8",
        "block xs:inline-block w-full xs:w-auto",
        "text-gray-800 text-lg bg-gray-50 appearance-none",
        "border border-gray-300 rounded-lg border-b-2x",
        hasError && "",
        className,
      )}
      {...additionalProps}
    >
      {children}
    </select>

    <div className="absolute top-0 bottom-0 flex items-center justify-center w-6 pointer-events-none right-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="5"
        className={classNames("text-gray-500 ml-2")}
      >
        <path d={"M0 0l5 5 5-5z"} fill="currentColor" fillRule="evenodd" />
      </svg>
    </div>
  </div>
)

export default Select
