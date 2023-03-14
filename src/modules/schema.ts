import jss from 'json-stable-stringify';
import { relationship } from '../utils/relationship';
import { SchemaFactory } from '../@types';

const nodeSchemaFactory: SchemaFactory['node'] = (labels, schemaProperties) => {
  return {
    schemaType: 'node',
    labels,
    schemaProperties,
  };
};

export const schema: SchemaFactory = {
  node: nodeSchemaFactory,
};
