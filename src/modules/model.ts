import {
  GetNodeProperties,
  ModelFactory,
  PropertiesKeysObject,
  RelationshipDirection,
} from '../@types';

import { node as nodeUtil } from './node';
import { relationship as relationshipUtil } from './relationship';
import { session } from './connect';

const node: ModelFactory['node'] = (name, schema, unique = true) => {
  const { labels, schemaProperties } = schema;
  type Props = GetNodeProperties<typeof schema>;

  return {
    create: properties => {
      return {
        name,
        schema,
        labels,
        properties,
        toString: (varName = 'n') => {
          return nodeUtil.buildNode(labels, properties, varName);
        },
        toObject: () => {
          return {
            labels,
            properties,
          };
        },
        addRelationship: (relationship, node, direction, unique = false) => {
          // check source schema compatibility
          const entry = {
            direction,
            unique,
            schema: relationship.schema,
            nodeSchema: node.schema,
          };
          const k = relationshipUtil.getHash(entry);
          const data = schema.allowedRelationships.get(k);

          if (data == undefined) {
            throw new Error(
              `the relationship ${k} is not defined in schema ${name}.\nentry: ${name} ${
                relationship.type
              } ${node.name} ${direction} unique=${unique || false}`
            );
          }

          const n = nodeUtil.buildNode(labels, properties, 'n');
          const r = relationshipUtil.buildBaseRelationship(
            relationship.type,
            direction,
            relationship.properties,
            'r'
          );
          const m = nodeUtil.buildNode(node.labels, node.properties, 'm');

          // TODO: implement actual query building
        },
        save: async (varName: string = 'n') => {
          const built = nodeUtil.buildNode(labels, properties, varName);
          const createMode = unique ? 'MERGE' : 'CREATE';
          const result = await session
            .get()
            .run<typeof properties>(
              `${createMode} ${built} RETURN ${varName}`,
              properties
            );
          return result.records[0].get(varName);
        },
      };
    },
    match: async (filter: Partial<Props> = {}) => {
      const built = nodeUtil.buildNode(labels, filter);
      const result = await session
        .get()
        .run<Props>(`MATCH ${built} RETURN n`, filter);
      // return result.records.map(r => r.get('n'));
      return result;
    },
    query: async (builder, varNames = ['n']) => {
      const keys = Object.keys(schemaProperties) as (keyof Props)[]; // or as keyof SchemaProperties ?
      let keysObject = {} as PropertiesKeysObject<Props>;
      for (const k of keys) {
        keysObject[k] = k;
      }
      const query = builder(labels, keysObject);
      const result = await session.get().run<Props>(query);

      return result;
    },
  };
};

const relationship: ModelFactory['relationship'] = (
  name,
  schema,
  unique = true
) => {
  const { type } = schema;

  return {
    create: properties => {
      return {
        name,
        schema,
        type,
        properties,
        toString: (direction: RelationshipDirection, varName = 'n') => {
          return relationshipUtil.buildBaseRelationship(
            type,
            direction,
            properties,
            varName
          );
        },
        toObject: () => {
          return {
            type,
            properties,
          };
        },
      };
    },
  };
};

export const model: ModelFactory = {
  node,
  relationship,
};
