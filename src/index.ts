import 'reflect-metadata'
import typeOf from './utils/typeOf'

interface TypeModel {
  type: string
  required?: boolean
  index: number
}
type ParamsModel = Set<TypeModel>
type MethodsModel = Map<string, ParamsModel>
type Constructor = new (...args: any[]) => any

const METADATA_KEY = Symbol('type:error')

const typesModel = new Map<string, MethodsModel>()

const paramsChecker = (models: ParamsModel, params: any[], prefix: string) =>
  models.forEach((model: TypeModel) => {
    const value = params[model.index]
    const types = model.type.split('|')
    if (typeof value === 'undefined' && model.required) {
      throw new TypeError(`${prefix} arguments[${model.index}] is required`)
    }
    if (typeof value !== 'undefined' && !types.some((type: string) => type === typeOf(value))) {
      if (types.length > 1) {
        throw new TypeError(`${prefix} arguments[${model.index}] must be ${types.toString().replace(',', ' or ')}`)
      } else {
        throw new TypeError(`${prefix} arguments[${model.index}] must be ${types.toString()}`)
      }
    }
  })

export const TypeClass = <T extends Constructor>(constructor: T) => {
  const methods: MethodsModel | undefined = Reflect.getMetadata(METADATA_KEY, constructor, 'TypeParam')?.get(
    'constructor'
  )
  return class extends constructor {
    constructor(...args: any[]) {
      const models: ParamsModel | undefined = methods?.get('constructor')
      models && paramsChecker(models, args, 'constructor')
      super(...args)
    }
  }
}

export const TypeMethod = (target: object, key: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value
  const methods: MethodsModel | undefined = Reflect.getMetadata(METADATA_KEY, target, 'TypeParam')?.get('method')
  descriptor.value = function (...args: any[]) {
    const models: ParamsModel | undefined = methods?.get(key)
    models && paramsChecker(models, args, key)
    return originalMethod.apply(this, args)
  }
}

export const TypeParam =
  (type: string, required = true) =>
  (target: object, key: string, index: number) => {
    const typeKey = key ? 'method' : 'constructor'
    const methodKey = key ?? 'constructor'
    const model: TypeModel = { type, required, index }
    typesModel.set(
      typeKey,
      typesModel
        .get(typeKey)
        ?.set(methodKey, typesModel.get(typeKey)?.get(methodKey)?.add(model) ?? new Set([model])) ??
        new Map([[methodKey, new Set([model])]])
    )

    Reflect.defineMetadata(METADATA_KEY, typesModel, target, 'TypeParam')
  }
