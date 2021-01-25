const classNames = (
  ...args: Array<HTMLElement["className"] | boolean | null | undefined>
): string => args.filter(Boolean).join(" ")

export default classNames
