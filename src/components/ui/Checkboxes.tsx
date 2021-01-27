import Hint from "./Hint"
import Label from "./Label"
import React, { FC } from "react"
import classNames from "helpers/classNames"

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  checked?: boolean
  conditionalRender?: () => React.ReactNode
  defaultChecked?: boolean
  hint?: React.ReactNode
  id?: string
  label: string
  name: string
  value: string
}

export type Props = React.HTMLAttributes<HTMLDivElement> & {
  checkboxes: CheckboxProps[]
  id: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Checkboxes: FC<Props> = ({
  checkboxes,
  className,
  id,
  onChange: onChangeProp,
  ...additionalProps
}) => (
  <div className={classNames(className)} id={id} {...additionalProps}>
    {checkboxes.map(
      (
        {
          conditionalRender,
          id: individualId,
          hint,
          label,
          name,
          onChange: individualOnChange,
          value,
          ...additionalCheckboxProps
        },
        index,
      ) => (
        <CheckboxItem
          {...additionalCheckboxProps}
          conditionalRender={conditionalRender}
          key={individualId ?? `${id}-${index + 1}`}
          id={individualId ?? `${id}-${index + 1}`}
          hint={hint}
          label={label}
          name={name}
          value={value}
          onChange={individualOnChange ?? onChangeProp}
        />
      ),
    )}
  </div>
)

const CheckboxItem: FC<CheckboxProps & { id: string }> = ({
  checked,
  defaultChecked,
  id,
  conditionalRender,
  hint,
  label,
  onChange: onChangeProp,
  name,
  value,
  ...additionalProps
}) => {
  const [toggleCount, setToggleCount] = React.useState(-1)
  const inputRef = React.useRef() as React.MutableRefObject<HTMLInputElement>
  const isChecked = inputRef.current?.checked

  React.useEffect(() => {
    setToggleCount(0)
  }, [])

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToggleCount(toggleCount + 1)
    onChangeProp?.(event)
  }

  return (
    <>
      <div
        className={classNames(
          "inline-flex items-center relative mr-4",
          "focus-within:ring-2 ring-blue-200",
        )}
      >
        <input
          checked={checked}
          className="absolute opacity-0"
          defaultChecked={defaultChecked}
          id={id}
          name={name}
          ref={inputRef}
          type="checkbox"
          onChange={onChange}
          value={value}
          {...additionalProps}
        />
        <Label
          className={classNames(
            "flex-shrink-0 flex items-center",
            "py-1 px-3 rounded-lg border-2 font-medium",
            !isChecked && "border-gray-200 text-gray-600",
            isChecked && "border-gray-200 bg-gray-200 text-gray-700",
          )}
          htmlFor={id}
        >
          <div
            className={classNames(
              "flex items-center justify-center",
              "h-4 w-4 border-2 mr-2 rounded-sm",
              isChecked ? "border-gray-500 bg-gray-200" : "border-gray-300",
            )}
          >
            <div
              className={classNames(
                "h-2 w-2 rounded-sm",
                "border-gray-500 bg-gray-500 transform",
                "transition-transform duration-200 ease-in delay-75",
                isChecked ? "scale-100" : "scale-0",
              )}
            />
          </div>
          {label}
        </Label>
      </div>
    </>
  )
}

export default Checkboxes
