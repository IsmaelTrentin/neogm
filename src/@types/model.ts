import type { GetNodeProperties, Properties } from './utils';
import type { Integer, QueryResult } from 'neo4j-driver';

import type { NodeSchema } from '.';

export interface NodeModelObject<S extends NodeSchema> {
  labels: S['labels'];
  properties: GetNodeProperties<S>;
}

export interface SavedNodeModelObject<S extends NodeSchema>
  extends NodeModelObject<S> {
  identity: Integer;
  elementId: string;
}

export interface NodeModel<S extends NodeSchema = NodeSchema>
  extends NodeModelObject<S> {
  modelName: string;
  schema: S;
  toString(varName?: string): string;
  toObject(): NodeModelObject<S>;
  save(varName?: string): Promise<SavedNodeModelObject<S>>;
}

export type PropertiesKeysObject<P extends Properties = Properties> = {
  [Property in keyof P]: keyof P;
};

export type ModelFactory = {
  node<S extends NodeSchema>(
    name: string,
    schema: S,
    unique?: boolean
  ): {
    create(properties: GetNodeProperties<S>): NodeModel<S>;
    match(
      filter?: Partial<GetNodeProperties<S>>
    ): Promise<QueryResult<NodeModel<S>['properties']>>;
    query(
      builder: (
        labels: S['labels'],
        keys: PropertiesKeysObject<NodeModel<S>['properties']>
      ) => string,
      varNames?: string[]
    ): Promise<QueryResult<any>>;
  };
};
