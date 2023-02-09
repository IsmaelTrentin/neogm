import {
  GetLabelsTypeFromSchema,
  GetPropertiesTypeFromSchema,
  Properties,
} from './utils';
import { RelationshipSchema, Schemas } from '.';

import { Node } from 'neo4j-driver';
import { QueryNodeResult } from './node';

export interface ModelObject<S extends Schemas> {
  labels: GetLabelsTypeFromSchema<S>;
  properties: GetPropertiesTypeFromSchema<S>;
}

export interface Model<S extends Schemas> extends ModelObject<S> {
  toString(varName?: string): string;
  toObject(): ModelObject<S>;
  save(varName?: string): Promise<ModelObject<S>['properties']>;
}

export type PropertiesKeysObject<P extends Properties = Properties> = {
  [Property in keyof P]: keyof P;
};

type CreateFunction<S extends Schemas> = (
  properties: GetPropertiesTypeFromSchema<S>
) => Model<S>;
type MatchFunction<S extends Schemas> = (
  filter?: Partial<GetPropertiesTypeFromSchema<S>>
) => Promise<QueryNodeResult<S>[]>;
type QueryBuilderFunction<S extends Schemas> = (
  labels: GetLabelsTypeFromSchema<S>,
  keys: PropertiesKeysObject<GetPropertiesTypeFromSchema<S>>
) => string;
type QueryFunction<S extends Schemas> = (
  builder: QueryBuilderFunction<S>,
  varNames?: string[]
) => Promise<QueryNodeResult<S>[]>;

export type ModelFactory = <S extends Schemas>(
  name: string,
  schema: S,
  unique?: boolean
) => {
  create: CreateFunction<S>;
  match: MatchFunction<S>;
  query: QueryFunction<S>;
};
