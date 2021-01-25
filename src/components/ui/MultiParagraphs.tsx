import React, { FC } from "react"
import Paragraph from "./Paragraph"

const NEW_LINE_REGEX = /\r?\n/

export type Props = React.HTMLAttributes<HTMLParagraphElement> & {
  children: string
}

const MultiParagraphs: FC<Props> = ({ children, ...additionalProps }) => (
  <>
    {children
      .split(NEW_LINE_REGEX)
      .filter((text: string) => text !== "")
      .map((paragraph: string, index: number) => (
        <Paragraph key={index} {...additionalProps}>
          {paragraph}
        </Paragraph>
      )) ?? null}
  </>
)

export default MultiParagraphs
