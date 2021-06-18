import React, { FC } from "react"
import classNames from "helpers/classNames"

export type Props = React.HTMLAttributes<HTMLParagraphElement>

const Paragraph: FC<Props> = ({ className, ...additionalProps }) => (
  <p className={classNames("", className)} {...additionalProps} />
)

export default Paragraph
