import { HeadingSizes, HeadingTypes } from "./Heading"
import React, { FC } from "react"
import classNames from "helpers/classNames"

export type Props = React.HTMLAttributes<HTMLFieldSetElement> & {
  title?: string
  titleSize?: HeadingSizes
  titleType?: HeadingTypes
  children: React.ReactNode
}

const Fieldset: FC<Props> = ({
  children,
  className,
  title,
  titleSize = HeadingSizes.M,
  titleType: LegendTitleTag = HeadingTypes.H3,
  ...additionalProps
}) => (
  <fieldset className={classNames("", className)} {...additionalProps}>
    {!!title && (
      <legend className={classNames("mb-1")}>
        <LegendTitleTag className="">{title}</LegendTitleTag>
      </legend>
    )}
    {children}
  </fieldset>
)

export default Fieldset
