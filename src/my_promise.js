export default class MyPromise {
  resolveHandler;

  rejectHandler;

  finallyHandler;

  error;

  isResolved = false;

  isExcuted = false;

  constructor(executor) {
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

  then(inResolveHandler) {
    this.resolveHandler = inResolveHandler;
    return this;
  }

  catch(inRejectHandler) {
    this.rejectHandler = inRejectHandler;
    return this;
  }

  finally(inFinallyHandler) {
    this.finallyHandler = inFinallyHandler;
    return this;
  }

  resolver() {
    return (data) => {
      if (!this.error) {
        this.isResolved = true;
        this.executeResolve(data);
        this.executeFinally();
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
    if (this.resolveHandler) {
      this.resolveHandler(data);
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
}
