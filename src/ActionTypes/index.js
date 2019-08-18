
import {curry,identity} from "@geekagency/composite-js";

export const createActionName = curry((app, reducer, name)=> `${app}/${reducer}/${name}`);

export const defaultNameCreator = identity;


// createActionsTypes :: (a,b,c,...z) -> identity -> Object
export const combineActionTypes  = (...args) => (nameCreator=defaultNameCreator) =>{
	args = [].concat.apply([], args);

	return args.reduce((types, type) => {
		if(typeof(type)=== "string")
			type = actionType(type);

		let val = type(nameCreator);
		types = {...types, ...val};
		return types;
	},{});

};

// actionGoup :: String -> (a,b,c...z) -> (String -> String) -> Object
export const actionGroup = group=> (...args)=> (nameCreator = defaultNameCreator)=>{
	args = [].concat.apply([], args);
	return {[group]:combineActionTypes(...args)(nameCreator)};
};


/*

function that bind a nameCreator on another naming function(s)
*/
export const actionRename =  (nameCreator = defaultNameCreator) => (...args)=>{
	args = [].concat.apply([], args);

	//preserve signature if arity == 1
	if(args.length == 1)
		return ()=>args[0](nameCreator);

	return args.map(arg => ()=> arg(nameCreator));
};

export const lockName = actionRename


// expandType :: Array -> String -> Array
/*
for a given ActionTypes, generate X new ActionTypes by merging subtypes
*/
export const actionExpand = curry ((subTypes,type) =>{
	return subTypes.map(subType=>{
		return actionType(`${type}_${subType}`);
	});

});


// actionType :: String -> (String -> String) -> Object
export const actionType = type => (nameCreator=defaultNameCreator) =>{
	return {[type]:nameCreator(type)};
};
