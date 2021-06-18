import { inTimeFormat } from "helpers/date-utils"
import { omit } from "ramda"
import FormField, { Props as FormFieldProps } from "./FormField"
import React, { FC } from "react"
import classNames from "helpers/classNames"

export type Props = Omit<FormFieldProps, "renderInput"> &
  React.InputHTMLAttributes<HTMLInputElement>

const TimeField: FC<Props> = (props) => (
  <>
    <FormField
      {...props}
      renderInput={({ ...props }: React.InputHTMLAttributes<HTMLElement>) => (
        <input
          {...omit(["hasError"], props)}
          type="time"
          className={classNames(
            "py-1 px-2",
            "block xs:inline-block w-full xs:w-auto",
            "text-gray-800 text-lg bg-gray-50 appearance-none",
            "border border-gray-300 rounded-lg border-b-2x",
            props.className,
          )}
        />
      )}
    />
  </>
)

export default TimeField
