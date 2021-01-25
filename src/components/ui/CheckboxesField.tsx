import FormFieldGroup, { Props as FormFieldGroupProps } from "./FormFieldGroup"
import Checkboxes, { Props as RadioProps } from "./Checkboxes"
import React, { FC } from "react"

export type Props = Omit<FormFieldGroupProps, "renderInput"> & RadioProps

const CheckboxesField: FC<Props> = (props) => (
  <FormFieldGroup
    {...props}
    renderInput={(props: RadioProps) => <Checkboxes {...props} />}
  />
)

export default CheckboxesField
