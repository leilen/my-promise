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
        this.rejectHandler(e);
        this.finallyHandler();
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
        this.resolveHandler(data);
        this.finallyHandler();
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
        this.rejectHandler(e);
        this.finallyHandler();
      }
    };
  }
}
