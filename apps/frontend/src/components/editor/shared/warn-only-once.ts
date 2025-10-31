export function warnOnlyOnce(message: string) {
  if (process.env.NODE_ENV === 'production') {
    return
  }
  let run = false
  return () => {
    if (!run) {
      // eslint-disable-next-line no-console
      console.warn(message)
    }
    run = true
  }
}
