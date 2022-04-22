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

  then(func) {
    this.resolveHandlerArr.push(func);
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
}
