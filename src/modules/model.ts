import { GetPropertiesTypeFromSchema, ModelFactory } from '../@types';

import { node } from './node';
import { session } from './connect';

export const model: ModelFactory = (name, schema, unique = true) => ({
  create: properties => {
    // TODO: fix ts(2322) @ ModelFactory <S...
    return {
      labels: schema.labels as any, //
      properties,
      toString: (varName = 'n') => {
        return node.buildNode(schema.labels, properties, varName);
      },
      _modelName: name,
      toObject: () => {
        return {
          labels: schema.labels as any, //
          properties,
        };
      },
      save: async (varName: string = 'n') => {
        const built = node.buildNode(schema.labels, properties, varName);
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
  all: async () => {
    const built = node.buildNode(schema.labels, {});
    const result = await session
      .get()
      .run<GetPropertiesTypeFromSchema<typeof schema>>(
        `MATCH ${built} RETURN n`
      );
    return result.records.map(r => r.get('n'));
  },
});
