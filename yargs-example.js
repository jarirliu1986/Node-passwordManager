var argv = require('yargs')
	.command('hello', 'Greets the user', function(yargs){
		yargs.options({
			fname: {
					demand: true,
					alias: 'f',
					description: 'your first name here',
					type: 'string'  
				},
			lname: {
					demand: false,
					alias: 'l',
					description: 'your last name here',
					type: 'string'  
				}
			}).help('help');
		})
	.help('help')
	.argv;
console.log(argv);

var command = argv._[0];
if (command === 'hello' && typeof argv.fname !== 'undefined' && typeof argv.lname !== 'undefined') {
	console.log(command + ", " + argv.fname + " " + argv.lname);
}else if(command === 'hello' && typeof argv.fname !== 'undefined'){
	console.log(command +", " + argv.fname);
}else if (command === 'hello' ) {
	console.log(command + ', ' + 'world!');
}