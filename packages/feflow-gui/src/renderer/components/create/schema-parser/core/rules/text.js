export default function (def, schema) {
  const { type } = schema;

  if (type === 'string') {
    def.type = 'v-text';
  }
}
