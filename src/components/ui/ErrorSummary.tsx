import { H3 } from "./Heading"
import ErrorSummaryListItem from "./ErrorSummaryListItem"
import Paragraph from "./Paragraph"
import React from "react"
import classNames from "helpers/classNames"

type FormErrors = Record<string, string | null | undefined>
type ExtendedFormError = Record<string, unknown> & {
  field: string
  message: string | null | undefined
}
type GenericError = React.ReactNode

const hasFormErrors = (formErrors: FormErrors) =>
  !!Object.values(formErrors).filter(Boolean).length

const useAutoFocusOnErrorUpdate = (
  extendedFormErrors: Record<string, unknown>[],
  genericErrors: GenericError[],
  ref?: React.RefObject<HTMLDivElement>,
) => {
  React.useEffect(() => {
    const hasErrors = extendedFormErrors.length || !!genericErrors.length
    if (hasErrors && ref && ref.current) ref.current.focus()
  }, [extendedFormErrors, genericErrors, ref])
}

const renderGenericErrors = (genericErrors: GenericError[]) =>
  genericErrors
    .filter(Boolean)
    .map((errorMessage, index) => (
      <Paragraph key={index}>{errorMessage}</Paragraph>
    ))

export type Props = React.HTMLAttributes<HTMLDivElement> & {
  formErrors?: FormErrors
  extendedFormErrors?: ExtendedFormError[]
  genericErrors?: GenericError[]
  title?: string
  children?: React.ReactNode
}

const ErrorSummary: React.FC<Props> = ({
  children,
  className,
  formErrors = {},
  extendedFormErrors = [],
  genericErrors = [],
  title = "Not so fast...",
  ...additionalProps
}) => {
  const ref = React.useRef<HTMLDivElement>(null)
  if (extendedFormErrors.length === 0 && hasFormErrors(formErrors)) {
    extendedFormErrors = Object.entries(formErrors)
      .filter(([, errorMessage]) => !!errorMessage)
      .map(([fieldName, errorMessage]) => ({
        field: fieldName,
        message: errorMessage,
      }))
  }

  useAutoFocusOnErrorUpdate(extendedFormErrors, genericErrors, ref)

  return (
    <div
      id="error-summary"
      ref={ref}
      className={classNames("mb-6 p-4 bg-red-100 rounded-md", className)}
      aria-labelledby="error-summary-title"
      role="alert"
      tabIndex={-1}
      {...additionalProps}
    >
      <H3 className="text-red-800" id="error-summary-title">
        {title}
      </H3>
      {renderGenericErrors(genericErrors)}

      {(!!children || !!extendedFormErrors.length) && (
        <div className="x__body">
          <ul className=" x__list">
            {extendedFormErrors.map(
              ({ field, message, ...additionalProps }) => (
                <ErrorSummaryListItem
                  key={field}
                  targetName={field}
                  className="text-red-700"
                  {...additionalProps}
                >
                  {message}
                </ErrorSummaryListItem>
              ),
            )}
            {children}
          </ul>
        </div>
      )}
    </div>
  )
}

export default ErrorSummary
