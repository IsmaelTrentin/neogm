import {
  GetNodeProperties,
  GetRelationshipProperties,
  ModelFactory,
  PropertiesKeysObject,
} from '../@types';

import { node as nodeUtil } from './node';
import { session } from './connect';

const node: ModelFactory['node'] = (name, schema, unique = true) => {
  const { labels, schemaProperties } = schema;
  type Props = GetNodeProperties<typeof schema>;

  return {
    create: properties => {
      return {
        labels,
        properties,
        toString: (varName = 'n') => {
          return nodeUtil.buildNode(labels, properties, varName);
        },
        _modelName: name,
        toObject: () => {
          return {
            labels,
            properties,
          };
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
  const { type, schemaProperties } = schema;
  type Props = GetRelationshipProperties<typeof schema>;

  return {};
};

export const model: ModelFactory = {
  node,
  relationship,
};
