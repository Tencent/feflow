const DATE_TYPE_ENUM = 'date,date-time,time'

export default function (def, schema) {
  const type = schema.type
  const format = schema.format

  if (type === 'string' && (format && DATE_TYPE_ENUM.indexOf(format) > -1)) {
    def.type = 'date'
    // schema.default = ''
  }
}
