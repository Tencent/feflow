export default function (def, schema) {
  const type = schema.type
  const format = schema.format

  if (type === 'string' && (format && format === 'image')) {
    def.type = 'image-upload'
    // schema.default = ''
  }
}
