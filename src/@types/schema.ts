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
export type SchemaProperties<P extends Properties = Properties> = {
  [Property in keyof P]: SchemaPropertyTypes | SchemaPropertyObject;
};

// Allowed types to define schema structure
export type SchemaPropertyTypes =
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

export interface Schema<
  L extends string[] = string[],
  P extends Properties = Properties
> {
  labels: L;
  schemaProperties: SchemaProperties<P>;
}

export type SchemaFactory = <
  L extends string[] = string[],
  P extends Properties = Properties
>(
  labels: L,
  schemaProperties: SchemaProperties<P>
) => Schema<L, P>;
