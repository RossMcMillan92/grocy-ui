import React, { FC, forwardRef } from "react"
import classNames from "helpers/classNames"

export type Props = {
  className?: string
  ref?: React.Ref<HTMLHeadingElement>
}

const Header: FC<Props> = forwardRef(
  ({ className, ...additionalProps }, ref) => (
    <header
      className={classNames("p-4", className)}
      ref={ref}
      {...additionalProps}
    >
      <div className={classNames("max-w-screen-lg mx-auto")}>
        <span className={classNames("text-green-600 font-bold text-2xl")}>
          Grocy
        </span>
        <span className={classNames("text-green-500 font-extrabold text-2xl")}>
          UI
        </span>
      </div>
    </header>
  ),
)

export default Header
