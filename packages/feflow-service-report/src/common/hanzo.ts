interface Hanzo {
  obj: object;
  create: () => Hanzo;
  load: (key: string, value: any) => Hanzo;
  done: () => object;
}

const hanzo: Hanzo = {
  obj: null,
  create(): Hanzo {
    this.obj = Object.create(null);
    return this;
  },
  load(key, value): Hanzo {
    if (typeof value == 'function') {
      this.obj[key] = value();
    } else {
      this.obj[key] = value;
    }
    return this;
  },
  done() {
    const target = Object.assign({}, this.obj);
    this.obj = null;
    return target;
  }
};

export default hanzo;
