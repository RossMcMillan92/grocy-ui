import { isEmpty } from "ramda"
import { Props as SelectProps } from "./Select"
import ErrorMessage, { Props as ErrorMessageProps } from "./ErrorMessage"
import FormGroup, { Props as FormGroupProps } from "./FormGroup"
import Hint, { Props as HintProps } from "./Hint"
import { Props as InputProps } from "./Input"
import Label, { Props as LabelProps } from "./Label"
import { Props as TextareaProps } from "./Textarea"
import PropTypes from "prop-types"
import React, { FC } from "react"

export type Props = {
  errorMessage?: string
  errorMessageProps?: Partial<ErrorMessageProps>
  formGroupProps?: Partial<FormGroupProps>
  hint?: React.ReactNode
  hintProps?: Partial<HintProps>
  id: string
  isLoading?: boolean
  label: string
  labelProps?: Partial<LabelProps>
  name?: string
  renderInput?:
    | ((props: InputProps) => React.ReactNode)
    | ((props: SelectProps) => React.ReactNode)
    | ((props: TextareaProps) => React.ReactNode)
  className?: string
  hasError?: boolean
  type?: string
  pattern?: string
}

const FormField: FC<Props> = ({
  errorMessage,
  errorMessageProps,
  formGroupProps,
  hint,
  hintProps,
  id,
  label,
  labelProps,
  name,
  renderInput,
  ...additionalProps
}) => (
  <FormGroup {...formGroupProps} hasError={!!errorMessage}>
    <Label htmlFor={id} {...labelProps}>
      {label}
    </Label>
    {hint ? (
      <Hint id={`${id}-hint`} {...hintProps}>
        {hint}
      </Hint>
    ) : null}

    {errorMessage ? (
      <ErrorMessage id={`${id}-error`} {...errorMessageProps}>
        {errorMessage}
      </ErrorMessage>
    ) : null}
    {renderInput &&
      renderInput({
        hasError: !!errorMessage,
        id,
        name,
        ...additionalProps,
      })}
  </FormGroup>
)

FormField.propTypes = {
  errorMessage: PropTypes.string,
  hint: PropTypes.node,
  id: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  renderInput: PropTypes.func.isRequired,
}

export default FormField
