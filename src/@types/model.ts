import type {
  GetNodeProperties,
  GetRelationshipProperties,
  Properties,
  RelationshipDirection,
} from './utils';
import type { NodeSchema, RelationshipSchema } from '.';

import type { QueryResult } from 'neo4j-driver';

interface NodeModelObject<S extends NodeSchema> {
  labels: S['labels'];
  properties: GetNodeProperties<S>;
}

interface RelationshipModelObject<S extends RelationshipSchema> {
  type: S['type'];
  properties: GetRelationshipProperties<S>;
}

interface NodeModel<S extends NodeSchema = NodeSchema>
  extends NodeModelObject<S> {
  toString(varName?: string): string;
  toObject(): NodeModelObject<S>;
  // fix: typesafe based on types of NodeSchema['allowedRelationships]
  addRelationship(config: {
    relationship: RelationshipModelObject<
      S['allowedRelationships']['*']['schema']
    > & {
      direction: RelationshipDirection;
    };
    node: NodeModelObject<S['allowedRelationships']['*']['nodeSchema']>;
    unique?: boolean;
  }): void;
  save(varName?: string): Promise<NodeModelObject<S>['properties']>;
}

// (n)*-[r:TYPE {props: ''}]-*(m:LABELS {props: ''})

// MATCH (n), (m:LABELS {props: ''})
// CREATE (n)*-[:TYPE {props: ''}]-*(m)

interface RelationshipModel<S extends RelationshipSchema = RelationshipSchema>
  extends RelationshipModelObject<S> {
  toString(varName?: string): string;
  toObject(): RelationshipModelObject<S>;
  save(varName?: string): Promise<RelationshipModelObject<S>['properties']>;
}

export type PropertiesKeysObject<P extends Properties = Properties> = {
  [Property in keyof P]: keyof P;
};

export type ModelFactory = {
  node: NodeModelFactory;
  relationship: RelationshipModelFactory;
};

type AAA<S extends NodeSchema> = {
  type: keyof S['schemaProperties']['allowedRelationships'];
  direction: RelationshipDirection;
  target: NodeSchema;
  targetProps?: GetNodeProperties<AAA<S>['target']>;
  unique?: boolean;
};

type NodeModelFactory = <S extends NodeSchema>(
  name: string,
  schema: S,
  unique?: boolean
) => {
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

type RelationshipModelFactory = <S extends RelationshipSchema>(
  name: string,
  schema: S,
  unique?: boolean
) => {};
