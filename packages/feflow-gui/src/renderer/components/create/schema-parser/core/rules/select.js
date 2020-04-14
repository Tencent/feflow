import { enumToOptions } from '../../util/util'

export default function (def, schema) {
  const type = schema.type

  if (type === 'string' && schema['enum']) {
    def.type = 'v-select'
    def.options = enumToOptions(schema['enum'])
  }
}
