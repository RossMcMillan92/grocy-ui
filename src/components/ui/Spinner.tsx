import React, { FC } from "react"
import classNames from "helpers/classNames"

export type Props = React.HTMLAttributes<SVGElement> & {
  width?: string | number
  height?: string | number
  fill?: string
}

const Spinner: FC<Props> = ({
  className,
  fill = "currentColor",
  ...additionalProps
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="58"
    height="58"
    viewBox="0 0 58 58"
    className={classNames("spinner", className)}
    role="presentation"
    {...additionalProps}
  >
    <g transform="translate(2 1)" stroke="none" fill={fill}>
      <circle
        className="spinner__dot spinner__dot--1"
        cx="42.601"
        cy="11.462"
        r="5"
        opacity="0"
      >
        <animate
          attributeName="opacity"
          begin="0"
          values="1;0;0;"
          dur=".8s"
          repeatCount="indefinite"
        />
      </circle>
      <circle
        className="spinner__dot spinner__dot--2"
        cx="49.063"
        cy="27.063"
        r="5"
        opacity="0"
      >
        <animate
          attributeName="opacity"
          begin=".1"
          values="1;0;0;"
          dur=".8s"
          repeatCount="indefinite"
        />
      </circle>
      <circle
        className="spinner__dot spinner__dot--3"
        cx="42.601"
        cy="42.663"
        r="5"
        opacity="0"
      >
        <animate
          attributeName="opacity"
          begin=".2"
          values="1;0;0;"
          dur=".8s"
          repeatCount="indefinite"
        />
      </circle>
      <circle
        className="spinner__dot spinner__dot--4"
        cx="27"
        cy="49.125"
        r="5"
        opacity="0"
      >
        <animate
          attributeName="opacity"
          begin=".3"
          values="1;0;0;"
          dur=".8s"
          repeatCount="indefinite"
        />
      </circle>
      <circle
        className="spinner__dot spinner__dot--5"
        cx="11.399"
        cy="42.663"
        r="5"
        opacity="0"
      >
        <animate
          attributeName="opacity"
          begin=".4"
          values="1;0;0;"
          dur=".8s"
          repeatCount="indefinite"
        />
      </circle>
      <circle
        className="spinner__dot spinner__dot--6"
        cx="4.938"
        cy="27.063"
        r="5"
        opacity="0"
      >
        <animate
          attributeName="opacity"
          begin=".5"
          values="1;0;0;"
          dur=".8s"
          repeatCount="indefinite"
        />
      </circle>
      <circle
        className="spinner__dot spinner__dot--7"
        cx="11.399"
        cy="11.462"
        r="5"
        opacity="0"
      >
        <animate
          attributeName="opacity"
          begin=".6"
          values="1;0;0;"
          dur=".8s"
          repeatCount="indefinite"
        />
      </circle>
      <circle
        className="spinner__dot spinner__dot--8"
        cx="27"
        cy="5"
        r="5"
        opacity="0"
      >
        <animate
          attributeName="opacity"
          begin=".7"
          values="1;0;0;"
          dur=".8s"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  </svg>
)

export default Spinner
