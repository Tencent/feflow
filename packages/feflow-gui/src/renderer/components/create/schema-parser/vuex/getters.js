import { getSchemaByPath } from '../util/util'

export const getSchema = state => path => getSchemaByPath(state.schema, path)
