
# redux-action-types

This Readme is a Work in progress.
Have a look at the examples folder to see an example

This is a modest contribution to propose a composable way to deal with action-types. This is a first step to deal with modular Reducers and ActionCreators



## Install

    yarn add @geekagency/redux-action-types


## Usage
combineActionTypes returns a function, that accepts a function as parameter to apply action names.

That let's you define your ActionTypes somewhere, and reuse them in the reducer or action creator context

in your action definition

    export ActionTypes = combineActionTypes (
    'LIST_TODO',
    'ADD_TODO',
    'FETCH_TODO',
    'WHATEVER_TODO');


somewhere else


    let actions = ActionTypes(name=> `myreducer-${name}`);

	actions = {
		LIST_TODO: 'myreducer-LIST_TODO'
	}


You can compose your actions like this

	import {combineActionTypes,actionGroup} from '@geekagency/redux-action-types'
    import {actions: jobActionTypes } from './actions/jobs'
    import {actions: commentsActionTypes } from './actions/comments'

	let nameForNewCommentReducer = name => name.reverse() //whatever
	export const ActionTypes = combineActionTypes(
		actionGroup('jobs')(jobActionTypes)
		actionGroup('comments')(commentsActionTypes),
		actionGroup('another_comment_reducer')(actionRename(nameForNewCommentReducer)(commentsActionTypes))
	)

would result in


    {
      jobs: {
  	    JOB_A: 'JOB_A',
  	    JOB_B: 'JOB_B'
  		}
    	comments:{
    		ADD_COMMENT: 'ADD_COMMENT',
    		...etc...
    	}
  }


Lots of parenthesis yeah ?

Let's refactor some bits

    import {combineActionTypes,actionGroup} from '@geekagency/redux-action-types'
    import {actions: jobActionTypes } from './actions/jobs'
    import {actions: commentsActionTypes } from './actions/comments'

	let renameReducer = name => name.reverse()
	let jobGroup = actionGroup('job');
	let comments = actionGroup('comments');
	let other_comments_group = actionGroup('another_super_group');
	let rename_comments_types = actionRename(nameForNewCommentReducer)
	let other_comments = other_comments_group(rename_comments_types)
	export const ActionTypes = combineActionTypes(
		jobGroup(jobActionTypes)
		comments(commentsActionTypes),
		other_comments(commentsActionTypes),
		actionType('HELLO_WORLD')
	)

## API

  * combineActionTypes
  * createActionName
  * defaultNameCreator
  * actionGroup
  * actionRename
  * lockName
  * actionExpand
  * actionType
  * factory




Happy ActionTypes composing
