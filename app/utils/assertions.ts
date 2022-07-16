type IsString<T> = T extends string ? T : never

export function assertString<TValue>(value: TValue): asserts value is IsString<TValue> {
  if (typeof value !== 'string') {
    throw new Error(`Expected string, got ${typeof value}`)
  }
}
