import { Properties } from './utils';
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

export interface NodeSchema<
  L extends readonly string[] = readonly string[],
  P extends Properties = Properties
> {
  schemaType: 'node';
  schemaProperties: SchemaProperties<P>;
  labels: L;
}

// Used in neogm.schema to define schema structure
// (intellisense on keys but value is of accepted neo4j types)
type SchemaProperties<P extends Properties = Properties> = {
  [Property in keyof P]:
    | SchemaPropertyObject<PrimitiveToConstructorType<P[Property]>>
    | PrimitiveToConstructorType<P[Property]>;
};

type PrimitiveToConstructorType<T> = T extends string
  ? typeof String
  : T extends number
  ? typeof Integer | typeof Number
  : T extends boolean
  ? typeof Boolean
  : T extends Point
  ? typeof Point
  : T extends Date
  ? typeof Date
  : T extends Time
  ? typeof Time
  : T extends LocalTime
  ? typeof LocalTime
  : T extends DateTime
  ? typeof DateTime
  : T extends LocalDateTime
  ? typeof DateTime
  : T extends Duration
  ? typeof Duration
  : MapErrorMsg;

type MapErrorMsg = 'Could not map primitive to constructor type';

// In depth definition of schema structure
interface SchemaPropertyObject<T extends SchemaPropertyTypes | MapErrorMsg> {
  type: T extends SchemaPropertyTypes ? T : never;
  mandatory?: boolean;
  unique?: boolean;
  default?: T extends SchemaPropertyTypes ? InstanceType<T> : never;
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
};
