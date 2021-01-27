import { HeadingSizes, HeadingTypes } from "./Heading"
import { Props as CheckboxesProps } from "./Checkboxes"
import { Props as RadioProps } from "./Radios"
import ErrorMessage, { Props as ErrorMessageProps } from "./ErrorMessage"
import Fieldset, { Props as FieldsetProps } from "./Fieldset"
import FormGroup, { Props as FormGroupProps } from "./FormGroup"
import Hint, { Props as HintProps } from "./Hint"
import React, { FC } from "react"

export type Props = {
  errorMessage?: string
  errorMessageProps?: Partial<ErrorMessageProps>
  formGroupProps?: Partial<FormGroupProps>
  hintProps?: Partial<HintProps>
  fieldsetProps?: Partial<FieldsetProps>
  hint?: React.ReactNode
  id: string
  name?: string
  renderInput?:
    | ((props: Partial<RadioProps>) => React.ReactNode)
    | ((props: Partial<CheckboxesProps>) => React.ReactNode)
  title: string
}

const FormFieldGroup: FC<Props> = ({
  errorMessage,
  errorMessageProps,
  fieldsetProps,
  formGroupProps,
  hint,
  hintProps,
  id,
  name,
  renderInput,
  title,
  ...additionalProps
}) => (
  <FormGroup {...formGroupProps} hasError={!!errorMessage}>
    <Fieldset
      aria-describedby={hint ? `${id}-hint` : undefined}
      titleSize={HeadingSizes.S}
      titleType={HeadingTypes.H3}
      title={title}
      {...fieldsetProps}
    >
      {!!hint && (
        <Hint id={`${id}-hint`} {...hintProps}>
          {hint}
        </Hint>
      )}

      {errorMessage ? (
        <ErrorMessage id={`${id}-error`} {...errorMessageProps}>
          {errorMessage}
        </ErrorMessage>
      ) : null}

      {renderInput?.({
        id,
        name,
        ...additionalProps,
      })}
    </Fieldset>
  </FormGroup>
)

export default FormFieldGroup
