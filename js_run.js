var vm = require('vm'), sandbox = {};

var output = vm.runInNewContext(process.argv[2], sandbox);

if (typeof output === 'object' && !(output instanceof Array)) {
	output = JSON.stringify(output);
} else if (typeof output === 'string') {
	output = '"' + output + '"';
}

console.log(output);
