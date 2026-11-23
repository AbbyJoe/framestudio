/** Joins class names, skipping falsy values. */
export function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(" ")
}
