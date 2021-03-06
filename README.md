# redux-action-types

*This Readme is a Work in progress.
Have a look at the examples folder to see a basic "how it works"*

This is a modest contribution to propose a composable way to deal with action-types. This is a first step to deal with modular Reducers and ActionCreators



## Install

    yarn add @geekagency/redux-action-types


## Usage
combineActionTypes returns a function, that accepts an Enhancer function as parameter

    combineActionTypes :: (...args) => (Enhancer)=> Object

That let's you define your ActionTypes somewhere, and reuse them in the reducer or action creator context

For example, in your action definition

    export ActionTypes = combineActionTypes (
    'LIST_TODO',
    'ADD_TODO',
    'FETCH_TODO',
    'WHATEVER_TODO'
    );


somewhere else


    let actionsTypes = ActionTypes(name=> `myreducer-${name}`);

	actions = {
		LIST_TODO: 'myreducer-LIST_TODO'
	}


You can compose your actions like this

	import {combineActionTypes,groupAs,hold} from '@geekagency/redux-action-types'
    import {actions: jobActionTypes } from './actions/jobs'
    import {actions: commentsActionTypes } from './actions/comments'

	const renameComments = hold(x=> x+'_hey_its_not_the_same')

	export const ActionTypes = combineActionTypes(
		groupAs('jobs')(jobActionTypes)
		groupAs('comments')(commentsActionTypes),
		groupAs('another_comment_reducer')(renameComments(commentsActionTypes))
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

WIP
