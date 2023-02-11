import {
  GetNodeProperties,
  GetRelationshipProperties,
  ModelFactory,
  PropertiesKeysObject,
} from '../@types';

import { node as nodeUtil } from './node';
import { relationship as relationshipUtil } from './relationship';
import { session } from './connect';

const node: ModelFactory['node'] = (name, schema, unique = true) => {
  const { labels, schemaProperties, allowedRelationships } = schema;
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
        addRelationship: config => {
          const { relationship, node } = config;
          const n = nodeUtil.buildNode(labels, properties, 'n');
          const r = relationshipUtil.buildBaseRelationship(
            relationship.type,
            relationship.direction,
            relationship.properties,
            'r'
          );
          const m = nodeUtil.buildNode(node.labels, node.properties, 'm');
          console.log(`MATCH ${n}, ${m}\nCREATE (n)${r}(m)`);

          // // check if relationship is defined in source and target schema
          // const sourceAllowedKeys = Object.keys(allowedRelationships);
          // const nodeAllowedKeys = Object.keys(node.allowedRelationships);
          // const errorOwner = !sourceAllowedKeys.includes(
          //   relationship.schema.type
          // )
          //   ? 'source'
          //   : !nodeAllowedKeys.includes(relationship.schema.type)
          //   ? 'node'
          //   : undefined;
          // if (errorOwner) {
          //   const errorMsg = `relationship of type "${relationship.schema.type}" is not in $owner allowed relationships.\nSource allowed: [$sAllowed]\nTarget allowed: [$nAllowed]`;
          //   throw new Error(
          //     errorMsg
          //       .replace('$owner', errorOwner)
          //       .replace('$sAllowed', sourceAllowedKeys.join(', '))
          //       .replace('$nAllowed', nodeAllowedKeys.join(', '))
          //   );
          // }

          // // check if direction is correct as defined in schema
          // const sourceDirection =
          //   allowedRelationships[relationship.schema.type].direction;
          // const nodeDirection =
          //   node.allowedRelationships[relationship.schema.type].direction;
          // const isSourceError = sourceDirection && sourceDirection != direction;
          // const isNodeError = nodeDirection && nodeDirection == direction;
          // if (isSourceError || isNodeError) {
          //   const errorMsg = `wrong direction for relationship ${relationship.schema.type}.\nSource: ${sourceDirection}\nNode: ${nodeDirection}\nGiven: ${direction}`;
          //   throw new Error(errorMsg);
          // }

          console.log(config);
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
