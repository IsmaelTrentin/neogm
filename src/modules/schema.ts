import { NodeAllowedRelationships, SchemaFactory } from '../@types';

import jss from 'json-stable-stringify';
import { relationship } from './relationship';

const nodeSchemaFactory: SchemaFactory['node'] = (labels, schemaProperties) => {
  const allowedRelationships: NodeAllowedRelationships = new Map();

  return {
    schemaType: 'node',
    labels,
    schemaProperties,
    allowedRelationships,
    defineRelationship: relationshipEntry => {
      // assert unique key exists when value is undefined
      relationshipEntry.unique == undefined &&
        (relationshipEntry.unique = false);
      const k = relationship.getHash(relationshipEntry);
      if (allowedRelationships.has(k)) {
        throw new Error(
          `relationship ${k} is already defined.\nentry: ${jss(
            relationshipEntry
          )}`
        );
      }
      allowedRelationships.set(k, relationshipEntry);
    },
  };
};

const relationshipSchemaFactory: SchemaFactory['relationship'] = (
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
  node: nodeSchemaFactory,
  relationship: relationshipSchemaFactory,
};
