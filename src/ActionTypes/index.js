
import {_either,flatten,not,is_type_function,curry,identity,flip,map,divergeLeftThen,mergeAll,defaultTo,trace,compose,as_prop,pipe} from "@geekagency/composite-js";

export const createActionName = curry((app, reducer, name)=> `${app}/${reducer}/${name}`);

export const defaultNameCreator = identity;


// String -> (String->String) -> Object
const transformedObjectProperty = curry ( (type,transform,value)=> compose(as_prop(type),transform)(value))

// _actionType :: String -> (String -> String) -> Object
export const _actionType = curry ( (type, transform ) =>transformedObjectProperty(type,transform,type))

/*
set identity as default transform for any action type
*/
// actionType :: String -> (String->String | identity) -> Object
export const actionType  = type => compose(_actionType(type),defaultTo(identity))

export const actionTypeFrom = transformedObjectProperty

export const bindDefaultArgIfString = defaultFn => _either(is_type_function,defaultFn,identity)
/*
Map args and set actionType as default transform for strings
*/
export const combineTypes  = map(bindDefaultArgIfString(x=>actionType(x)))

export const makeCombine = combinator=> (...args )=> divergeLeftThen(mergeAll)(...combinator(args))

export const _combineActionTypes = makeCombine(compose(combineTypes,flatten))

export const groupAs = group => (...args) => {
	return compose(as_prop(group),_combineActionTypes(...args))
}

export const expand = curry ((transform,subTypes,type) =>{
	return subTypes.map(subType=>{
		return actionType(transform(type,subType));
	});
});

export const hold = transform => (...args )=> {
	args = [].concat.apply([], args);

	//preserve signature if arity == 1
	if(args.length == 1)
		return ()=>args[0](transform);

	return args.map(arg => ()=> arg(transform));
}


export const expandSuffix= expand((t,s)=>`${t}_${s}`)
export const expandPrefix= expand((t,s)=>`${s}_${t}`)


// createActionsTypes :: (a,b,c,...z) -> identity -> Object
export const combineActionTypes  = (...args) => (nameCreator) =>{
	args = [].concat.apply([], args);

	return args.reduce((types, type) => {
		if(typeof(type)=== "string")
			type = actionType(type);

		let val = type(nameCreator);
		types = {...types, ...val};
		return types;
	},{});
};

export const flipCombineActionTypes = transform => (...args) => combineActionTypes(...args)(transform)


// actionGoup :: String -> (a,b,c...z) -> (String -> String) -> Object
export const actionGroup = group=> (...args)=> (nameCreator)=>{
	args = [].concat.apply([], args);
	return {[group]:combineActionTypes(...args)(nameCreator)};
};


/*

function that bind a nameCreator on another naming function(s)
*/
export const actionRename =  (nameCreator) => (...args)=>{
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





const combineFunctions = flipCombineActionTypes(identity);

export const makeCombineActionTypes=(transform)=> {


	return combineFunctions(
		actionTypeFrom('combineActionTypes',flipCombineActionTypes(transform)),

	)

}
