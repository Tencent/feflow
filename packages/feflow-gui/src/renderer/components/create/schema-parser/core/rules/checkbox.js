export default function(def, schema) {
  const type = schema.type

  if (type === 'boolean') {
    schema.default = schema.default !== undefined ? schema.default : false
    def.type = 'checkbox'
  }
}
