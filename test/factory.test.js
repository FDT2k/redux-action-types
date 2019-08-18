import '@babel/polyfill'
import {createActionName,makeCombineActionTypes,actionRename,actionType,applyActionNames,actionExpand,actionGroup,combineActionTypes} from '../src/ActionTypes';

test ('makeActionTypes',(done)=>{
  let nameCreator = name => `hihi_${name}`
  let newCombine = makeCombineActionTypes(nameCreator);

  let res= newCombine();
  console.log(res)
  /*let x = res.actionType('COUCOU')
  console.log(res,x)*/
})
