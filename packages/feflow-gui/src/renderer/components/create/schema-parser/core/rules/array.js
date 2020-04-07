export default function (def, schema, options) {
  const type = schema.type

  delete options.parentType
  delete options.col

  if (type === 'array') {
    def.type = 'array'

    const path = options.path.slice()

    // 用$index来代替[]，$index作为数组坐标，可替换真实坐标
    path.push('$index')
    if (schema.items) {
      def.items = []
      this._parse('', schema.items, def.items, {
        path: path,
        lookup: options.lookup,
        parentType: 'array'
      })
    }
  }
}
