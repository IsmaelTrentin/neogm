import { SchemaFactory } from '../@types';

const node: SchemaFactory['node'] = (
  labels,
  schemaProperties,
  allowedRelationships = {}
) => {
  return {
    schemaType: 'node',
    labels,
    schemaProperties,
    allowedRelationships,
    defineRelationship: relationship => {
      allowedRelationships[relationship.schema.type] = relationship;
      return node(labels, schemaProperties, allowedRelationships);
    },
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
