import {ActionTypes} from './actionsA;'

export reducerFactory (actionTypes){
  return (state={},action)=>{
    switch (action.type){
      case actionTypes.FILTER:
      case actionTypes.WHATEVER:
        return state;
    }
    return state;
  }
}


export default reducerFactory(ActionTypes())
