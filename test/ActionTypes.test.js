import '@babel/polyfill'
import * as a from '../src/ActionTypes';



const nameEnhancer = a.makeNamespaceEnhancer('myapp')('myreducer')
let CRUDExpand = a.expandSuffix(['INSERT','DELETE','UPDATE'])

test ('ActionNamer',()=>{
  expect(nameEnhancer('test')).toBe('myapp/myreducer/test')
})



test ('ActionType',()=>{
  expect(a.actionType('LIST')()).toEqual({LIST:'LIST'})
  expect(a.actionType('LIST')(nameEnhancer)).toEqual({LIST:'myapp/myreducer/LIST'})
})


test ('ActionRename',()=>{
  let nameEnhancer2 = a.makeNamespaceEnhancer('anotherapp')('anotherreducer')
  expect(
    a.actionType('LIST')()
  ).toEqual({LIST:'LIST'})
  expect(
    a.actionType('LIST')(nameEnhancer)
  ).toEqual({LIST:'myapp/myreducer/LIST'})

  expect(
    a.hold(nameEnhancer2)(a.actionType('LIST'))(nameEnhancer)
  ).toEqual({LIST:'anotherapp/anotherreducer/LIST'})

//  console.log(combineActionTypes(actionRename(nameCreator2)(actionType('LIST'),actionType('LIST2')))())
  expect(
    a.combineActionTypes(a.hold(nameEnhancer2)(a.actionType('LIST'),a.actionType('LIST2')))(nameEnhancer)
  ).toEqual({ LIST: 'anotherapp/anotherreducer/LIST',
      LIST2: 'anotherapp/anotherreducer/LIST2' })
})

test ('ActionExpand',()=>{
  let expected = {"JOB_DELETE": "JOB_DELETE", "JOB_INSERT": "JOB_INSERT"};
  let CDExpand = a.expandSuffix(['INSERT','DELETE']);
  expect( a.combineActionTypes(CDExpand('JOB'))()).toEqual(expected);

})



test ('CreateActionTypes',()=>{
  let expected = {
    LIST:'LIST'
  }
  let res = a.combineActionTypes(
    a.actionType('LIST')
  )
  expect(res()).toEqual(expected)


})


test ('ActionGroup',()=>{
  let expected = {worker:  {
         "LIST": "LIST",
         "LISTMORE": "LISTMORE",
       }}
  let group = a.groupAs('worker')
  let res = group(a.actionType('LIST'),a.actionType('LISTMORE'))();
  expect(res).toEqual(expected)
})

test ('Expand in group',()=>{
  let expected = {worker: {
         LIST_INSERT:"LIST_INSERT",
         LIST_DELETE:"LIST_DELETE",
         LIST_UPDATE:"LIST_UPDATE",
       }}
  let workerGroup = a.groupAs('worker');
  let res = workerGroup(CRUDExpand('LIST'));
  expect(res()).toEqual(expected)
})



test ('CreateActionTypes',()=>{
  let expected = {
    LIST:'LIST'
  }
  let res = a.combineActionTypes(
    a.actionType('LIST')
  )
  expect(res()).toEqual(expected)

  res = a.combineActionTypes(
    'LIST'
  )
  expect(res()).toEqual(expected)

})


test ('CreateActionTypes_expand',()=>{
  let expected = {
    LIST:'LIST',
    LIST_DELETE: "LIST_DELETE",
    LIST_INSERT: "LIST_INSERT",
    LIST_UPDATE: "LIST_UPDATE",
  }
  let res = a.combineActionTypes(
    'LIST',
    CRUDExpand('LIST')
  )
  expect(res()).toEqual(expected)
})

test ('CreateActionTypes_group',()=>{
  let expected = {
    LIST:'LIST',
    LIST_DELETE: "LIST_DELETE",
    LIST_INSERT: "LIST_INSERT",
    LIST_UPDATE: "LIST_UPDATE",
    LIST2:{
      "LIST_DELETE": "LIST_DELETE",
      "LIST_INSERT": "LIST_INSERT",
       "LIST_UPDATE": "LIST_UPDATE",

      },

  }
  let res = a.combineActionTypes(
    'LIST',
    CRUDExpand('LIST'),
    a.groupAs('LIST2')(CRUDExpand('LIST'))
  )
  expect(res()).toEqual(expected)
})



test ('Naming Actions and ensure that we dont erase actionRename',()=>{
  let expected = {
    LIST:'LIST',
    LIST_DELETE: "LIST_DELETE",
    LIST_INSERT: "LIST_INSERT",
    LIST_UPDATE: "LIST_UPDATE",
    LIST2:{
      "LIST_DELETE": "app/subreducer/LIST_DELETE",
      "LIST_INSERT": "app/subreducer/LIST_INSERT",
      "LIST_UPDATE": "app/subreducer/LIST_UPDATE",
      },
  }

  let another_reducer_naming = a.makeNamespaceEnhancer('app')('subreducer')
  let res = a.combineActionTypes(
    'LIST',
    CRUDExpand('LIST'),
    a.groupAs('LIST2')(a.hold(another_reducer_naming)(CRUDExpand('LIST')))
  )
  expect(res()).toEqual(expected)


  // ensuring that naming is not erased
  let nameCreator = a.makeNamespaceEnhancer('myapp')('myreducer');
  let final =res(nameCreator);

  expect(final).toEqual({ LIST: 'myapp/myreducer/LIST',
      LIST_INSERT: 'myapp/myreducer/LIST_INSERT',
      LIST_DELETE: 'myapp/myreducer/LIST_DELETE',
      LIST_UPDATE: 'myapp/myreducer/LIST_UPDATE',
      LIST2:
       { LIST_INSERT: 'app/subreducer/LIST_INSERT',
         LIST_DELETE: 'app/subreducer/LIST_DELETE',
         LIST_UPDATE: 'app/subreducer/LIST_UPDATE' } })
})


test('combine actionTypes ',()=>{
  let expected = {
      ACTION1: 'ACTION1',
      ACTION2: 'ACTION2',
      ACTION3: 'ACTION3',
      ACTION4: 'ACTION4' }
  let type1 = a.combineActionTypes(
    'ACTION1',
    'ACTION2'
  )

  let type2 = a.combineActionTypes(
    'ACTION3',
    'ACTION4'
  )

  let combined = a.combineActionTypes(
    type1,
    type2
  )

  expect(combined()).toEqual(expected)

  let grouped = a.combineActionTypes(
    a.groupAs('type1')(type1),
    a.groupAs('type2')(type2),
  )

  expect(grouped()).toEqual({ type1: { ACTION1: 'ACTION1', ACTION2: 'ACTION2' },
      type2: { ACTION3: 'ACTION3', ACTION4: 'ACTION4' } }
)

})
