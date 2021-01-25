import React, { FC } from "react"

export type Props = React.HTMLAttributes<HTMLLIElement> & {
  targetName?: string
  target?: HTMLInputElement | { focus: () => void }
}

const ErrorSummaryListItem: FC<Props> = ({
  children,
  className,
  targetName,
  target,
  ...additionalProps
}) => {
  const isUnlinked = !targetName && !target
  const href = isUnlinked ? undefined : `#${targetName}`

  const onClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    if (isUnlinked) return
    const focusTarget =
      target ||
      document.querySelector<HTMLInputElement>(`[name="${targetName}"]`)
    if (focusTarget) focusTarget.focus()
  }

  return (
    <li className={className} {...additionalProps}>
      <a
        href={href}
        onClick={onClick}
        data-testid="error-summary-list-item-link"
      >
        {children}
      </a>
    </li>
  )
}

export default ErrorSummaryListItem
