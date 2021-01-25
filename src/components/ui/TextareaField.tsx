import FormField, { Props as FormFieldProps } from "./FormField"
import React, { FC } from "react"
import Textarea, { Props as TextareaProps } from "./Textarea"

export type Props = Omit<FormFieldProps, "renderInput"> & TextareaProps

const TextareaField: FC<Props> = (props) => (
  <FormField
    {...props}
    renderInput={(inputProps: TextareaProps) => <Textarea {...inputProps} />}
  />
)

export default TextareaField
