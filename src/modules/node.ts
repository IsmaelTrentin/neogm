import { Properties } from '../@types';

export const node = {
  buildNode(labels: string[], properties: Properties, varName: string = 'n') {
    const keys = Object.keys(properties).map(k => `${k}: \$${k}`);
    const props = keys.length === 0 ? '' : ` {${keys.join(',')}}`;
    return `(${varName.trim()}:${labels.join(':')}${props})`;
  },
};
