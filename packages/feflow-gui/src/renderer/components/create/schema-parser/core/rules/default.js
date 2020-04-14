import objectpath from 'objectpath'

export default function (name, schema, options) {
  const def = {
    key: options.path
  }

  def.title = typeof schema.title !== 'undefined' ? schema.title : name

  if (schema.description) {
    def.description = schema.description
  }

  if (options.required) {
    def.required = true
  }

  if (options.col) {
    def.col = options.col
  }

  // def.schema = schema

  options.lookup[objectpath.stringify(options.path)] = def

  return def
}
