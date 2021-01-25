import FormFieldGroup, { Props as FormFieldGroupProps } from "./FormFieldGroup"
import Radios, { Props as RadioProps, RadiosSizes, RadiosTypes } from "./Radios"
import React, { FC } from "react"

export type Props = Omit<FormFieldGroupProps, "renderInput"> & RadioProps

const RadiosField: FC<Props> = (props) => (
  <FormFieldGroup
    {...props}
    renderInput={(props: RadioProps) => <Radios {...props} />}
  />
)

export { RadiosSizes, RadiosTypes }
export default RadiosField
