const { MyPromise } = require('../dist/my_promise.js');

const countPromise = (p1 = 1) => new MyPromise((resolve, reject) => {
  setTimeout(() => {
    if (p1 === 6) {
      reject(new Error(`Promise Error has occured - value: ${p1}`));
      return;
    }
    console.log(`---Count Promise: ${p1}/5`);
    resolve(p1 + 1);
  }, 100);
});
const countSlowPromise = (p1 = 3) => new MyPromise((resolve, reject) => {
  setTimeout(() => {
    if (p1 === 6) {
      reject(new Error(`Promise Error has occured - value: ${p1}`));
      return;
    }
    console.log(`---Count Promise: ${p1}/5`);
    resolve(p1 + 1);
  }, 400);
});
const countErrorPromise = () => new MyPromise((resolve, reject) => {
  setTimeout(() => {
    reject(new Error('Promise Error has occured '));
  }, 100);
});
const sleepPromise = (mis, message) => new MyPromise((resolve) => {
  setTimeout(() => {
    console.log(message);
    resolve();
  }, mis);
});

const main = () => {
  console.log('Example code in NodeJS');
  console.log('Starting...\n');

  console.log('Staring Count Promise Example...');
  countPromise().then(countPromise).then(countPromise).then(countPromise)
    .then(countPromise)
    .finally(() => {
      console.log('Complete Count Promise Example...');
    });

  sleepPromise(1000, '\nStarting Error Promise Example...').then(countPromise).then(countPromise).then(countPromise)
    .then(countPromise)
    .then(countPromise)
    .then(countPromise)
    .then(countPromise)
    .then(countPromise)
    .then(countPromise)
    .catch((e) => {
      console.log('Count Promise', e);
    })
    .finally(() => {
      console.log('Complete Error Promise Example...');
    });

  sleepPromise(3000, '\nStarting MyPromise.resolve(value) Example...').then(() => {
    MyPromise.resolve('reason').then((data) => {
      console.log(`This is ${data}`);
    }).finally(() => {
      console.log('Complete MyPromise.resolve(value) Example...');
    });
  });

  sleepPromise(4000, '\nStarting MyPromise.resolve(Promise) Example...').then(() => {
    MyPromise.resolve(countPromise()).finally(() => {
      console.log('Complete MyPromise.resolve(Promise) Example...');
    });
  });

  sleepPromise(5000, '\nStarting MyPromise.reject(value) Example...').then(() => {
    MyPromise.reject(new Error('reject value')).then((data) => {
      console.log('This will not be executed', data);
    }).catch((e) => {
      console.log('MyPromise.reject Error', e);
    }).finally(() => {
      console.log('Complete MyPromise.reject(value) Example...');
    });
  });

  sleepPromise(6000, '\nStarting MyPromise.all Example...').then(() => {
    MyPromise.all([countPromise(1), countPromise(1), countPromise(1), countPromise(1), MyPromise.resolve(100)])
      .then((valueArr) => {
        console.log('Value of MyPromise.all', valueArr);
      }).finally(() => {
        console.log('Complete MyPromise.all Example...');
      });
  });

  sleepPromise(7000, '\nStarting MyPromise.all Error Example...').then(() => {
    MyPromise.all([countPromise(1), countErrorPromise(1), countPromise(1), countPromise(1)]).then((valueArr) => {
      console.log('Value of MyPromise.all Error(This will not be executed)', valueArr);
    }).catch((e) => {
      console.log('MyPromise.all Error', e);
    }).finally(() => {
      console.log('Complete MyPromise.all Error Example...');
    });
  });

  sleepPromise(8000, '\nStarting MyPromise.allSettled Example...').then(() => {
    MyPromise.allSettled([countPromise(1), countErrorPromise(1), countPromise(1), MyPromise.resolve(1), MyPromise.reject(new Error('all Error'))]).then((valueArr) => {
      console.log('Value of MyPromise.allSettled: ', valueArr);
    }).finally(() => {
      console.log('Complete MyPromise.allSettled Example...');
    });
  });
  sleepPromise(9000, '\nStarting MyPromise.race Example...').then(() => {
    MyPromise.race([countPromise(1), countSlowPromise(1), countErrorPromise(1), countPromise(1)])
      .then((valueArr) => {
        console.log('Value of MyPromise.race: ', valueArr);
      }).catch((e) => {
        console.log('MyPromise.race Error', e);
      }).finally(() => {
        console.log('Complete MyPromise.race Example...');
      });
  });
  sleepPromise(10000, '\nStarting MyPromise.any Example...').then(() => {
    MyPromise.any([countPromise(1), countSlowPromise(1), countErrorPromise(1), countPromise(1)])
      .then((valueArr) => {
        console.log('Value of MyPromise.any: ', valueArr);
      }).catch((e) => {
        console.log('MyPromise.any Error', e);
      }).finally(() => {
        console.log('Complete MyPromise.any Example...');
      });
  });
  sleepPromise(11000, '\nStarting MyPromise.any Error Example...').then(() => {
    MyPromise.any([countErrorPromise(1), countErrorPromise(1)])
      .then((valueArr) => {
        console.log('Value of MyPromise.any Error (This function will not be executed) : ', valueArr);
      }).catch((e) => {
        console.log('MyPromise.any Error Error', e);
      }).finally(() => {
        console.log('Complete MyPromise.any Error Example...');
      });
  });
};

main();
