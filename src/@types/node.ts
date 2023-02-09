import { GetLabelsTypeFromSchema, GetPropertiesTypeFromSchema } from './utils';

import { Schemas } from './schema';

export interface QueryNodeResult<S extends Schemas> extends Node {
  labels: GetLabelsTypeFromSchema<S>;
  properties: GetPropertiesTypeFromSchema<S>;
}
