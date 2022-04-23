/**
 * Implemented Promise class.
 *
 * Methods
 * ● new Promise(executor)
 * ● Promise.prototype.then(func)
 * ● Promise.prototype.catch(func)
 * ● Promise.prototype.finally(func)
 * ● Promise.resolve(reason)
 * ● Promise.reject(value)
 * ● Promise.all(iterable)
 * ● Promise.allSettled(iterable)
 * ● Promise.any(iterable)
 * ● Promise.race(iterable)
 *
*/
class MyPromise {
  isForThen = false;

  resolveHandlerArr = [];

  rejectHandler;

  finallyHandler;

  error;

  data;

  isResolved = false;

  isExcuted = false;

  name = '';

  constructor(executor, name) {
    this.name = name;
    if (executor) {
      setTimeout(() => {
        try {
          executor(this.resolver(), this.rejector());
        } catch (e) {
          this.executeReJect(e);
          this.executeFinally();
        } finally {
          this.isExcuted = true;
        }
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
    let isRejected = false;
    const setValue = (index, value, valueArr, resolve) => {
      if (isRejected) {
        return;
      }
      valueArr[index] = {
        isFin: true,
        value,
      };
      if (valueArr.every((v) => v.isFin)) {
        resolve(valueArr.map((v) => v.value));
      }
    };
    const customReject = (reject, e) => {
      if (!isRejected) {
        isRejected = true;
        reject(e);
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
              throw v.error;
            }
            v.then((d) => {
              setValue(i, d, returnValueArr, resolve);
            }).catch((e) => {
              customReject(reject, e);
            });
          } else {
            setValue(i, v, returnValueArr, resolve);
          }
        } catch (e) {
          customReject(reject, e);
        }
      });
    });
  }

  static allSettled(iterable) {
    const { stateDic } = MyPromise;
    const setValue = (index, value, valueArr, resolve, isRejected) => {
      valueArr[index] = {
        isFin: true,
        status: isRejected ? stateDic.reject : stateDic.resolve,
      };
      valueArr[index][isRejected ? 'reason' : 'value'] = value;
      if (valueArr.every((v) => v.isFin)) {
        resolve(valueArr.map((v) => {
          delete v.isFin;
          return v;
        }));
      }
    };
    return new MyPromise((resolve) => {
      const returnValueArr = iterable.map(() => ({
        isFin: false,
        value: '',
      }));
      iterable.forEach((v, i) => {
        try {
          if (v.constructor === MyPromise) {
            if (v.data) {
              setValue(i, v.data, returnValueArr, resolve, false);
            } else if (v.error) {
              setValue(i, v.error, returnValueArr, resolve, true);
            }
            v.then((d) => {
              setValue(i, d, returnValueArr, resolve, false);
            }).catch((e) => {
              setValue(i, e, returnValueArr, resolve, true);
            });
          } else {
            setValue(i, v, returnValueArr, resolve, false);
          }
        } catch (e) {
          setValue(i, e, returnValueArr, resolve, true);
        }
      });
    });
  }

  static race(iterable) {
    let isFin = false;
    const setValue = (value, resolve) => {
      if (isFin) {
        return;
      }
      isFin = true;
      resolve(value);
    };
    const customReject = (reject, e) => {
      if (isFin) {
        return;
      }
      isFin = true;
      reject(e);
    };
    return new MyPromise((resolve, reject) => {
      iterable.forEach((v) => {
        try {
          if (v.constructor === MyPromise) {
            if (v.data) {
              setValue(v.data, resolve);
            } else if (v.error) {
              throw v.error;
            }
            v.then((d) => {
              setValue(d, resolve);
            }).catch((e) => {
              customReject(reject, e);
            });
          } else {
            setValue(v, resolve);
          }
        } catch (e) {
          customReject(reject, e);
        }
      });
    });
  }

  static any(iterable) {
    let isFin = false;
    const setValue = (index, value, valueArr, resolve, reject, isRejected) => {
      if (isFin) {
        return;
      }
      valueArr[index] = {
        isFin: true,
        isRejected,
        value,
      };
      if (!isRejected) {
        isFin = true;
        resolve(value);
        return;
      }
      if (valueArr.every((v) => v.isFin)) {
        reject(new AggregateError(iterable, 'No Promise in Promise.any was resolved'));
      }
    };
    return new MyPromise((resolve, reject) => {
      const returnValueArr = iterable.map(() => ({
        isFin: false,
        isRejected: false,
        value: '',
      }));
      iterable.forEach((v, i) => {
        try {
          if (v.constructor === MyPromise) {
            if (v.data) {
              setValue(i, v.data, returnValueArr, resolve, reject, false);
            } else if (v.error) {
              setValue(i, null, returnValueArr, resolve, reject, true);
            }
            v.then((d) => {
              setValue(i, d, returnValueArr, resolve, reject, false);
            }).catch(() => {
              setValue(i, null, returnValueArr, resolve, reject, true);
            });
          } else {
            setValue(i, v, returnValueArr, resolve, reject, false);
          }
        } catch (e) {
          setValue(i, null, returnValueArr, resolve, reject, true);
        }
      });
    });
  }

  static stateDic = {
    resolve: 'fulfilled',
    reject: 'rejected',
  };
}

try {
  exports.MyPromise = MyPromise;
} catch (e) {}
