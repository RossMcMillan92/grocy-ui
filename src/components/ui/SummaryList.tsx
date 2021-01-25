import classNames from "helpers/classNames"
import React, { FC } from "react"

export type ItemProps = {
  key: React.ReactNode
  keyProps?: React.HTMLAttributes<HTMLElement>
  value: React.ReactNode
  valueProps?: React.HTMLAttributes<HTMLElement>
}

export type Props = React.HTMLAttributes<HTMLElement> & {
  items: ItemProps[]
  keyProps?: React.HTMLAttributes<HTMLElement>
  showBorders?: boolean
  valueProps?: React.HTMLAttributes<HTMLElement>
}

const SummaryList: FC<Props> = ({
  className,
  items,
  keyProps: { className: keyClassName, ...keyProps } = {},
  valueProps: { className: valueClassName, ...valueProps } = {},
  ...additionalProps
}) => (
  <dl
    className={classNames("govuk-summary-list", className)}
    {...additionalProps}
  >
    {items.map(
      (
        {
          key,
          keyProps: {
            className: individualKeyClassName,
            ...individualKeyProps
          } = {},
          value,
          valueProps: {
            className: individualValueClassName,
            ...individualValueProps
          } = {},
        },
        index
      ) => (
        <div className="mb-2" key={index}>
          <dt
            className={classNames(
              "text-sm text-gray-600",
              keyClassName,
              individualKeyClassName
            )}
            {...keyProps}
            {...individualKeyProps}
          >
            {key}
          </dt>
          <dd
            className={classNames(
              "font-medium text-gray-700",
              valueClassName,
              individualValueClassName
            )}
            {...valueProps}
            {...individualValueProps}
          >
            {value}
          </dd>
        </div>
      )
    )}
  </dl>
)

export default SummaryList
