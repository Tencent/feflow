import _ from 'lodash'
// import ojectpath from 'objectpath'

const enumToOptions = function (enm) {
  const options = []

  _.each(enm, item => {
    options.push({
      label: item,
      value: item
    })
  })

  return options
}

const getSchemaByPath = function (schema, path) {
  if (!schema) {
    throw new Error('schema is required!')
  }

  if (!path) {
    return schema
  }

  const schemaPath = []
  const len = path.length
  path.forEach((p, idx) => {
    if (p === '$index') {
      schemaPath.push('items')
    } else {
      schemaPath.push(p)
    }

    if (idx !== len - 1 && path[idx + 1] !== '$index') {
      schemaPath.push('properties')
    }
  })

  schemaPath.splice(0, 0, 'properties')
  return _.get(schema, schemaPath)
}

const parseErrors = function (errors) {
  const map = {}

  errors.forEach(err => {
    map[err.path] = err
  })

  return map
}

export {
  enumToOptions,
  getSchemaByPath,
  parseErrors
}
