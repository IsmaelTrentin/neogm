import type {
  GetNodeProperties,
  GetRelationshipProperties,
  Properties,
  RelationshipDirection,
} from './utils';
import type { NodeSchema, RelationshipSchema } from '.';

import type { QueryResult } from 'neo4j-driver';

export interface NodeModelObject<S extends NodeSchema> {
  labels: S['labels'];
  properties: GetNodeProperties<S>;
}

export interface RelationshipModelObject<S extends RelationshipSchema> {
  type: S['type'];
  properties: GetRelationshipProperties<S>;
}

export interface NodeModel<S extends NodeSchema = NodeSchema>
  extends NodeModelObject<S> {
  name: string;
  schema: S;
  toString(varName?: string): string;
  toObject(): NodeModelObject<S>;
  // fix: typesafe based on types of NodeSchema['allowedRelationships]
  addRelationship<
    R extends NonNullable<
      ReturnType<S['allowedRelationships']['get']>
    >['schema'],
    N extends NonNullable<
      ReturnType<S['allowedRelationships']['get']>
    >['nodeSchema']
  >(
    relationship: RelationshipModel<R>,
    node: NodeModel<N>,
    direction: RelationshipDirection,
    unique?: boolean
  ): void;
  save(varName?: string): Promise<NodeModelObject<S>['properties']>;
}

export interface RelationshipModel<
  S extends RelationshipSchema = RelationshipSchema
> extends RelationshipModelObject<S> {
  name: string;
  schema: S;
  toString(direction: RelationshipDirection, varName?: string): string;
  toObject(): RelationshipModelObject<S>;
  // save(varName?: string): Promise<RelationshipModelObject<S>['properties']>;
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
    ): Promise<QueryResult<NodeModel<S>['properties']>>;
  };
  relationship<S extends RelationshipSchema>(
    name: string,
    schema: S,
    unique?: boolean
  ): {
    create(properties: GetRelationshipProperties<S>): RelationshipModel<S>;
  };
};
