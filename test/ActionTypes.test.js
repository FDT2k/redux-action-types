import '@babel/polyfill'
import {createActionName,actionRename,actionType,applyActionNames,actionExpand,actionGroup,createActionTypes} from '../src/ActionTypes';



const CRUDExpand =  actionExpand(['INSERT','DELETE','UPDATE']);
let nameCreator = createActionName('myapp')('myreducer')

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
})
test ('ActionExpand',(done)=>{
  let expected = {"JOB_DELETE": "JOB_DELETE", "JOB_INSERT": "JOB_INSERT"};
  let CDExpand = actionExpand(['INSERT','DELETE']);
  expect( createActionTypes(...CDExpand('JOB'))()).toEqual(expected);

})



test ('CreateActionTypes',(done)=>{
  let expected = {
    LIST:'LIST'
  }
  let res = createActionTypes(
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
  let res = createActionTypes(
    actionType('LIST')
  )
  expect(res()).toEqual(expected)

  res = createActionTypes(
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
  let res = createActionTypes(
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
  let res = createActionTypes(
    'LIST',
    CRUDExpand('LIST'),
    actionGroup('LIST2')(CRUDExpand('LIST'))
  )
  expect(res()).toEqual(expected)
})



test ('Naming Actions',(done)=>{
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
  console.log('expand ',CRUDExpand('LIST'))
  console.log('rename ',actionRename(another_reducer_naming)(CRUDExpand('LIST')))
  let res = createActionTypes(
    'LIST',
    CRUDExpand('LIST'),
    actionGroup('LIST2')(actionRename(another_reducer_naming)(CRUDExpand('LIST')))
  )
  expect(res()).toEqual(expected)

  let nameCreator = createActionName('myapp')('myreducer');

  let final =res(nameCreator);
  console.log(final)
})
