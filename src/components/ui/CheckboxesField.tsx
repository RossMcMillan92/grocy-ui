import Checkboxes, { Props as CheckboxesProps } from "./Checkboxes"
import FormFieldGroup, { Props as FormFieldGroupProps } from "./FormFieldGroup"
import React, { FC } from "react"

export type Props = Omit<FormFieldGroupProps, "renderInput"> & CheckboxesProps

const CheckboxesField: FC<Props> = (props) => (
  <FormFieldGroup
    {...props}
    renderInput={(props: Partial<CheckboxesProps>) => (
      <Checkboxes {...(props as CheckboxesProps)} />
    )}
  />
)

export default CheckboxesField
