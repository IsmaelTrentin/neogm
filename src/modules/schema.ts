import { SchemaFactory } from '../@types';

export const schema: SchemaFactory = (
  isRelationship,
  labels,
  schemaProperties
) => {
  // handle indexes and constraints
  return {
    isRelationship,
    labels,
    schemaProperties,
  };
};
