import _ from 'lodash';
import objectpath from 'objectpath';
import rule from './rule';
import defaultRule from './rules/default';
import arrayRule from './rules/array';
import checkboxRule from './rules/checkbox';
import checkboxesRule from './rules/checkboxes';
import dateRule from './rules/date';
import fieldsetRule from './rules/fieldset';
import numberRule from './rules/number';
import selectRule from './rules/select';
import textRule from './rules/text';
import imageUploadRule from './rules/image-upload';

const rulesMap = {
  checkbox: checkboxRule,
  fieldset: fieldsetRule,
  checkboxes: checkboxesRule,
  array: arrayRule,
  number: numberRule,
  date: dateRule,
  select: selectRule,
  text: textRule,
  image: imageUploadRule,
};

const BUILD_IN_TYPE = ['text', 'select', 'textarea', 'html', 'grid', 'fieldset'];

class Generator {
  constructor() {
    this.rules = {};
    this.init();
  }

  init() {
    const rules = {};

    _.each(rule, (list, type) => {
      rules[type] = list.map(item => rulesMap[item]);
    });

    this.rules = rules;
  }

  /**
   * 给指定类型添加规则
   * @param {String} type data type
   * @param {Function} rule 规则
   * @param {Number} idx 添加位置，不提供则是添加到第一位
   */
  addRule(type, rule, idx = 0) {
    const rules = this.rules[type];

    if (!rules) {
      throw new Error(`不支持的类型: ${type}`);
    }

    rules.splice(idx, 0, rule);
  }

  /**
   * 生成表单模型
   * @param {Object} schema
   * @param {Array} definition
   */
  parse(schema, definition = [], model = {}) {
    if (!(schema && schema.properties)) {
      throw new Error('schema no validate!');
    }

    const options = { path: [], lookup: {} };
    const schemaForm = [];
    let requiredList = [];

    // required的逻辑
    // then 和 else 中也可能有required
    const branch = schema.if;
    if (branch) {
      const branchThen = schema.then;
      const branchElse = schema.else;

      // 整合required
      const barnchKeys = Object.keys(branch.properties);
      let isMatchCount = 0;

      barnchKeys.forEach((key) => {
        const currentValue = model[key] !== undefined ? model[key] : schema.properties[key].default;
        if (currentValue === branch.properties[key].const) {
          isMatchCount = isMatchCount + 1;
        }
      });

      requiredList = isMatchCount === barnchKeys.length ? branchThen.required : branchElse.required;
    }

    requiredList = requiredList.length ? requiredList : schema.required;

    _.each(schema.properties, (val, key) => {
      const required = _.indexOf(requiredList, key) !== -1;

      this._parse(key, val, schemaForm, {
        path: [key],
        required,
        lookup: options.lookup,
      });
    });

    // 再根据form definition合并form schema
    if (definition.length) {
      definition = combine(definition, schemaForm, options.lookup);
    } else {
      definition = schemaForm;
    }

    return definition;
  }

  /**
   * 生成表单模型
   * @param {Object} schema
   * @param {Array} definition
   */
  _parse(name, schema, definition, options) {
    const rules = this.rules[schema.type];
    let def;

    if (rules) {
      def = defaultRule(name, schema, options);

      for (let i = 0, len = rules.length; i < len; i++) {
        rules[i].call(this, def, schema, options);

        if (def.type) {
          break;
        }
      }
    }

    definition.push(def);
  }
  /**
   * 解析条件属性
   * @param {Object} schema
   */
  parseSwitchProperties(schema) {
    let switchProperties = [];
    const branch = schema.if;
    if (branch) {
      switchProperties = Object.keys(branch.properties);
    }
    return switchProperties;
  }
  getDefaultModal(schema) {
    const model = {};

    _.each(schema.properties, (val, key) => {
      defaultValue(val, key, model);
    });

    return model;
  }
}

function defaultValue(schema, key, model) {
  const { type } = schema;

  if (type === 'object') {
    model[key] = {};

    _.each(schema.properties, (val, _key) => {
      defaultValue(val, _key, model[key]);
    });
  } else if (type === 'array') {
    model[key] = [];
    if (schema.items) {
      defaultValue(schema.items, 0, model[key]);
    }
  } else {
    if (typeof schema.default !== 'undefined') {
      model[key] = schema.default;
    }
  }
}

// 合并form definition & schemaForm
function combine(form, schemaForm, lookup) {
  const idx = _.indexOf(form, '*');

  // 用schema生成的默认定义
  if (idx === 0) {
    return schemaForm;
  }

  // Important: 存在*就意味着使用schema生成的默认定义，只是在前后做一定的扩展，如果此时存在同名定义，就会存在两个定义。
  if (idx > -1) {
    form.splice(idx, 1);
  }

  const definition = [];

  _.each(form, (obj) => {
    if (typeof obj === 'string') {
      obj = {
        key: obj,
      };
    }

    if (obj.key && typeof obj.key === 'string') {
      obj.key = obj.key.replace(/\[\]/g, '.$index');
      obj.key = objectpath.parse(obj.key);
    }

    // if (def.options) {
    //   def.options = formatOptions(obj.options)
    // }
    let def;

    // extend with schema form from schema
    if (obj.key) {
      const path = objectpath.stringify(obj.key);
      def = lookup[path];

      if (def) {
        _.each(def, (val, key) => {
          if (typeof obj[key] === 'undefined') {
            obj[key] = val;
          }
        });
      }
      delete lookup[path];
    }

    // 保留html,添加v-前缀
    if (_.indexOf(BUILD_IN_TYPE, obj.type) > -1) {
      obj.type = `v-${obj.type}`;
    }

    if (obj.items) {
      if (def) {
        obj.items = combine(obj.items, def.items, lookup);
      } else {
        obj.items = combine(obj.items, schemaForm, lookup);
      }
    }

    definition.push(obj);
  });

  if (idx > -1 && !_.isEmpty(lookup)) {
    const defaultDefinitions = [];

    // eslint-disable-next-line
    for (const path in lookup) {
      defaultDefinitions.push(lookup[path]);
    }

    definition.splice(idx, 0, ...defaultDefinitions);
  }

  return definition;
}

export default Generator;
