import { withErrorHandling } from "api/error-handling"
import { getFetchOptions } from "api/utils"
import classNames from "helpers/classNames"
import { CheckCircleOutline } from "heroicons-react"
import { identity } from "ramda"
import React from "react"
import ErrorSummary from "./ErrorSummary"
import Spinner from "./Spinner"

type FormDataObject = Record<string, string>
type FormErrorsObject = Record<string, string | null | undefined>

type DynamicFormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  children: ({
    formErrors,
    isValid,
  }: {
    formErrors: FormErrorsObject
    isValid: () => boolean
  }) => React.ReactNode
  editFormData?: (formData: FormDataObject) => FormDataObject
  getFormErrors?: (formData: Record<string, string>) => FormErrorsObject
  onSuccess: () => void
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  editFormData = identity,
  getFormErrors,
  onSuccess,
  ...props
}) => {
  const [formStatus, setFormStatus] = React.useState<
    "pending" | "submitting" | "successful"
  >("pending")
  const [formErrors, setFormErrors] = React.useState<FormErrorsObject>({})
  const [genericErrors, setGenericErrors] = React.useState<string[]>([])
  const formRef = React.useRef<HTMLFormElement>(null)
  const getFormData = () =>
    formRef.current
      ? editFormData(
          Array.from(new FormData(formRef.current).entries()).reduce(
            (result, [key, value]) => ({ ...result, [key]: value }),
            {},
          ),
        )
      : {}

  const isValid = () => {
    const newFormErrors = getFormErrors?.(getFormData()) ?? {}
    setFormErrors(newFormErrors)
    return Object.values(newFormErrors).filter(Boolean).length === 0
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!props.action || formStatus === "submitting") return
    setFormStatus("submitting")
    setGenericErrors([])

    isValid()
    const { data, error } = await withErrorHandling(
      fetch(props.action, {
        ...getFetchOptions(),
        body: JSON.stringify(getFormData()),
        method: props.method,
      }).then(async (d) => {
        if (d.status < 200 || d.status >= 300) throw new Error(await d.text())
        return d.json()
      }),
    )

    if (error) {
      setGenericErrors([error.message])
      setFormStatus("pending")
    }

    if (data) {
      setFormStatus("successful")
      onSuccess()
      return
    }
  }

  return (
    <form
      {...props}
      className={classNames("relative overflow-hidden", props.className)}
      onSubmit={onSubmit}
      ref={formRef}
    >
      {Object.values(formErrors).filter(Boolean).length ||
      genericErrors.length ? (
        <ErrorSummary formErrors={formErrors} genericErrors={genericErrors} />
      ) : null}

      <div
        className={classNames(
          formStatus === "submitting"
            ? "opacity-0 scale-95"
            : "opacity-100 scale-100",
          "transform transition duration-150",
        )}
      >
        {props.children({ formErrors, isValid })}
      </div>

      <div
        className={classNames(
          formStatus !== "pending"
            ? "opacity-100 scale-100 delay-150"
            : "opacity-0 scale-150 pointer-events-none",
          "transform transition duration-150",
          "absolute inset-0 bg-white z-10 flex items-center justify-center",
        )}
      >
        <Spinner
          className={classNames(
            formStatus === "submitting"
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95",
            "transform transition duration-150",
            "absolute text-gray-500 h-16 w-16",
          )}
        />
        <CheckCircleOutline
          className={classNames(
            formStatus === "successful"
              ? "opacity-100 scale-100 delay-150"
              : "opacity-0 scale-150 pointer-events-none",
            "transform transition duration-150",
            "absolute text-green-500 h-16 w-16",
          )}
        />
      </div>
    </form>
  )
}

export default DynamicForm
