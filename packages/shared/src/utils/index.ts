/**
 * Returns a shallow copy of the object without the specified keys.
 *
 * @param object - The source object.
 * @param keys - An array of keys to omit from the object.
 * @returns A new object without the specified keys.
 */
export function omit<Object, Key extends keyof Object>(
  object: Object,
  keys: Key[]
): Omit<Object, Key> {
  for (const key of keys) {
    delete object[key]
  }
  return object
}
