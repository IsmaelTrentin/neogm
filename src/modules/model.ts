import {
  GetNodeProperties,
  ModelFactory,
  NodeModel,
  NodeModelObject,
  NodeSchema,
  Properties,
  PropertiesKeysObject,
  RelationshipDirection,
  RelationshipModel,
  SavedNodeModelObject,
} from '../@types';

import { node as nodeUtil } from './node';
import { relationship as relationshipUtil } from './relationship';
import { session } from './connect';

const node: ModelFactory['node'] = (modelName, schema, unique = true) => {
  const { labels, schemaProperties } = schema;
  type Props = GetNodeProperties<typeof schema>;

  return {
    create: properties => {
      const addedRelationships: {
        direction: RelationshipDirection;
        unique?: boolean;
        relationship: RelationshipModel;
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
        addRelationship: config => {
          const {
            relationship,
            nodeSchema,
            node,
            direction,
            unique = false,
          } = config;

          // check source schema compatibility
          const entry = {
            direction,
            unique,
            nodeSchema,
            schema: relationship.schema,
          };
          const k = relationshipUtil.getHash(entry);
          const data = schema.allowedRelationships.get(k);

          if (data == undefined) {
            throw new Error(
              `the relationship ${k} is not defined in schema ${modelName}.\nentry: ${modelName} ${
                relationship.type
              } :${node.labels.join(':')} ${direction} unique=${
                unique || false
              }`
            );
          }

          addedRelationships.push({
            direction,
            unique,
            relationship,
            node,
          });

          // const n = nodeUtil.buildNode(labels, properties, 'n');
          // const r = relationshipUtil.buildBaseRelationship(
          //   relationship.type,
          //   direction,
          //   relationship.properties,
          //   'r'
          // );
          // const m = nodeUtil.buildNode(node.labels, node.properties, 'm');
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
          let i = 0;
          for (const entry of addedRelationships) {
            const { relationship, node, direction, unique } = entry;
            const createMode = unique ? 'MERGE' : 'CREATE';

            const nodeVarName = `n${i}`;
            const [nodeStr, nodeParameters] = nodeUtil.buildNode(
              node.labels,
              node.properties,
              nodeVarName
            );

            const relationshipVarName = `r${i}`;
            const [relationshipStr, relationshipParameters] =
              relationshipUtil.buildBaseRelationship(
                relationship.type,
                direction,
                relationship.properties,
                relationshipVarName
              );

            let query = `MATCH ${baseNodeStr}, ${nodeStr}\n`;
            query += `${createMode} (${baseNodeVarName})${relationshipStr}(${nodeVarName})`;

            await session.get().run(query, {
              ...parameters,
              ...relationshipParameters,
              ...nodeParameters,
            });

            i++;
          }

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
          const [relStr] = relationshipUtil.buildBaseRelationship(
            type,
            direction,
            properties,
            varName
          );
          return relStr;
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
