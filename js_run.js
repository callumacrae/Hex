var vm = require('vm'), sandbox = {};
console.log(vm.runInNewContext(process.argv[2], sandbox));