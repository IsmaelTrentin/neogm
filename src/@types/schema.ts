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

import { Properties } from './utils';

// Used in neogm.schema to define schema structure
// (intellisense on keys but value is of accepted neo4j types)
type SchemaProperties<P extends Properties = Properties> = {
  [Property in keyof P]: SchemaPropertyTypes | SchemaPropertyObject;
};

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

// In depth definition of schema structure
interface SchemaPropertyObject {
  type: SchemaPropertyTypes;
  mandatory?: boolean;
  unique?: boolean;
  default?: InstanceType<SchemaPropertyObject['type']>;
}

type SchemaLabels<IsR> = IsR extends true
  ? readonly [string]
  : readonly string[];

export interface Schema<
  IsR extends boolean,
  L extends SchemaLabels<IsR>,
  P extends Properties
> {
  isRelationship: IsR;
  labels: L;
  schemaProperties: SchemaProperties<P>;
}

export type SchemaFactory = <
  IsR extends boolean = false,
  L extends SchemaLabels<IsR> = SchemaLabels<IsR>,
  P extends Properties = Properties
>(
  isRelationship: IsR,
  labels: L,
  schemaProperties: SchemaProperties<P>
) => Schema<IsR, L, P>;

export interface NodeSchema<
  L extends SchemaLabels<false> = SchemaLabels<false>,
  P extends Properties = Properties
> extends Schema<false, L, P> {}
export interface RelationshipSchema<
  L extends SchemaLabels<true> = SchemaLabels<true>,
  P extends Properties = Properties
> extends Schema<true, L, P> {}

export type Schemas = NodeSchema | RelationshipSchema;
