export default class MyPromise {
  resolveHandler;

  rejectHandler;

  finallyHandler;

  constructor(executor) {
    this.executor = executor;
  }

  then(inResolveHandler) {
    this.resolveHandler = inResolveHandler;
    this.executor(this.resolveHandler);
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
}
