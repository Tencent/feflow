export default function (def, schema) {
  const type = schema.type

  if (type === 'boolean') {
    schema.default = false
    def.type = 'checkbox'
  }
}
