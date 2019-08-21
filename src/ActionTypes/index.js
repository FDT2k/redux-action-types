
//import {_either,flatten,not,is_type_function,curry,identity,flip,map,divergeLeftThen,mergeAll,defaultTo,trace,compose,as_prop,pipe} from "@geekagency/composite-js";
import * as c from "@geekagency/composite-js";

import * as z from "../Combinator/index"

export const makeNamespaceEnhancer = c.curry((app, reducer, name)=> `${app}/${reducer}/${name}`);

export const actionType = key => enhance => z.asScalarPropWithDefaultValue(key)(key)(enhance);
export const actionTypeValue = key => value => enhance => z.asScalarPropWithDefaultValue(key)(value)(enhance);

export const combineActionTypes = z.combineObject

export const groupAs = group => (...args) => {
	return c.compose(c.as_prop(group),combineActionTypes(...args))
}

// Transformer -> Array -> String -> [String]
export const expand = c.curry ((transform,subTypes,type) =>{
	return subTypes.map(subType=>{
		return actionType(transform(type,subType));
	});
});

export const hold = enhancer => (...args )=> {
	return ()=>combineActionTypes(...args)(enhancer);
}

export const expandSuffix= expand((t,s)=>`${t}_${s}`)
export const expandPrefix= expand((t,s)=>`${s}_${t}`)
