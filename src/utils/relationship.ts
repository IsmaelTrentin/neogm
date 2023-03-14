import { MappedParameters, Properties, RelationshipDirection } from '../@types';

export const relationship = {
  buildBaseRelationship(
    type: string,
    direction: RelationshipDirection,
    properties: Properties,
    varName: string = 'n'
  ) {
    const propsKeys = Object.keys(properties);
    const parameterKeys = propsKeys.map(k => `${varName}${k}`);
    const parametersObj: MappedParameters<Properties, typeof varName> = {};
    parameterKeys.forEach(
      (pk, i) => (parametersObj[pk] = properties[propsKeys[i]])
    );
    const keys = propsKeys.map(k => `${k}: \$${varName}${k}`);
    const props = keys.length === 0 ? '' : ` {${keys.join(',')}}`;
    const arrow = direction === 'in' ? '<' : '>';
    const relStr = `${
      direction === 'in' ? arrow : ''
    }-[${varName.trim()}:${type} ${props}]-${direction === 'out' ? arrow : ''}`;

    return [relStr, parametersObj] as const;
  },
};
