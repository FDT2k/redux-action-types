import {combineActionTypes} from '../src/ActionTypes'


export ActionTypes = combineActionTypes(
  'FILTER',
  'WHATEVER'
)


export ActionFactory = (actionTypes)=>{
  return {
    actionA: ()=>{
      return {type:actionTypes.FILTER}
    }
  }

}
