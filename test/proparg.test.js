import * as CC from '../src/Combinator'
import * as CL from '../src/Combinator/legacy'
import * as c from '@geekagency/composite-js'
test('[AC] asProp',()=>{


  expect(
    CC.asProp('hihi')
  ).toBeInstanceOf(Function)

  expect(
    CC.asProp('hihi')('coucou')
  ).toEqual({hihi:'coucou'})

});

test('[AC] asEnhancedProp',()=>{

  expect(
    CC.asEnhancedProp('hihi')(x=>x)('coucou')
  ).toEqual({hihi:'coucou'})

  expect(
    CC.asEnhancedProp('hihi')(x=>x+'hihi')('coucou')
  ).toEqual({hihi:'coucouhihi'})


  expect(
    CC.asEnhancedProp('hihi')(x=>x) ('coucou')
  ).toEqual(CL.transformableObjectProperty('hihi')(x=>x)('coucou'))
});

test('[AC] asScalarPropWithDefaultValue',()=>{

  expect(
    CC.asScalarPropWithDefaultValue('hihi')(null)(x=>x)
  ).toEqual({hihi:'hihi'})

  expect(
    CC.asScalarPropWithDefaultValue('hihi') ('coucou')(x=>x)
  ).toEqual({hihi:'coucou'})

  expect(
    CC.asScalarPropWithDefaultValue('hihi') ()(x=>x)
  ).toEqual({hihi:'hihi'})


});

test('[AC] argsCombinator',()=>{
  const callback = (...args)=>{
    return x=>args[0]
  }

  const test_transform = CC.transformArgToFunctionIfNeeded(callback)

  expect(test_transform('coucou')).toBeInstanceOf(Function)
  expect(test_transform('coucou')()).toBe('coucou')

  expect(test_transform(x=>'coucou2')).toBeInstanceOf(Function)
  expect(test_transform(x=>'coucou2')()).toBe('coucou2')


  const alteredTransformer = (arg)=>{
    console.log('transform',arg)
    return CC.defaultArgTransformer(arg)
  }

  let transformer = CC.transformArgToFunctionIfNeeded(alteredTransformer)

  let res =  transformer('coucou')
  console.log(res(null))
//  console.log('defaultArgTransformer',res('a','b'))

  res = transformer(CC.asScalarPropWithDefaultValue('hihi'));

  //console.log('defaultArgTransformer',res('a','b')(x=>x));
  /*

  console.log(CC.defaultCombineArgs(['ahah']))

  console.log(CC.defaultCombineArgs(['ahah']))
  console.log('combinator',CC.defaultArgsCombinator(['ahah']))
  console.log('combinator',CC.defaultArgsCombinator(['ahah'])[0](null))*/
});



test('[AC] asScalarPropWithDefaultValue',()=>{
  let enhancer = (arg)=>{
    console.log('enhancer',arg)
    return arg+'blabla'
  }
  expect(
    CC.asScalarPropWithDefaultValue('key')('coucou')(null)
  ).toEqual({key:'coucou'})

  expect(
    CC.asScalarPropWithDefaultValue('key')('coucou')(enhancer)
  ).toEqual({key:'coucoublabla'})

  expect(
    CC.asScalarPropWithDefaultValue('key')(null)(enhancer)
  ).toEqual({key:'keyblabla'})

  expect(
    CC.asScalarPropWithDefaultValue('key')()(enhancer)
  ).toEqual({key:'keyblabla'})

});

test('[AC] asFunctionProp',()=>{

  let funcToCombine = x => {expect(x).toEqual(argEnhancer)};
  let argEnhancer = x => {expect(x).toEqual(funcToCombine)};

  CC.asFunctionProp('key')(argEnhancer)(funcToCombine)

  argEnhancer = x=>args=>{
  /*  console.log('enhancer called')
    console.log('stored fn',x)
    console.log('args',args)*/
    expect(x).toEqual(funcToCombine)
    return x(args)
  }

  funcToCombine =  args =>  {
  //  console.log('combined args',args)
    return args
  }

  let res = CC.asFunctionProp('key')(funcToCombine)(argEnhancer)

  res.key('hello world')

  expect(res.key).toBeInstanceOf(Function)

  res = CC.asFunctionProp('key')(funcToCombine)()

  expect(res.key('hello world')).toBe('hello world')

})


test('[AC] Combine asFunctionProp ',()=>{

  let func = CC.asFunctionProp('func',arg=>arg)
  let func2 = CC.asFunctionProp('funcb',arg=>arg*2)

  let combined = CC.combineObject(func,func2)
  // combined is now a function that accepts an enhancer, identity by default
  let mycombination = combined()
  //now we have an object with function as keys

  expect(mycombination.func(12)).toBe(12)
  expect(mycombination.funcb(12)).toBe(24)

  /*
  applying an enhancer to double the results. Enhancer receive the function or value as argument,
  if the x is a function we can return another function because it'll be applied as the property value
  */

  let enhancedCombination = combined(x=>arg=> x(arg)*2)
  expect(enhancedCombination.func(12)).toBe(24)
  expect(enhancedCombination.funcb(12)).toBe(48)


})

test('[AC] Combine asProp ',()=>{
  //to be combined an arg should accept an enhancer arg

  let a = enhance=>CC.asProp('a',enhance('a'))
  let b = enhance=>CC.asProp('b',enhance('b'))

  let combined = CC.combineObject(a,b)
  // combined is now a function that accepts an enhancer, identity by default
  let mycombination = combined(x=>x)
  //now we have an object with function as keys


})


test('[AC] Combine asProp ',()=>{
  //to be combined an arg should accept an enhancer arg

  let a = enhance=>CC.asProp('a',enhance('a'))
  let b = enhance=>CC.asProp('b',enhance('b'))

  let combined = CC.combineObject(a,b)
  // combined is now a function that accepts an enhancer, identity by default
  let mycombination = combined(x=>x)
  //now we have an object with function as keys


})


test('[AC] Combine asScalarPropWithDefaultValue ',()=>{
  //to be combined an arg should accept an enhancer arg

  let a = CC.asScalarPropWithDefaultValue('a')(x=>x)
  let b = CC.asScalarPropWithDefaultValue('b')(x=>x)

  let combined = CC.combineObject(a,b)
  // combined is now a function that accepts an enhancer, identity by default
  let mycombination = combined()
  //now we have an object with function as keys
  console.log(mycombination)

})


test('[AC] Combine asScalarProp ',()=>{
  //to be combined an arg should accept an enhancer arg

  let a = CC.asScalarProp('a','a')
  let b = CC.asScalarProp('b','b')

  let combined = CC.combineObject(a,b)
  // combined is now a function that accepts an enhancer, identity by default
  let mycombination = combined()
  //now we have an object with function as keys
  console.log(mycombination)

  mycombination = combined(x=> 'a'+x)
  console.log(mycombination)

})
