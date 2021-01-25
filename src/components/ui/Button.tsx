import classNames from "helpers/classNames"
import React from "react"
import Spinner from "./Spinner"

export enum ButtonVariants {
  DEFAULT = "default",
  SECONDARY = "secondary",
  POSITIVE = "positive",
  WARNING = "warning",
}

export type Props = React.HtmlHTMLAttributes<HTMLButtonElement> & {
  disabled?: boolean
  isLoading?: boolean
  type?: "button" | "submit" | "reset"
  variant?: ButtonVariants
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

type ButtonComponentType = React.ForwardRefExoticComponent<
  Props & React.RefAttributes<HTMLButtonElement>
>

export interface IButtonComposition extends ButtonComponentType {
  Secondary: ButtonComponentType
  Default: ButtonComponentType
  Positive: ButtonComponentType
  Warning: ButtonComponentType
}

const Button = React.forwardRef<HTMLButtonElement, Props>(
  (
    {
      children,
      className,
      disabled = false,
      isLoading,
      type = "button",
      variant,
      ...additionalProps
    },
    ref,
  ) => (
    <button
      type={type}
      disabled={disabled}
      aria-disabled={disabled}
      className={classNames(
        "text-lg py-2 select-none font-semibold rounded",
        variant === ButtonVariants.DEFAULT &&
          "bg-gray-300 text-gray-900 border-2 border-gray-300",
        variant === ButtonVariants.SECONDARY &&
          "bg-white text-gray-600 border-2 border-gray-200",
        variant === ButtonVariants.POSITIVE &&
          "bg-green-100 text-green-700 border-2 border-green-100",
        variant === ButtonVariants.WARNING && "bg-red-300 text-red-900",
        className,
      )}
      ref={ref}
      {...additionalProps}
    >
      <span
        className={classNames(
          "flex items-center justify-center transition-transform duration-300",
          isLoading && "transform -translate-x-4 ease-out",
          !isLoading && "ease-in-out",
        )}
      >
        <span className="relative">
          {children}
          <span
            className={classNames(
              "button__icon ml-4 absolute -right-6 transition duration-300 ease-out",
              !isLoading && "opacity-0 transform -translate-x-8 ease-in-out",
            )}
            data-testid="button-loading-spinner"
          >
            <Spinner className="w-5 h-5 button__icon-image" title="" />
          </span>
        </span>
      </span>
    </button>
  ),
) as IButtonComposition
Button.displayName = "Button"

Button.Secondary = React.forwardRef((props, ref) => (
  <Button {...props} ref={ref} variant={ButtonVariants.SECONDARY} />
))
Button.Positive = React.forwardRef((props, ref) => (
  <Button {...props} ref={ref} variant={ButtonVariants.POSITIVE} />
))
Button.Warning = React.forwardRef((props, ref) => (
  <Button {...props} ref={ref} variant={ButtonVariants.WARNING} />
))

Button.Secondary.displayName = "Button.Secondary"
Button.Warning.displayName = "Button.Warning"

export default Button
