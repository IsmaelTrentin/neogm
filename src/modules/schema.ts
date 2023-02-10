import { SchemaFactory } from '../@types';

const node: SchemaFactory['node'] = (labels, schemaProperties) => {
  return {
    schemaType: 'node',
    labels,
    schemaProperties,
  };
};

const relationship: SchemaFactory['relationship'] = (
  type,
  schemaProperties
) => {
  return {
    schemaType: 'relationship',
    type,
    schemaProperties,
  };
};

export const schema: SchemaFactory = {
  node,
  relationship,
};
