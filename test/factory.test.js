import * as _ from '../src/ActionTypes';
import * as c from '@geekagency/composite-js'
test("[ReduxAT] actionType", (done)=>{

  expect(_.actionType('aha')()).toEqual({aha:'aha'})
  expect(_.actionTypeFrom('aha')(c.identity)('aha')).toEqual({aha:'aha'})

})

test("[ReduxAT] groupAs", (done)=>{

  expect (
    _.groupAs('coucou')('test','test2')()
  )
    .toEqual(
      { coucou: { test: 'test', test2: 'test2' } }
    )

  let res = _.combineActionTypes('test','test2',_.groupAs('plop')('ahi','ahou'))

  expect(res())
    .toEqual({ test: 'test',
        test2: 'test2',
        plop: { ahi: 'ahi', ahou: 'ahou' } })

  expect(res(y=>y+'_ahi'))
    .toEqual({ test: 'test_ahi',
      test2: 'test2_ahi',
      plop: { ahi: 'ahi_ahi', ahou: 'ahou_ahi' } })
})

test("[ReduxAT] expand",()=>{

  expect (
    _.groupAs('coucou')(_.expandSuffix(['FETCH','CREATE','DEL'])('LISTING'))()
  ).toEqual(
    {"coucou": {"LISTING_CREATE": "LISTING_CREATE", "LISTING_DEL": "LISTING_DEL", "LISTING_FETCH": "LISTING_FETCH"}}
  )

  expect (
    _.groupAs('coucou')(_.expandPrefix(['FETCH','CREATE','DEL'])('LISTING'))()
  ).toEqual(
    {"coucou": {"CREATE_LISTING": "CREATE_LISTING", "DEL_LISTING": "DEL_LISTING", "FETCH_LISTING": "FETCH_LISTING"}}
  )
  expect (
    _.combineActionTypes(_.expandPrefix(['FETCH','CREATE','DEL'])('LISTING'))()
  ).toEqual(  {"CREATE_LISTING": "CREATE_LISTING", "DEL_LISTING": "DEL_LISTING", "FETCH_LISTING": "FETCH_LISTING"})
})

test("[ReduxAT] hold",()=>{

  expect (
    _.hold(x=>'ahi_'+x)(_.actionType('LIST'))(y=>y+'_ahi')
  ).toEqual({"LIST": "ahi_LIST"})

  expect (
    _.hold(x=>'ahi_'+x)(_.actionType('LIST'),_.actionType('FETCH'))(y=>y+'_ahi')
  ).toEqual({"FETCH": "ahi_FETCH", "LIST": "ahi_LIST"})

})

test("[ReduxAT] defaultBindArg",()=>{

    expect ( c.is_type_function((x)=>x)).toBe(true)
    expect ( c.is_type_function('toto')).toBe(false)

    let testCombine = _.bindDefaultArgIfString(y=>()=>'huu'+y)

    expect(testCombine).toBeInstanceOf(Function)
    expect(testCombine('toto')()).toBe('huutoto')

    expect(testCombine((x)=>'toto')()).toBe('toto')
})

test ('[ReduxAT] combineTypes',(done)=>{
  let prefixTransformer = name => `hihi_${name}`

  expect (
    _.combineTypes([_.actionType('COUCOU'),_.actionType('HELLO'),'toto']).map(item=>item())
  ).toEqual( [{"COUCOU": "COUCOU"}, {"HELLO": "HELLO"}, {"toto": "toto"}])

  expect (
    _.combineActionTypes(_.actionType('COUCOU'),_.actionType('HELLO'),'PROUT')(prefixTransformer)
  ).toEqual ({"COUCOU": "hihi_COUCOU", "HELLO": "hihi_HELLO", "PROUT": "hihi_PROUT"})
})
