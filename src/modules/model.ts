import {
  GetPropertiesTypeFromSchema,
  ModelFactory,
  PropertiesKeysObject,
} from '../@types';

import { node } from './node';
import { session } from './connect';

export const model: ModelFactory = (name, schema, unique = true) => {
  type Props = GetPropertiesTypeFromSchema<typeof schema>;

  const { schemaProperties } = schema;
  // TODO: fix ts(2322) @ ModelFactory <S...
  const labels = schema.labels;

  return {
    create: properties => {
      return {
        labels: labels, //
        properties,
        toString: (varName = 'n') => {
          return node.buildNode(labels, properties, varName);
        },
        _modelName: name,
        toObject: () => {
          return {
            labels, //
            properties,
          };
        },
        save: async (varName: string = 'n') => {
          const built = node.buildNode(labels, properties, varName);
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
      const built = node.buildNode(labels, filter);
      const result = await session
        .get()
        .run<Props>(`MATCH ${built} RETURN n`, filter);
      return result.records.map(r => r.get('n'));
    },
    query: async (builder, varNames = ['n']) => {
      const keys = Object.keys(schemaProperties) as (keyof Props)[]; // or as keyof SchemaProperties ?
      let keysObject = {} as PropertiesKeysObject<Props>;
      for (const k of keys) {
        keysObject[k] = k;
      }
      const query = builder(labels, keysObject);
      const result = await session
        .get()
        .run<GetPropertiesTypeFromSchema<typeof schema>>(query);

      return result.records as any;
    },
  };
};
