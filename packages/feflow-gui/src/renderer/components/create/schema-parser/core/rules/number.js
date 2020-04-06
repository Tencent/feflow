export default function (def, schema) {
  const type = schema.type

  if (type === 'number' || type === 'integer') {
    def.type = 'number'
  }
}
