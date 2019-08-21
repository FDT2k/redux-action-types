import * as c from "@geekagency/composite-js";
import * as z from "../Combinator/index"

export const makeNamespaceEnhancer = c.curry((app, reducer, name)=> `${app}/${reducer}/${name}`);

export const actionType = key => enhance => z.asScalarPropWithDefaultValue(key)(key)(enhance);
export const actionTypeValue = key => value => enhance => z.asScalarPropWithDefaultValue(key)(value)(enhance);

export const combineActionTypes = z.combineObject

export const groupAs = z.makeCombineGroup(combineActionTypes)

export const expandActionType = z.makeExpander(actionType)
// Transformer -> Array -> String -> [String]
export const expand = expandActionType

export const hold = z.makeFreezeEnhancer(combineActionTypes)

export const expandSuffix= expand((t,s)=>`${t}_${s}`)
export const expandPrefix= expand((t,s)=>`${s}_${t}`)
