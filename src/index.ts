import 'reflect-metadata'
import instanceEqual from './utils/instanceEqual'

type Constructor = new (...args: any[]) => any

interface Model {
  type: Constructor | Constructor[]
  required?: boolean
  index: number
}

const METADATA_KEY = Symbol('type:error')

const ModelMap = new Map<string, Set<Model>>()

const paramsChecker = (models: Model[], params: any[], prefix: string) =>
  models.forEach((model: Model) => {
    const value = params[model.index]
    const types = [model.type].flat()
    if (typeof value === 'undefined' && model.required) {
      throw new TypeError(`${prefix} arguments[${model.index}] is required`)
    }
    if (typeof value !== 'undefined' && !types.some((type: Constructor) => instanceEqual(type, value))) {
      const typeString = types.map((type: Constructor) => type.name.toString()).toString()
      throw new TypeError(`${prefix} arguments[${model.index}] must be ${typeString}`)
    }
  })

export const TypeClass = <T extends Constructor>(constructor: T) => {
  const models = Reflect.getMetadata(METADATA_KEY, constructor, 'Param').get('constructor')
  return class extends constructor {
    constructor(...args: any[]) {
      paramsChecker([...models].reverse(), args, 'constructor')
      super(...args)
    }
  }
}

export const TypeMethod = (target: object, key: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value
  const models = Reflect.getMetadata(METADATA_KEY, target, 'Param').get('method')
  descriptor.value = function (...args: any[]) {
    paramsChecker([...models].reverse(), args, key)
    return originalMethod.apply(this, args)
  }
}

export const Param =
  (type: Constructor | Constructor[], required?: boolean) => (target: object, key: string, index: number) => {
    const _ModelMap = ModelMap.set(
      key ? 'method' : `constructor`,
      ModelMap.get(key)?.add({ type, required, index }) ?? new Set([{ type, required, index }])
    )
    Reflect.defineMetadata(METADATA_KEY, _ModelMap, target, 'Param')
  }
