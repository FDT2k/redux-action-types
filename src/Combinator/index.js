import * as c from '@geekagency/composite-js'

/*
  my idea of a combinator is to have a function that return an object with composite properties.
  Purpose of this, is to make reusable and combinable code blocks

  Some theory:

  MakeCombinator: make a combinator with an ArgsCombinator

  Combinator: store arguments by using an ArgsCombinator, return a function that accept an ArgEnhancer and combine them to an object
    signature: [Arg] -> ArgEnhancer -> Object

  ArgsCombinator: return an array of args
    signature: [a,...,z] -> [a,...,z]
    role: sanitize and normalize args.

  ArgEnhancer:
    signature: ( Arg-> b )
    role: enhancer to modify an arg value

  Arg:
    signature: ArgEnhancer -> x
    role: return a function that accept an ArgEnhancer and apply it to x

  Prop:
    signature: key -> ArgEnhancer -> Arg -> x
    role: return a property to compose the final object

  ArgTransformer:
    signature: a -> b
    role: transform an Arg of type a into type b


*/

export const _throw = x=> val=> {console.log(val);throw new Error(x)}

//interrupt everything
export const _eitherThrow = (cond,error)=> c._either(cond,_throw(error),c.identity);


// Scalar x -> a-> Object as {x:a}
export const asProp =  c.as_prop;

// apply enhancer to the current key
// Scalar x -> ArgEnhancer -> a  ->  Object as {x:a}
export const asEnhancedProp = c.curry((key,enhance)=>c.compose(asProp(key),enhance))

export const enhancedPropWithDefaultEnhancer= key => c.compose(asEnhancedProp(key),c.defaultTo(c.identity))

// enhance is not currified because we want to be able to call with no arg()
export const asFunctionProp = c.curry((key,func) => enhance=> enhancedPropWithDefaultEnhancer(key)(enhance)(func))

export const asScalarProp = c.curry((key,value) => enhance => enhancedPropWithDefaultEnhancer(key)(enhance)(value))

// if no value, the default is the value of the key
export const asScalarPropWithDefaultValue = key=>value=> enhance=> c.compose(enhancedPropWithDefaultEnhancer(key)(enhance),c.defaultTo(key))(value)

// transform an arg of a type into another
export const transformArgToFunctionIfNeeded = defaultFn => c._either(c.is_type_function,defaultFn,c.identity)

export const flattenArgsCombinator = c.flatten

export const defaultArgTransformer = x=>asScalarPropWithDefaultValue(x)(x)

export const defaultCombineArgs  = c.map(transformArgToFunctionIfNeeded(defaultArgTransformer))

export const defaultArgsCombinator = c.compose(defaultCombineArgs,flattenArgsCombinator)

//ArgumentCombinator ::  [a] -> [b]
//makeCombine :: ArgumentCombinator -> (a...z) => Object
export const makeObjectCombinator = argsCombinator=> (...args )=> c.divergeLeftThen(c.mergeAll)(...argsCombinator(args))

export const makeCombineGroup = combinator =>  group => (...args) => c.compose(asProp(group),combinator(...args))

export const makeFreezeEnhancer = combinator => enhancer => (...args )=> ()=>combinator(...args)(enhancer)

export const makeExpander = c.curry ((argType,transform,subTypes,type) =>{
	return subTypes.map(subType=>{
		return argType(transform(type,subType));
	});
});

export const combineObject=  makeObjectCombinator(defaultArgsCombinator);

export const group = makeCombineGroup(combineObject)
