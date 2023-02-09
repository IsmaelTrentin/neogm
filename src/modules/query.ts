import {
  GetPropertiesTypeFromSchema,
  QueryNodeResult,
  Schema,
} from '../@types';

import { QueryResult } from 'neo4j-driver';

const collapseResults = <S extends Schema>(
  queryResult: QueryResult<GetPropertiesTypeFromSchema<S>>,
  varNames: string[] = ['n']
) => {
  const filteredRecords: QueryNodeResult<S>[] = [];
  queryResult.records.forEach(r =>
    varNames.forEach(vn => filteredRecords.push(r.get(vn)))
  );

  return filteredRecords;
};
