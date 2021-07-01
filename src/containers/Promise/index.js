import React from 'react';


// promise入参是非期约值，直接resolve
// promise入参是多个值，除第一个值外其他值被忽略
// promise入参是一个期约，返回一个传入期约的状态



// 定义三种状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

/**
 * @description: 手写promise
 * @param {*}
 * @return {*}
 */
class Promise {
    constructor(executor) {
        // 期约状态
        this.status = PENDING;
        // 成功返回的值
        this.value = undefined;
        // 失败原因
        this.reason = undefined;
        // 成功后的回调函数
        this.onResolvedCallbacks = [];
        // 失败后的回调函数
        this.onRejectCallbacks = [];

        // 传给executor执行器的成功回调函数
        let resolve = (value) => {
            // 当status不是PENDING时，说明状态已经落定不可以再更改了
            if (this.status === PENDING) {
                this.status = FULFILLED;
                this.value = value;
                this.onResolvedCallbacks.forEach((fn) => fn());
            }
        }

        // 当前操作出现错误，将错误信息返回
        let reject = (reason) => {
            // 当status不是PENDING时，说明状态已经落定不可以再更改了
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;
                this.onRejectCallbacks.forEach(fn => fn());
            }
        }

        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error)
        }
    }

    then(onFulfilled, onRejected) {
        // 解决onFulfilled和onRejected没有传值的问题
        // 当then的第一个参数不是函数的时候，下一个then方法成功回调直接将这个结果作为参数返回
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (res) => res;
        onRejected = typeof onRejected === 'function' ? onRejected : (err) => { throw err };

        // onFulfilled和onRejected需要被异步调用，所以用setTimeout模拟异步
        // 调用then方法返回一个新的promise
        const promise2 = new Promise((resolve, reject) => {
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value);
                        // x可能是一个promise
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (err) {
                        reject(err);
                    }
                }, 0)
            }
            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (err) {
                        reject(err);
                    }
                }, 0)
            }
            if (this.status === PENDING) {
                this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (err) {
                            reject(err);
                        }
                    }, 0)
                })
                this.onRejectCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (err) {
                            reject(err);
                        }
                    }, 0)
                })
            }
        })
        return promise2;
    }
}
/**
 * @description: 判断第一个then返回的值x
 * @param {*} promise2 默认返回的promise，x 第一个then return的对象，promise2的resolve，reject
 * @return {*} void
 */
const resolvePromise = (promise2, x, resolve, reject) => {
    // 自己等待自己是循环引用，用一个类型错误结束
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
    }

    // 防止多次调用
    let called;
    // 当传入值不是一个普通值时
    if ((typeof x === 'object' && x != null) || typeof x === 'function') {
        try {
            // resolve过的就不用再reject了
            let then = x.then;

            // then是函数则默认为promise
            if (typeof then === 'function') {
                then.call(x, (y) => {
                    if (called) return;
                    called = true;
                    // 可能promise中还有promise，所以需要做递归解析
                    resolvePromise(promise2, y, resolve, reject);
                }, (r) => {
                    // 失败则返回失败的promise
                    if (called) return;
                    called = true;
                    reject(r);
                })
            } else {
                // 如果x.then是个普通值就直接返回resolve作为结果
                resolve(x);
            }
        } catch (err) {
            if (called) return;
            called = true;
            reject(err);
        }
    } else {
        // 如果resolve是普通值直接返回resolve作为结果
        resolve(x);
    }
}

// Promise.defer = Promise.deferred = function () {
//     let dfd = {}
//     dfd.promise = new Promise((resolve, reject) => {
//         dfd.resolve = resolve;
//         dfd.reject = reject;
//     });
//     return dfd;
// }
// module.exports = Promise;
const p1 = new Promise(res => res(2));
p1.then((res) => console.log(res));


