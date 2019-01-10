var StellarSdk = require('stellar-sdk');
var request = require('request');
/**
 * AccountsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    friendlyName: 'index',
 
    description: 'Accounts Dashboard',
 
    inputs: {
       generate_new_keypair: {
         description: 'A command to generate new KeyPair.',
         // By declaring a numeric example, Sails will automatically respond with `res.badRequest`
         // if the `userId` parameter is not a number.
         type: 'number',
         // By making the `userId` parameter required, Sails will automatically respond with
         // `res.badRequest` if it's left out.
         required: false
       },
       create_new_account_publickey: {
        description: 'A command to create new Account.',
        // By declaring a numeric example, Sails will automatically respond with `res.badRequest`
        // if the `userId` parameter is not a number.
        type: 'string',
        // By making the `userId` parameter required, Sails will automatically respond with
        // `res.badRequest` if it's left out.
        required: false         
       },
       new_account_secretkey: {
        description: 'Optional input if we want to save SecretKey with the new created account.',
        // By declaring a numeric example, Sails will automatically respond with `res.badRequest`
        // if the `userId` parameter is not a number.
        type: 'string',
        // By making the `userId` parameter required, Sails will automatically respond with
        // `res.badRequest` if it's left out.
        required: false            
       },
       show_account_balance: {
        description: 'Account publicKey for which we want to see balance.',
        // By declaring a numeric example, Sails will automatically respond with `res.badRequest`
        // if the `userId` parameter is not a number.
        type: 'string',
        // By making the `userId` parameter required, Sails will automatically respond with
        // `res.badRequest` if it's left out.
        required: false 
       },
       address_from_create: {
        description: 'Address you are creating new account from.',
        // By declaring a numeric example, Sails will automatically respond with `res.badRequest`
        // if the `userId` parameter is not a number.
        type: 'string',
        // By making the `userId` parameter required, Sails will automatically respond with
        // `res.badRequest` if it's left out.
        required: false 
       },
       secret_key_create: {
        description: 'Secret key of creating account.',
        // By declaring a numeric example, Sails will automatically respond with `res.badRequest`
        // if the `userId` parameter is not a number.
        type: 'string',
        // By making the `userId` parameter required, Sails will automatically respond with
        // `res.badRequest` if it's left out.
        required: false 
       },
       starting_balance: {
        description: 'Starting Balance of new account.',
        // By declaring a numeric example, Sails will automatically respond with `res.badRequest`
        // if the `userId` parameter is not a number.
        type: 'string',
        // By making the `userId` parameter required, Sails will automatically respond with
        // `res.badRequest` if it's left out.
        required: false 
       }
    },
 
    exits: {
       success: {
         responseType: 'view',
         viewTemplatePath: 'accounts/homepage'
       },
       notFound: {
         description: 'Error in Controller.',
         responseType: 'notFound'
       }
    },
 
    fn: async function (inputs, exits) {
 
       // Look up the user whose ID was specified in the request.
       // Note that we don't have to validate that `userId` is a number;
       // the machine runner does this for us and returns `badRequest`
       // if validation fails.

      
      if (inputs.generate_new_keypair) {
       var pair = StellarSdk.Keypair.random();

       //pair.secret();
       // SAV76USXIJOBMEQXPANUOQM6F5LIOTLPDIDVRJBFFE2MDJXG24TAPUU7
       //pair.publicKey();
       // GCFXHS4GXL6BVUCXBWXGTITROWLVYXQKQLF4YH5O5JT3YZXCYPAFBJZB
       return exits.success({new_keyPair: pair});

      } else if (inputs.create_new_account_publickey){
        StellarSdk.Network.useTestNetwork();
       // var server = new StellarSdk.Server('https://horizon-testnet.stellar.org'); 
       // server.loadAccount(inputs.create_new_account_publickey).then(function(account) { console.log(account.sequence) })
       // var secretString = inputs.secret_key_create;

        // create an Account object using locally tracked sequence number
        var account_promise = new Promise(function(resolve, reject) {
          resolve(new StellarSdk.Server('https://horizon-testnet.stellar.org').loadAccount(inputs.create_new_account_publickey));
        });
        account_promise.then(function(value) {
          console.log(value.sequence);
        })
        //console.log(an_account.sequence);
/*
        var transaction = new StellarSdk.TransactionBuilder(an_account)
            .addOperation(StellarSdk.Operation.createAccount({
              destination: inputs.create_new_account_publickey,
              startingBalance: inputs.starting_balance.toString();  // in XLM
            }))
            .build();

        transaction.sign(StellarSdk.Keypair.fromSecret(secretString)); // sign the transaction

        // transaction is now ready to be sent to the network or saved somewhere
       if (inputs.new_account_secretkey) {
        await Account.create({publicKey: inputs.create_new_account_publickey, secretKey: inputs.new_account_secretkey});
       } else {
        await Account.create({publicKey: inputs.create_new_account_publickey});
       }
*/
      } else if (inputs.show_account_balance) {
        var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
        var account_balances = []
        // the JS SDK uses promises for most actions, such as retrieving an account
        server.loadAccount(inputs.show_account_balance).then(function(account) {
          account.balances.forEach(function(balance) {
            account_balances.push({asset: balance.asset_code, asset_type: balance.asset_type, balance: balance.balance});
          });
          return exits.success({account: inputs.show_account_balance, balances: account_balances});
        }).catch(function (err) {
          return exits.success({error: 'Account not found.'});
        });
      } else {
        var accounts = await Account.find();

        // Display the welcome view.
        return exits.success({accounts: accounts});
      }

    }
 };

