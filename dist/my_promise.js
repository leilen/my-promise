class MyPromise {
  isForThen = false;

  resolveHandlerArr = [];

  rejectHandler;

  finallyHandler;

  error;

  data;

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
    if (this.isForThen) {
      this.data = data;
    }
    if (popped) {
      const nextPromise = popped(data);
      if (nextPromise) {
        nextPromise.passHandlers(this);
        return;
      }
    }
    this.executeFinally();
  }

  executeReJect(e) {
    if (this.rejectHandler) {
      this.rejectHandler(e);
    } else if (this.isForThen) {
      this.error = e;
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
    const promise = new MyPromise((resolve) => {
      resolve(reason);
    });
    promise.isForThen = true;
    return promise;
  }

  static reject(value) {
    const promise = new MyPromise((_, reject) => {
      reject(value);
    });
    promise.isForThen = true;
    return promise;
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
      const returnValueArr = iterable.map(() => ({
        isFin: false,
        value: 0,
      }));
      iterable.forEach((v, i) => {
        try {
          if (v.constructor === MyPromise) {
            if (v.data) {
              setValue(i, v.data, returnValueArr, resolve);
            } else if (v.error) {
              reject(v.error);
            }
            v.then((d) => {
              setValue(i, d, returnValueArr, resolve);
            }).catch((e) => { reject(e); });
          } else if (v instanceof Function) {
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
        } catch (e) {
          reject(e);
        }
      });
    });
  }
}

try {
  exports.Promise = MyPromise;
} catch (e) {}
