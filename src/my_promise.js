export default class MyPromise {
  resolveHandlerArr = [];

  rejectHandler;

  finallyHandler;

  error;

  isResolved = false;

  isExcuted = false;

  constructor(executor) {
    if (executor) {
      setTimeout(() => {
        try {
          executor(this.resolver(), this.rejector());
        } catch (e) {
          this.executeReJect(e);
          this.executeFinally();
        }

        this.isExcuted = true;
      });
    }
  }

  then(func, rejectFunc) {
    this.resolveHandlerArr.push(func);
    if (rejectFunc) {
      this.rejectHandler = rejectFunc;
    }
    return this;
  }

  catch(func) {
    this.rejectHandler = func;
    return this;
  }

  finally(func) {
    this.finallyHandler = func;
    return this;
  }

  resolver() {
    return (data) => {
      if (!this.error) {
        this.isResolved = true;
        this.executeResolve(data);
      }
    };
  }

  rejector() {
    return (e) => {
      if (!this.isExcuted) {
        throw e;
      }
      this.error = e;
      if (!this.isResolved) {
        this.executeReJect(e);
        this.executeFinally();
      }
    };
  }

  executeResolve(data) {
    const popped = this.resolveHandlerArr.shift();
    if (popped) {
      const nextPromise = popped(data);
      if (nextPromise) {
        nextPromise.passHandlers(this);
      } else {
        this.executeFinally();
      }
    }
  }

  executeReJect(e) {
    if (this.rejectHandler) {
      this.rejectHandler(e);
    } else {
      throw e;
    }
  }

  executeFinally() {
    if (this.finallyHandler) {
      this.finallyHandler();
    }
  }

  passHandlers(myPromise) {
    this.resolveHandlerArr = myPromise.resolveHandlerArr;
    this.rejectHandler = myPromise.rejectHandler;
    this.finallyHandler = myPromise.finallyHandler;
  }

  static resolve(reason) {
    if (reason.constructor === MyPromise) {
      return reason;
    }
    return new MyPromise((resolve) => {
      resolve(reason);
    });
  }

  static reject(value) {
    if (value.constructor === MyPromise) {
      return value;
    }
    return new MyPromise((_, reject) => {
      reject(value);
    });
  }

  static all(iterable) {
    const setValue = (index, value, valueArr, resolve) => {
      valueArr[index] = {
        isFin: true,
        value,
      };
      if (valueArr.every((v) => v.isFin)) {
        resolve(valueArr.map((v) => v.value));
      }
    };
    return new MyPromise((resolve, reject) => {
      try {
        const returnValueArr = iterable.map(() => ({
          isFin: false,
          value: 0,
        }));
        iterable.forEach((v, i) => {
          if (v instanceof Function) {
            const resultOfFunction = v();
            if (resultOfFunction.constructor === MyPromise) {
              resultOfFunction.then((d) => {
                setValue(i, d, returnValueArr, resolve);
              }).catch((e) => { reject(e); });
            } else {
              setValue(i, v, returnValueArr, resolve);
            }
          } else {
            setValue(i, v, returnValueArr, resolve);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
