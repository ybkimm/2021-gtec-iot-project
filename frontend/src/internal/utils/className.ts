export const classNames = (...classNames: unknown[]): string => {
  return classNames.filter(v => typeof v === 'string').join(' ')
}
