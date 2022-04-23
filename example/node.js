const { Promise } = require('../dist/my_promise.js');

const countPromise = (p1 = 1) => new Promise((resolve, reject) => {
  setTimeout(() => {
    if (p1 === 6) {
      reject(new Error(`Promise Error has occured - value: ${p1}`));
      return;
    }
    console.log(`Count Promise: ${p1}/5`);
    resolve(p1 + 1);
  }, 100);
});
const sleepPromise = (mis, message) => new Promise((resolve) => {
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

  sleepPromise(3000, '\nStarting Promise.resolve(value) Example...').then(() => {
    Promise.resolve('reason').then((data) => {
      console.log(`This is ${data}`);
    }).finally(() => {
      console.log('Complete Promise.resolve(value) Example...');
    });
  });

  sleepPromise(4000, '\nStarting Promise.resolve(Promise) Example...').then(() => {
    Promise.resolve(countPromise()).finally(() => {
      console.log('Complete Promise.resolve(Promise) Example...');
    });
  });

  sleepPromise(5000, '\nStarting Promise.reject(value) Example...').then(() => {
    Promise.reject(new Error('reject value')).then((data) => {
      console.log('This will not be executed', data);
    }).catch((e) => {
      console.log('Promise.reject Error', e);
    }).finally(() => {
      console.log('Complete Promise.reject(value) Example...');
    });
  });

  sleepPromise(6000, '\nStarting Promise.all Example...').then(() => {
    Promise.all([countPromise, countPromise, countPromise, countPromise, Promise.resolve(100)])
      .then((valueArr) => {
        console.log('Value of Promise.all', valueArr);
      }).finally(() => {
        console.log('Complete Promise.all Example...');
      });
  });

  sleepPromise(7000, '\nStarting Promise.all Error Example...').then(() => {
    Promise.all([countPromise, countPromise, countPromise, Promise.reject(new Error('all Error'))]).then((valueArr) => {
      console.log('Value of Promise.all Error(This will not be executed)', valueArr);
    }).catch((e) => {
      console.log('Promise.all Error', e);
    }).finally(() => {
      console.log('Complete Promise.all Error Example...');
    });
  });
};

main();
