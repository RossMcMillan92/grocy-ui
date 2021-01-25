import { isEqual } from 'lodash/fp'
import React from 'react'

// TODO: Change to use a library when all clients are on node 10+
// This is a partial copy of https://github.com/kentcdodds/use-deep-compare-effect
// That version requires node 10+, so to support node 8 we have a copy here

function useDeepCompareMemoize(value: unknown[]) {
  const ref = React.useRef<unknown[]>()

  if (!isEqual(value, ref.current)) {
    ref.current = value
  }

  return ref.current
}

const useDeepCompareEffect = (
  callback: () => void,
  dependencies: unknown[]
): void => {
  React.useEffect(callback, useDeepCompareMemoize(dependencies))
}

export default useDeepCompareEffect
