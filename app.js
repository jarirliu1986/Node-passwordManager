
var storage = require("node-persist");
storage.initSync();

var crypto = require('crypto-js');
// storage.setItemSync('account', [{
//  name: 'facebook',	
// 	username: 'Dora',
// 	password: 0
// }]);

var argv = require('yargs')
//create account
	.command('create', 'create an account', function (yargs) {
		yargs.options({
			name:{
				demand: true,
				alias: 'n',
				description: 'account name(eg. facebook, twitter)',
				type: 'string'
			},
			username: {
				demand: true,
				alias: 'u',
				description: 'account username/email',
				type: 'string'
			},
			password: {
				demand: true,
				alias: 'p',
				description: 'account password',
				type: 'string'
			},
			masterPassword: {
				demand: true,
				alias: 'm',
				description: 'masterPassword',
				type: 'string'
			}
		}).help('help');
	})
//get account
	.command('get', 'get an account', function (yargs) {
		yargs.options({
			name:{
				demand: true,
				alias: 'n',
				description: 'get the account information',
				type: 'string'
			},
			masterPassword: {
				demand: true,
				alias: 'm',
				description: 'masterPassword',
				type: 'string'
			}
		}).help('help');
	})
	.help('help')
	.argv;
var command = argv._[0];

function getAccounts(masterPassword) {
	var encryptedAccount = storage.getItemSync('accounts');
	var accounts = [];

	if (typeof encryptedAccount !== 'undefined') {
		var bytes = crypto.AES.decrypt(encryptedAccount, masterPassword);
		accounts = JSON.parse(bytes.toString(crypto.enc.Utf8));
	}
	return accounts;
}
function saveAccounts(accounts, masterPassword) {
	var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts), masterPassword);

	storage.setItemSync('accounts', encryptedAccounts.toString());

	return accounts;
}

function createAccount(account, masterPassword) {
	var accounts = getAccounts(masterPassword);

	accounts.push(account);
	saveAccounts(accounts, masterPassword);

	return account;
}

function getAccount(accountName, masterPassword) {
	var accounts = getAccounts(masterPassword);
	var matchedAccount;

	if (typeof accounts !== 'undefined') {
			accounts.forEach(function (account) {
			if(account.name === accountName){
				matchedAccount = account;
			}
		});
		return matchedAccount;
	}
}

if (command === 'create') {
	try{
		var createdAccount = createAccount({
			name: argv.name,
			username: argv.username,
			password: argv.password
		}, argv.masterPassword);
		console.log('account created!');
		console.log(createdAccount);
	}catch(error){
		console.log('unable to create account');
	}
}else if(command === 'get'){
	try{
		var fetchedAccount = getAccount(argv.name,argv.masterPassword);
		if (typeof fetchedAccount === 'undefined') {
			console.log('account does not exist');
		}else{
			console.log('account information: ');
			console.log(fetchedAccount);
		}
	}catch(error){
		console.log('unable to fetch the account information');
	}
}
