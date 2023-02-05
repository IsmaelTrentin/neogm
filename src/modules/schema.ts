import { SchemaFactory } from '../@types';

export const schema: SchemaFactory = (labels, schemaProperties) => {
  // handle indexes and constraints
  return {
    labels,
    schemaProperties,
  };
};
