import {combineActionTypes} from '../src/ActionTypes'

import {ActionTypes: ActionTypesA} from './actionsA'
import {ActionTypes: ActionTypesB} from './actionsB'

export ActionTypes = combineActionTypes(
  ActionsTypesA,
  ActionTypesB
)
