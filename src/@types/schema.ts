import {
  Date,
  DateTime,
  Duration,
  Integer,
  LocalDateTime,
  LocalTime,
  Point,
  Time,
} from 'neo4j-driver';
import { Properties, RelationshipDirection } from './utils';

export type NodeRelationshipEntry<
  R extends RelationshipSchema,
  N extends NodeSchema
> = {
  schema: R;
  direction: RelationshipDirection;
  nodeSchema: N;
  unique?: boolean;
};

export type NodeAllowedRelationships = Map<
  string,
  NodeRelationshipEntry<RelationshipSchema, NodeSchema>
>;

export interface NodeSchema<
  L extends readonly string[] = readonly string[],
  P extends Properties = Properties
> {
  schemaType: 'node';
  schemaProperties: SchemaProperties<P>;
  labels: L;
  allowedRelationships: NodeAllowedRelationships;
  defineRelationship<R extends RelationshipSchema, N extends NodeSchema>(
    relationshipEntry: NodeRelationshipEntry<R, N>
  ): void;
}

export interface RelationshipSchema<
  T extends string = string,
  P extends Properties = Properties
> {
  schemaType: 'relationship';
  schemaProperties: SchemaProperties<P>;
  type: T;
}

// Used in neogm.schema to define schema structure
// (intellisense on keys but value is of accepted neo4j types)
type SchemaProperties<P extends Properties = Properties> = {
  [Property in keyof P]: SchemaPropertyObject | SchemaPropertyTypes;
};

// In depth definition of schema structure
interface SchemaPropertyObject {
  type: SchemaPropertyTypes;
  mandatory?: boolean;
  unique?: boolean;
  default?: InstanceType<SchemaPropertyObject['type']>;
}

// Allowed types to define schema structure
type SchemaPropertyTypes =
  | typeof Integer
  | typeof Number
  | typeof String
  | typeof Boolean
  | typeof Point
  | typeof Date
  | typeof Time
  | typeof LocalTime
  | typeof DateTime
  | typeof LocalDateTime
  | typeof Duration;

export type SchemaFactory = {
  node<L extends NodeSchema['labels'], P extends Properties>(
    labels: L,
    schemaProperties: SchemaProperties<P>
  ): NodeSchema<L, P>;
  relationship<T extends RelationshipSchema['type'], P extends Properties>(
    type: T,
    schemaProperties: SchemaProperties<P>
  ): RelationshipSchema<T, P>;
};
