import _ from 'lodash'

export default function(def, schema, options) {
  const { type } = schema
  const { parentType } = options
  delete options.parentType
  delete options.col

  if (type === 'object') {
    if (parentType && parentType === 'array') {
      const size = _.size(schema.properties)
      const itemType = size > 4 ? 'v-fieldset' : 'inline'

      def.type = itemType

      if (itemType === 'inline') {
        options.col = Math.floor(12 / size)
      }
    } else {
      def.type = 'v-fieldset'
    }

    def.items = []

    _.each(schema.properties, (val, key) => {
      if (/\./.test(key)) {
        key = [key]
      }

      const path = options.path.slice()
      path.push(key)

      const required = schema.required && _.indexOf(schema.required, key) !== -1

      this._parse(key, val, def.items, {
        ...options,
        path,
        required,
        lookup: options.lookup,
      })
    })
  }
}
