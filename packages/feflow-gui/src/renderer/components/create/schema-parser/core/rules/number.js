export default function (def, schema) {
  const { type } = schema;

  if (type === 'number' || type === 'integer') {
    def.type = 'number';
  }
}
