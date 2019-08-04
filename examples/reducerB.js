import {ActionTypes} from './actionsB;'

export reducerFactory (actionTypes){
  return (state={},action)=>{
    switch (action.type){
      case actionTypes.ADD:
      case actionTypes.FETCH:
      case actionTypes.UPDATE:
        return state;
    }
    return state;
  }
}


export default reducerFactory(ActionTypes())
