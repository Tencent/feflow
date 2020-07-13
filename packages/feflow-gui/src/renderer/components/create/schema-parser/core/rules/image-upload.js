export default function (def, schema) {
  const { type } = schema;
  const { format } = schema;

  if (type === 'string' && (format && format === 'image')) {
    def.type = 'image-upload';
    // schema.default = ''
  }
}
