import classNames from "helpers/classNames"
import React, { FC } from "react"

export enum InputWidths {
  TWENTY = "TWENTY",
  TEN = "TEN",
  FIVE = "FIVE",
  FOUR = "FOUR",
  THREE = "THREE",
  TWO = "TWO",
}

export type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  hasError?: boolean
  prefix?: string
  suffix?: string
  width?: InputWidths
}

const Input: FC<Props> = ({
  className,
  hasError = false,
  prefix,
  suffix,
  width,
  ...additionalProps
}) => {
  const inputElement = (
    <input
      className={classNames(
        "py-1 px-2",
        "block xs:inline-block w-full",
        "text-gray-800 text-lg bg-gray-50 appearance-none",
        "border border-gray-300 rounded-lg border-b-2x",
        className,
        hasError && "",
        width === InputWidths.TWENTY && "--width-20",
        width === InputWidths.TEN && "--width-10",
        width === InputWidths.FIVE && "--width-5",
        width === InputWidths.FOUR && "--width-4",
        width === InputWidths.THREE && "--width-3",
        width === InputWidths.TWO && "--width-2",
      )}
      type="text"
      {...additionalProps}
    />
  )

  return prefix || suffix ? (
    <div className="__wrapper">
      {prefix ? (
        <div className="__prefix" aria-hidden="true">
          {prefix}
        </div>
      ) : null}
      {inputElement}
      {suffix ? (
        <div className="__suffix" aria-hidden="true">
          {suffix}
        </div>
      ) : null}
    </div>
  ) : (
    inputElement
  )
}

export default Input
