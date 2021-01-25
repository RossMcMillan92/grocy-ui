import Hint from "./Hint"
import Label from "./Label"
import React, { FC } from "react"
import classNames from "helpers/classNames"

export enum RadiosTypes {
  INLINE = "inline",
}
export enum RadiosSizes {
  S = "s",
}

export type RadioProps = React.InputHTMLAttributes<HTMLInputElement> & {
  checked?: boolean
  defaultChecked?: boolean
  conditionalRender?: () => React.ReactNode
  hint?: string
  id?: string
  label: string
  value: string
}

export type Props = React.HTMLAttributes<HTMLDivElement> &
  React.HTMLAttributes<HTMLInputElement> & {
    id: string
    name: string
    onChange?: (event: React.FormEvent<HTMLInputElement>) => void
    radios: RadioProps[]
    size?: RadiosSizes
    type?: RadiosTypes
  }

const Radios: FC<Props> = ({
  className,
  id,
  name,
  onChange: onChangeProp,
  radios,
  size,
  type,
  ...additionalProps
}) => {
  const [toggleCount, setToggleCount] = React.useState(-1)

  React.useEffect(() => {
    setToggleCount(0)
  }, [])

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    setToggleCount(toggleCount + 1)
    onChangeProp?.(event)
  }

  return (
    <div
      className={classNames(
        "flex flex-wrap",
        type === RadiosTypes.INLINE && "",
        size === RadiosSizes.S && "",
        className,
      )}
      id={id}
      {...additionalProps}
    >
      {radios.map(({ id: individualId, ...props }, index) => (
        <RadioItem
          onChange={onChange}
          {...props}
          key={individualId ?? `${id}-${index + 1}`}
          id={individualId ?? `${id}-${index + 1}`}
          name={name}
        />
      ))}
    </div>
  )
}

const RadioItem: FC<RadioProps & { id: string }> = ({
  checked,
  defaultChecked,
  id,
  conditionalRender,
  hint,
  label,
  name,
  ...additionalProps
}) => {
  const inputRef = React.useRef() as React.MutableRefObject<HTMLInputElement>
  const isChecked = inputRef.current?.checked

  return (
    <>
      <div className="flex items-center relative mr-4">
        <input
          checked={checked}
          className="absolute opacity-0"
          defaultChecked={defaultChecked}
          id={id}
          name={name}
          ref={inputRef}
          type="radio"
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
              "h-4 w-4 border-2 mr-2 rounded-full",
              isChecked ? "border-gray-500 bg-gray-200" : "border-gray-300",
            )}
          >
            <div
              className={classNames(
                "h-2 w-2 rounded-full",
                "border-gray-500 bg-gray-500 transform",
                "transition-transform duration-200 ease-in delay-75",
                isChecked ? "scale-100" : "scale-0",
              )}
            />
          </div>
          {label}
        </Label>
      </div>

      {conditionalRender && (
        <div className={classNames("", !inputRef.current?.checked && "hidden")}>
          {conditionalRender()}
        </div>
      )}
    </>
  )
}

export default Radios
