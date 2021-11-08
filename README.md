# type-error-decorator

[![version](https://img.shields.io/github/v/release/molvqingtai/type-error-decorator)](https://www.npmjs.com/package/@resreq/type-error-decorator)  [![workflow](https://github.com/molvqingtai/type-error-decorator/actions/workflows/ci.yml/badge.svg)](https://github.com/molvqingtai/type-error-decorator/actions)  [![download](https://img.shields.io/npm/dt/@resreq/type-error-decorator)](https://www.npmjs.com/package/@resreq/type-error-decorator)  [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

TypeError Decorator for JavaScript &amp; TypeScript



When we make a TypeScript-based library, the compiled .d.ts will only work for TypeScript users, and if we need to add type checking for Vanilla JS users as well, we need to write redundant type of judgements.

This project provides some decorators that make it easy to add type checking to class.



## Install



```shell
npm i @resreq/type-error-decorator
```

**or**

```shell
yarn add @resreq/type-error-decorator
```





## Documentation



### Get Started

Using decorators in class.

```js
import { TypeClass, TypeMethod, TypeParam } from '@resreq/type-error-decorator'

@TypeClass
class Http {
  options
  constructor(@TypeParam('Object') options?: any) {
    this.options = options
  }

  @TypeMethod
  get(@TypeParam('String') url: any, options?: any) {}

  @TypeMethod
  post(@TypeParam('String|URL') url: any, @TypeParam('Object',true) options: any) {}
}
```



Testing your class, with an incorrect parameter type, will throw a TypeError.

```js
new Http(1) 
// TypeError: constructor arguments[0] must be Object
```
```js
const http = new Http()
http.get(1) 
// TypeError: get arguments[0] must be String
```

```js
const http = new Http()
http.post(1, {}) 
// TypeError: post arguments[0] must be String,URL
```

```js
const http = new Http()
http.post(new URL('https://www.example.com/')) 
// TypeError: post arguments[1] is required
```



The decorator uses `Symbol.toStringTag` internally to compare types, so you can use all the built-in constructor names (Upper Camel Case) to define types

For example: 

```js
@TypeParam('BigInt|RegExp|Symbol|Request|Response|...')
```



### Decorators

**TypeClass**

* **Arguments:** No

* **Usage:**

  The check constructor must have @TypeClass added to the class.



**TypeMethod**

* **Arguments:** No

* **Usage:**

  The check method must have @TypeMethod added to the method.



**TypeParam(type, required = false)**

- **Arguments:**
  - `{string} type`
  - `{Boolean?} required`

- **Usage:**

  Add @TypeParam to the parameters of the method to set the type of check.



## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/molvqingtai/type-error-decorator/blob/master/LICENSE) file for details

