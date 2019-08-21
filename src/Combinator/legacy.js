import * as c from '@geekagency/composite-js'


export const transformableObjectProperty = c.curry ( (type,transform,value)=>{return c.compose(c.as_prop(type),transform)(value)})

export const transformableObjectPropertyAsValue = c.curry ( (type, transform ) =>transformableObjectProperty(type,transform,type))

export const defaultObjectValue  = type => c.compose(transformableObjectPropertyAsValue(type),c.defaultTo(c.identity))

export const functionValue = c.curry((key,fn,transform ) => c.compose(transformableObjectProperty(key),c.defaultTo(c.identity))(transform)(fn))

export const defaultEnhanceArgIfString = defaultFn => c._either(c.is_type_function,defaultFn,c.identity)

export const defaultCombineTypes  = c.map(defaultEnhanceArgIfString(x=>defaultObjectValue(x)))


export const defaultArgsCombinator = c.compose(defaultCombineTypes,c.flatten)

//ArgumentCombinator ::  [a] -> [b]
//makeCombine :: ArgumentCombinator -> (a...z) => Object
export const makeObjectCombinator = argsCombinator=> (...args )=> c.divergeLeftThen(c.mergeAll)(...argsCombinator(args))
//export const makeArrayCombinator  = argsCombinator=> (...args )=> c.diverge(...argsCombinator(args))


export const combineObject=  makeObjectCombinator(defaultArgsCombinator);
//export const combineArray=  makeArrayCombinator(defaultArgsCombinator);
