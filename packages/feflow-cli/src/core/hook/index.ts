import { HOOK_TYPE_BEFORE, HOOK_TYPE_AFTER, EVENT_COMMAND_BEGIN, EVENT_DONE } from '../../shared/constant';

export default class Hook {
  private readonly listeners: {
    [type: string]: Function[];
  };
  private readonly maxListener: number;
  constructor() {
    this.listeners = {};
    this.maxListener = 100;
  }

  on(type: string, listener: Function) {
    const { listeners } = this;
    if (listeners[type] && listeners[type].length >= this.maxListener) {
      throw new Error(`Listener's maxCount is ${this.maxListener}, has exceed`);
    }
    if (Array.isArray(listeners[type])) {
      if (listeners[type].indexOf(listener) === -1) {
        listeners[type].push(listener);
      }
    } else {
      listeners[type] = [listener];
    }
  }

  emit(type: string, ...args: any[]) {
    switch (type) {
      case HOOK_TYPE_BEFORE:
        this.hook(HOOK_TYPE_BEFORE, () => {
          this.emit(EVENT_COMMAND_BEGIN);
        });
        break;
      case HOOK_TYPE_AFTER:
        this.hook(HOOK_TYPE_AFTER, () => {
          this.emit(EVENT_DONE);
        });
        break;
      default: {
        this.listeners[type]?.forEach((listener: Function) => {
          listener(args);
        });
        break;
      }
    }
  }

  /**
   * Run hook `type` callbacks and then invoke `fn()`.
   *
   * @private
   * @param {string} type
   * @param {Function} fn
   */
  hook(type: string, fn: Function) {
    const hooks = this.listeners[type];

    const next = (i: number) => {
      const hook = hooks[i];
      if (!hook) {
        return fn();
      }

      const result = hook();
      if (result && typeof result.then === 'function') {
        result.then(
          () => {
            next(i + 1);
          },
          () => {
            throw new Error('Promise rejected with no or falsy reason');
          },
        );
      } else {
        next(i + 1);
      }
    };

    process.nextTick(() => {
      if (!hooks) {
        return fn();
      }
      next(0);
    });
  }
}
