import ErrorSummaryListItem from "./ErrorSummaryListItem"
import Heading from "./Heading"
import Paragraph from "./Paragraph"
import React from "react"
import classNames from "helpers/classNames"

type FormErrors = Record<string, string | null>
type ExtendedFormError = Record<string, unknown> & {
  field: string
  message: string | null
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
  title = "There is a problem",
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
      className={classNames("mb-4 border-l-4 border-red-500 pl-2", className)}
      aria-labelledby="error-summary-title"
      role="alert"
      tabIndex={-1}
      {...additionalProps}
    >
      <Heading.H2 className="x__title" id="error-summary-title">
        {title}
      </Heading.H2>
      {renderGenericErrors(genericErrors)}

      {(!!children || !!extendedFormErrors.length) && (
        <div className="x__body">
          <ul className=" x__list">
            {extendedFormErrors.map(
              ({ field, message, ...additionalProps }) => (
                <ErrorSummaryListItem
                  key={field}
                  targetName={field}
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
