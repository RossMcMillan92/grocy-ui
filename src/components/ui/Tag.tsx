"use client"
import React, { FC } from "react"
import classNames from "helpers/classNames"

export enum TagColors {
  BLUE = "blue",
  RED = "red",
  YELLOW = "yellow",
}

export type Props = React.HTMLAttributes<HTMLSpanElement> & {
  color?: TagColors
  children: React.ReactNode
}

const colorMap: Record<TagColors, string> = {
  [TagColors.BLUE]: "bg-blue-200 text-blue-700",
  [TagColors.RED]: "bg-red-200 text-red-700",
  [TagColors.YELLOW]: "bg-yellow-200 text-yellow-700",
}

const Tag: FC<Props> = ({ children, className, color, ...additionalProps }) => (
  <span
    className={classNames(
      "text-xs py-1 px-2 rounded uppercase tracking-wide whitespace-nowrap",
      color ? colorMap[color] : "",
      className,
    )}
    {...additionalProps}
  >
    {children}
  </span>
)

export default Tag
