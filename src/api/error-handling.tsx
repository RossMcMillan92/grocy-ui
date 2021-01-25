type WithErrorHandling<T = unknown> = Promise<
  { data: T; error?: Error } | { data?: T; error: Error }
>

export function withErrorHandling<T = unknown>(
  promise: Promise<T>
): WithErrorHandling<T> {
  return promise
    .then((data: T) => ({ data }))
    .catch((error: Error) => ({ error }))
}
