export default function(def, schema) {
  const { type } = schema

  if (type === 'boolean') {
    schema.default = schema.default !== undefined ? schema.default : false
    def.type = 'checkbox'
  }
}
