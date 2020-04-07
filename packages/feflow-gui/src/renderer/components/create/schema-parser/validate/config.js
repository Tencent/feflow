export default {
  $data: true,
  removeAdditional: true,
  useDefaults: false,
  coerceTypes: true,
  allErrors: true,
  jsonPointers: true,
  format: 'fast',
  formats: {
    phone: /^1[3|4|5|6|7|8|9]\d{9}$/,
    mobile: /^1[3|4|5|6|7|8|9]\d{9}$/,
    'date-time': /^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d:\d\d)?$/i,
    image: /\w+(\.gif|\.jpeg|\.png|\.jpg|\.bmp)$/i
  }
}
