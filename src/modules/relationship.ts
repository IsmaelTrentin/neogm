import {
  NodeRelationshipEntry,
  NodeSchema,
  Properties,
  RelationshipDirection,
  RelationshipSchema,
} from '../@types';

import crypto from 'node:crypto';
import jss from 'json-stable-stringify';

export const relationship = {
  getHash(entry: NodeRelationshipEntry<RelationshipSchema, NodeSchema>) {
    const stringified = jss(entry);
    return crypto.createHash('md5').update(stringified).digest('base64');
  },
  buildBaseRelationship(
    type: string,
    direction: RelationshipDirection,
    properties: Properties,
    varName: string = 'n'
  ) {
    const keys = Object.keys(properties).map(k => `${k}: \$${varName}${k}`);
    const props = keys.length === 0 ? '' : ` {${keys.join(',')}}`;
    const arrow = direction === 'in' ? '<' : '>';
    const relStr = `${
      direction === 'in' ? arrow : ''
    }-[${varName.trim()}:${type} ${props}]-${direction === 'out' ? arrow : ''}`;
    return relStr;
  },
};
