import { TypeClass, TypeMethod, TypeParam } from '../src'

@TypeClass
class Http {
  options? = {}
  constructor(@TypeParam('Object') options?: any) {
    this.options = options
  }

  @TypeMethod
  get(@TypeParam('String') url: any, options?: any) {}

  @TypeMethod
  post(url: any, @TypeParam('Object') options: any) {}

  @TypeMethod
  put(@TypeParam('String|Symbol') url: any, options?: any) {}

  @TypeMethod
  delete(@TypeParam('String') url: any, @TypeParam('Object', true) options?: any) {}

  @TypeMethod
  patch(@TypeParam('Symbol') url: any, options?: any) {}
}

describe('Unit tests', () => {
  test('constructor arguments[0] error', () => {
    expect(() => {
      new Http(1)
    }).toThrowError(new TypeError('constructor arguments[0] must be Object'))
  })

  test('get arguments[0] error', () => {
    expect(() => {
      const http = new Http()
      http.get(1)
    }).toThrowError(new TypeError('get arguments[0] must be String'))
  })

  test('post arguments[1] error', () => {
    expect(() => {
      const http = new Http()
      http.post(1, 2)
    }).toThrowError(new TypeError('post arguments[1] must be Object'))
  })

  test('put arguments[0] error', () => {
    expect(() => {
      const http = new Http()
      http.put(1)
    }).toThrowError(new TypeError('put arguments[0] must be String,Symbol'))
  })

  test('delete arguments[1] error', () => {
    expect(() => {
      const http = new Http()
      http.delete('')
    }).toThrowError(new TypeError('delete arguments[1] is required'))
  })

  test('patch arguments[0] not error', () => {
    expect(() => {
      const http = new Http()
      http.patch(Symbol('1'))
    }).not.toThrowError()
  })
})
