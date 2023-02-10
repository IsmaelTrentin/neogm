import { Properties } from '../@types';

export const relationship = {
  buildBaseRelationship(
    type: string,
    direction: 'in' | 'out',
    properties: Properties,
    varName: string = 'n'
  ) {
    const keys = Object.keys(properties).map(k => `${k}: \$${k}`);
    const props = keys.length === 0 ? '' : ` {${keys.join(',')}}`;
    const arrow = direction === 'in' ? '<' : '>';
    const relStr = `${
      direction === 'in' ? arrow : ''
    }-[${varName.trim()}:${type} ${props}]-${direction === 'out' ? arrow : ''}`;
    return relStr;
  },
};
