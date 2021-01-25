import FormField, { Props as FormFieldProps } from "./FormField"
import Input, { Props as InputProps } from "./Input"
import React, { FC } from "react"

export type Props = Omit<FormFieldProps, "renderInput"> & InputProps

const InputField: FC<Props> = ({ ...props }) => (
  <FormField
    {...props}
    renderInput={(inputProps: InputProps) => <Input {...inputProps} />}
  />
)

export default InputField
