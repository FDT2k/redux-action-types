import {curry,identity,as_prop,flip} from "@geekagency/composite-js";

export const createActionName = curry((app, reducer, name)=> `${app}/${reducer}/${name}`);

export const defaultNameCreator = identity;


// createActionsTypes :: (a,b,c,...z) -> (x -> x) -> Object
export const combineActionTypes  = (...args) => transform =>{
	args = [].concat.apply([], args);

	return args.reduce((types, type) => {
		if(typeof(type)=== "string")
			type = actionType(type);

		let val = type(transform);
		types = {...types, ...val};
		return types;
	},{});

};

// actionGoup :: String -> (a,b,c...z) -> (x->x) -> Object
export const actionGroup = group=> (...args)=> (transform)=>{
	args = [].concat.apply([], args);
	return {[group]:combineActionTypes(...args)(transform)};
};


/*

function that bind a transform on another naming function(s)
*/
// actionRename :: (x->x) -> (a,b...,z) -> [y]
export const actionRename =  (transform) => (...args)=>{
	args = [].concat.apply([], args);

	//preserve signature if arity == 1
	if(args.length == 1)
		return ()=>args[0](transform);

	return args.map(arg => ()=> arg(transform));
};

export const lockName = actionRename


/*
for a given ActionTypes, generate X new ActionTypes by merging subtypes
*/
// expand :: [x] -> y -> [z]
export const actionExpand = curry ((subTypes,type) =>{
	return subTypes.map(subType=>{
		return actionType(`${type}_${subType}`);
	});

});

/*
return an ActionType as {key:val}
*/
// actionType :: String -> (String -> String) -> Object
export const actionType = type => transform =>{
	console.log('actionType',type, transform)
	return {[type]:transform(type)};
};

export const actionTypeFrom = type => val => transform =>{
	return as_prop(type,transform(val));
}

const enhanceWithTransformer =  _transform => fn=> flip(fn)(_transform)

const combineFunctions = enhanceWithTransformer(identity)(combineActionTypes)

export const makeCombineActionTypes=(transform)=>{

	const enhance = enhanceWithTransformer(transform)

	return combineFunctions(
		actionTypeFrom('combineActionTypes')(enhance(combineActionTypes)),
		actionTypeFrom('actionGroup')(enhance(actionGroup)),
		actionTypeFrom('actionRename')(enhance(actionRename)),
		actionTypeFrom('actionExpand')(actionExpand),
		actionTypeFrom('actionType')(enhance(actionType)),

	)

}
