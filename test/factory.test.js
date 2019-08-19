import * as _ from '../src/ActionTypes';
import * as c from '@geekagency/composite-js'

test("actionType", (done)=>{

  expect(_.actionType('aha')()).toEqual({aha:'aha'})
  expect(_.actionTypeFrom('aha')(c.identity)('aha')).toEqual({aha:'aha'})

})

test("groupAs", (done)=>{

  expect (_.groupAs('coucou')('test','test2')()).toEqual({ coucou: { test: 'test', test2: 'test2' } })

  let res = _._combineActionTypes('test','test2',_.groupAs('plop')('ahi','ahou'))

  expect(res()).toEqual({ test: 'test',
      test2: 'test2',
      plop: { ahi: 'ahi', ahou: 'ahou' } })

  expect(res(y=>y+'_ahi')).toEqual({ test: 'test_ahi',
      test2: 'test2_ahi',
      plop: { ahi: 'ahi_ahi', ahou: 'ahou_ahi' } })
})

test("expand",()=>{

  expect (_.groupAs('coucou')(_.expandSuffix(['FETCH','CREATE','DEL'])('LISTING'))()).toEqual({"coucou": {"LISTING_CREATE": "LISTING_CREATE", "LISTING_DEL": "LISTING_DEL", "LISTING_FETCH": "LISTING_FETCH"}})
  expect (_.groupAs('coucou')(_.expandPrefix(['FETCH','CREATE','DEL'])('LISTING'))()).toEqual( {"coucou": {"CREATE_LISTING": "CREATE_LISTING", "DEL_LISTING": "DEL_LISTING", "FETCH_LISTING": "FETCH_LISTING"}})
  expect (_._combineActionTypes(_.expandPrefix(['FETCH','CREATE','DEL'])('LISTING'))()).toEqual(  {"CREATE_LISTING": "CREATE_LISTING", "DEL_LISTING": "DEL_LISTING", "FETCH_LISTING": "FETCH_LISTING"})
})

test("hold",()=>{

  expect (_.hold(x=>'ahi_'+x)(_.actionType('LIST'))(y=>y+'_ahi')).toEqual({"LIST": "ahi_LIST"})

})


test ('makeActionTypes',(done)=>{
  let nameCreator = name => `hihi_${name}`

  expect ( c.is_type_function((x)=>x)).toBe(true)
  expect ( c.is_type_function('toto')).toBe(false)

  let testCombine = _.bindDefaultArgIfString(y=>()=>'huu'+y)

  expect(testCombine).toBeInstanceOf(Function)
  expect(testCombine('toto')()).toBe('huutoto')

  expect(testCombine((x)=>'toto')()).toBe('toto')

  _.combineTypes([_.actionType('COUCOU'),_.actionType('HELLO'),'toto'])
  let res = _._combineActionTypes(_.actionType('COUCOU'),_.actionType('HELLO'),'PROUT')(nameCreator);
  console.log(res)
})
