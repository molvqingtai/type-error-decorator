import typeOf from './typeOf'

/**
 * instanceEqual
 * Because compressed code may change function name
 * Only built-in constructors can be compared
 */
const instanceEqual = (a: any, b: any) => {
  if (typeof a === 'function' && typeof b === 'function') {
    return a.name === b.name
  }
  if (typeof a === 'function') {
    return a.name.toUpperCase() === typeOf(b).toUpperCase()
  }
  if (typeof b === 'function') {
    return typeOf(a).toUpperCase() === b.name.toUpperCase()
  }
}

export default instanceEqual
