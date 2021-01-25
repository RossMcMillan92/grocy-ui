import FormField, { Props as FormFieldProps } from "./FormField"
import React, { FC } from "react"
import Select, { Props as SelectProps } from "./Select"

export type Props = Omit<FormFieldProps, "renderInput"> & SelectProps

const SelectField: FC<Props> = (props) => (
  <FormField
    {...props}
    renderInput={(inputProps: SelectProps) => <Select {...inputProps} />}
  />
)

export default SelectField
