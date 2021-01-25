import classNames from "helpers/classNames"
import React, { FC } from "react"

export type Props = React.HTMLAttributes<HTMLParagraphElement>

const Paragraph: FC<Props> = ({ className, ...additionalProps }) => (
  <p className={classNames("", className)} {...additionalProps} />
)

export default Paragraph
