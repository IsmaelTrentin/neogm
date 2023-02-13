import { NodeModelObject, NodeSchema, Properties } from '../@types';

export const node = {
  toString<S extends NodeSchema>(
    node: NodeModelObject<S>,
    varName: string = 'n'
  ) {
    let s = `(${varName}`;
    node.labels.forEach(l => (s += `:${l}`));
    const keys = Object.keys(
      node.properties
    ) as (keyof typeof node.properties)[];
    if (keys.length > 0) {
      s += ' {';
      for (var i = 0; i < keys.length; i++) {
        if (i > 0) s += ',';
        s += `${String(keys[i])}:${JSON.stringify(node.properties[keys[i]])}`;
      }
      s += '}';
    }
    s += ')';
    return s;
  },
  buildNode(
    labels: string[] | readonly string[],
    properties: Properties,
    varName: string = 'n'
  ) {
    const keys = Object.keys(properties).map(k => `${k}: \$${varName}${k}`);
    const props = keys.length === 0 ? '' : ` {${keys.join(',')}}`;
    const nodeStr = `(${varName.trim()}:${labels.join(':')}${props})`;
    return nodeStr;
  },
};
