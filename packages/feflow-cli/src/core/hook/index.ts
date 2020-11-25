import {
  HOOK_TYPE_BEFORE,
  HOOK_TYPE_AFTER,
  EVENT_COMMAND_BEGIN,
  EVENT_DONE
} from '../../shared/constant';

export default class Hook {
  private listeners: any;
  private maxListener: any;
  constructor() {
    this.listeners = [];
    this.maxListener = 100;
  }

  on(type: any, listener: any) {
    const listeners = this.listeners;
    if (listeners[type] && listeners[type].length >= this.maxListener) {
      throw new Error(`Listener's maxCount is ${this.maxListener}, has exceed`);
    }
    if (listeners[type] instanceof Array) {
      if (listeners[type].indexOf(listener) === -1) {
        listeners[type].push(listener);
      }
    } else {
      listeners[type] = [].concat(listener);
    }
  }

  emit(type: any, ...args: []) {
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
      default:
        const listeners = this.listeners[type];
        if (!listeners) {
          return;
        }
        this.listeners[type].forEach((listener: any) => {
          listener.apply(null, args);
        });
        break;
    }
  }

  /**
   * Run hook `type` callbacks and then invoke `fn()`.
   *
   * @private
   * @param {string} type
   * @param {Function} fn
   */
  hook(type: any, fn: any) {
    const hooks = this.listeners[type];

    const next = (i: any) => {
      const hook = hooks[i];
      if (!hook) {
        return fn();
      }

      const result = hook.call();
      if (result && typeof result.then === 'function') {
        result.then(
          () => {
            next(++i);
          },
          () => {
            throw new Error('Promise rejected with no or falsy reason');
          }
        );
      } else {
        next(++i);
      }
    };

    process.nextTick(() => {
      if (!hooks) {
        return fn();
      } else {
        next(0);
      }
    });
  }
}
