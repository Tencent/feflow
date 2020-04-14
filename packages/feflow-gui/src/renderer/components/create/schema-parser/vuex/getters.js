import { getSchemaByPath } from '../util/util'

export const getSchema = state => path => {
  return getSchemaByPath(state.schema, path)
}
