interface ObjectFactory {
  obj: object;
  create: () => ObjectFactory;
  load: (key: string, value?: string | number | boolean | Function) => ObjectFactory;
  done: () => object;
}

const cache: Object = {};

const objectFactory: ObjectFactory = {
  obj: null,
  create(): ObjectFactory {
    this.obj = Object.create(null);
    return this;
  },
  load(key, value): ObjectFactory {
    if (typeof value == 'function') {
      this.obj[key] = value();
    } else {
      this.obj[key] = value === undefined ? cache[key] : value;
    }
    if (cache[key] === undefined) {
      cache[key] = this.obj[key];
    }
    return this;
  },
  done() {
    const target = Object.assign({}, this.obj);
    this.obj = null;
    return target;
  },
};

export default objectFactory;
