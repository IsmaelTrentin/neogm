import { GetLabelsTypeFromSchema, GetPropertiesTypeFromSchema } from './utils';

import { Node } from 'neo4j-driver';
import { Schema } from '.';

export interface ModelObject<S extends Schema> {
  labels: GetLabelsTypeFromSchema<S>;
  properties: GetPropertiesTypeFromSchema<S>;
}

export interface Model<S extends Schema> extends ModelObject<S> {
  toString(varName?: string): string;
  toObject(): ModelObject<S>;
  save(varName?: string): Promise<ModelObject<S>['properties']>;
}

export type ModelFactory = <S extends Schema>(
  name: string,
  schema: S,
  unique?: boolean
) => {
  create: (properties: GetPropertiesTypeFromSchema<S>) => Model<S>;
  all(): Promise<QueryNodeResult<S>[]>;
};

interface QueryNodeResult<S extends Schema> extends Node {
  labels: GetLabelsTypeFromSchema<S>;
  properties: GetPropertiesTypeFromSchema<S>;
}
