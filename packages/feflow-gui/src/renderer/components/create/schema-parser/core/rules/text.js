export default function (def, schema) {
  const type = schema.type

  if (type === 'string') {
    def.type = 'v-text'
  }
}
