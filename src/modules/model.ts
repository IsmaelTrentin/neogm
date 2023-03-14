import { node as nodeUtil } from '../utils/node';
import { session } from './connect';
import {
  GetNodeProperties,
  ModelFactory,
  NodeModelObject,
  NodeSchema,
  PropertiesKeysObject,
  RelationshipDirection,
  SavedNodeModelObject,
} from '../@types';

const node: ModelFactory['node'] = (modelName, schema, unique = true) => {
  const { labels, schemaProperties } = schema;
  type Props = GetNodeProperties<typeof schema>;

  return {
    create: properties => {
      const addedRelationships: {
        direction: RelationshipDirection;
        unique?: boolean;
        node: NodeModelObject<NodeSchema>;
      }[] = [];

      return {
        modelName,
        schema,
        labels,
        properties,
        toString: (varName = 'n') => {
          const [nodeStr] = nodeUtil.buildNode(labels, properties, varName);
          return nodeStr;
        },
        toObject: () => {
          return {
            labels,
            properties,
          };
        },
        save: async (varName: string = 'n') => {
          // create node
          const baseNodeCreateMode = unique ? 'MERGE' : 'CREATE';
          const baseNodeVarName = 'basenode';
          const [baseNodeStr, parameters] = nodeUtil.buildNode(
            labels,
            properties,
            baseNodeVarName
          );
          await session
            .get()
            .run(`${baseNodeCreateMode} ${baseNodeStr}`, parameters);

          // create relationsihps

          const result = await session.get().run<{
            [baseNodeVarName]: SavedNodeModelObject<typeof schema>;
          }>(`MATCH ${baseNodeStr} RETURN basenode`, parameters);

          return result.records[0].get('basenode');
        },
      };
    },
    match: async (filter: Partial<Props> = {}) => {
      const [built, parameters] = nodeUtil.buildNode(labels, filter);

      const result = await session
        .get()
        .run<Props>(`MATCH ${built} RETURN n`, parameters);
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
      const result = await session.get().run(query);

      return result;
    },
  };
};

export const model: ModelFactory = {
  node,
};
