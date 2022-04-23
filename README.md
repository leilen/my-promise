# my-promise
This Repository is implementation of "Promise".

## Methods
 * new Promise(executor)
 * Promise.prototype.then(func)
 * Promise.prototype.catch(func)
 * Promise.prototype.finally(func)
 * Promise.resolve(reason)
 * Promise.reject(value)
 * Promise.all(iterable)
 * Promise.allSettled(iterable)
 * Promise.any(iterable)
 * Promise.race(iterable)

## Usage
In nodejs
>const { MyPromise } = require('../dist/my_promise.js')

In Browser
><script type="text/javascript" src="../dist/my_promise.js"></script>

## Scripts
npm run test # Must execute "npm install" 
>Test all case using jest

npm run example:node
>Execute NodeJS example code.

npm run example:web
>Execute "Chrome" with browser test code.
>The process of code execution is shown in the console window
