import '@babel/polyfill'
import {createActionName,makeCombineActionTypes,actionRename,actionType,applyActionNames,actionExpand,actionGroup,combineActionTypes} from '../src/ActionTypes/legacy';



const CRUDExpand =  actionExpand(['INSERT','DELETE','UPDATE']);
const nameCreator = createActionName('myapp')('myreducer')

test ('ActionNamer',(done)=>{
  expect(nameCreator('test')).toBe('myapp/myreducer/test')
})



test ('ActionType',(done)=>{
  expect(actionType('LIST')()).toEqual({LIST:'LIST'})
  expect(actionType('LIST')(nameCreator)).toEqual({LIST:'myapp/myreducer/LIST'})
})


test ('ActionRename',(done)=>{
  let nameCreator2 = createActionName('anotherapp')('anotherreducer')
  expect(actionType('LIST')()).toEqual({LIST:'LIST'})
  expect(actionType('LIST')(nameCreator)).toEqual({LIST:'myapp/myreducer/LIST'})
  expect(actionRename(nameCreator2)(actionType('LIST'))(nameCreator)).toEqual({LIST:'anotherapp/anotherreducer/LIST'})
//  console.log(combineActionTypes(actionRename(nameCreator2)(actionType('LIST'),actionType('LIST2')))())
  expect(combineActionTypes(actionRename(nameCreator2)(actionType('LIST'),actionType('LIST2')))(nameCreator)).toEqual({ LIST: 'anotherapp/anotherreducer/LIST',
      LIST2: 'anotherapp/anotherreducer/LIST2' })
})
test ('ActionExpand',(done)=>{
  let expected = {"JOB_DELETE": "JOB_DELETE", "JOB_INSERT": "JOB_INSERT"};
  let CDExpand = actionExpand(['INSERT','DELETE']);
  expect( combineActionTypes(...CDExpand('JOB'))()).toEqual(expected);

})



test ('CreateActionTypes',(done)=>{
  let expected = {
    LIST:'LIST'
  }
  let res = combineActionTypes(
    actionType('LIST')
  )
  expect(res()).toEqual(expected)


})


test ('ActionGroup',(done)=>{
  let expected = {worker:  {
         "LIST": "LIST",
         "LISTMORE": "LISTMORE",
       }}
  let group = actionGroup('worker')
  let res = group(actionType('LIST'),actionType('LISTMORE'))();
  expect(res).toEqual(expected)
})

test ('Expand in group',(done)=>{
  let expected = {worker: {
         LIST_INSERT:"LIST_INSERT",
         LIST_DELETE:"LIST_DELETE",
         LIST_UPDATE:"LIST_UPDATE",
       }}
  let workerGroup = actionGroup('worker')
  let res = workerGroup(CRUDExpand('LIST'))();
  expect(res).toEqual(expected)
})



test ('CreateActionTypes',(done)=>{
  let expected = {
    LIST:'LIST'
  }
  let res = combineActionTypes(
    actionType('LIST')
  )
  expect(res()).toEqual(expected)

  res = combineActionTypes(
    'LIST'
  )
  expect(res()).toEqual(expected)

})


test ('CreateActionTypes_expand',(done)=>{
  let expected = {
    LIST:'LIST',
    LIST_DELETE: "LIST_DELETE",
    LIST_INSERT: "LIST_INSERT",
    LIST_UPDATE: "LIST_UPDATE",
  }
  let res = combineActionTypes(
    'LIST',
    CRUDExpand('LIST')
  )
  expect(res()).toEqual(expected)
})

test ('CreateActionTypes_group',(done)=>{
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
  let res = combineActionTypes(
    'LIST',
    CRUDExpand('LIST'),
    actionGroup('LIST2')(CRUDExpand('LIST'))
  )
  expect(res()).toEqual(expected)
})



test ('Naming Actions and ensure that we dont erase actionRename',(done)=>{
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

  let another_reducer_naming = createActionName('app')('subreducer')
  let res = combineActionTypes(
    'LIST',
    CRUDExpand('LIST'),
    actionGroup('LIST2')(actionRename(another_reducer_naming)(CRUDExpand('LIST')))
  )
  expect(res()).toEqual(expected)


  // ensuring that naming is not erased
  let nameCreator = createActionName('myapp')('myreducer');
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
  let type1 = combineActionTypes(
    'ACTION1',
    'ACTION2'
  )

  let type2 = combineActionTypes(
    'ACTION3',
    'ACTION4'
  )

  let combined = combineActionTypes(
    type1,
    type2
  )

  expect(combined()).toEqual(expected)

  let grouped = combineActionTypes(
    actionGroup('type1')(type1),
    actionGroup('type2')(type2),
  )

  expect(grouped()).toEqual({ type1: { ACTION1: 'ACTION1', ACTION2: 'ACTION2' },
      type2: { ACTION3: 'ACTION3', ACTION4: 'ACTION4' } }
)

})
