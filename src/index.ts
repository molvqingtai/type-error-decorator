import 'reflect-metadata'
import typeOf from 'src/utils/typeOf'

export interface Models {
  [key: string]: {
    type: string | string[]
    required: boolean
  }
}

type Metadata = { parameter: keyof Models; parameterIndex: number } | undefined

const metadataKey = Symbol('type:error')

export const Param = (parameter: string) => (target: any, propertyKey: string, parameterIndex: number) => {
  Reflect.defineMetadata(
    metadataKey,
    {
      parameter,
      parameterIndex
    },
    target,
    propertyKey
  )
}

export const Model = (models: Models) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value
    descriptor.value = function (...args: any[]) {
      const metadata: Metadata = Reflect.getMetadata(metadataKey, target, propertyKey)
      if (metadata) {
        const { type, required } = models[metadata.parameter]
        const value = args[metadata.parameterIndex]
        if (typeOf(value) === 'Undefined' && required) {
          throw new TypeError(`${metadata.parameter} is required`)
        }
        if (typeOf(value) !== 'Undefined' && ![type].flat().includes(typeOf(value))) {
          throw new TypeError(`${metadata.parameter} must be ${type.toString()}`)
        }
      }
      return originalMethod.apply(this, args)
    }
  }
}
