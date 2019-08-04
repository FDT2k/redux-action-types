import {combineReducers} from 'redux'
import {combineActionTypes} from '../src/ActionTypes';

import reducerFactoryA from './reducerA'
import reducerFactoryB from './reducerB'
import {ActionTypes} from './superActions'


export reducerFactory(actionTypes){
  const reducer =  (state,action)=>{


  }

  return combineReducers({
    reducerA: reducerFactoryA(actionTypes),
    reducerB: reducerFactoryB(actionTypes)
  });
}


export default reducerFactory(ActionTypes())
