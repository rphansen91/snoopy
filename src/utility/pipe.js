module.exports = (...fns) => arg => 
    fns.reduce((v, fn) => 
        fn(v), arg);