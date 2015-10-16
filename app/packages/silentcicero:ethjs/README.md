## Synopsis

A simple module for creating, managing and using Ethereum accounts in browser.

## About

This module allows the secure generation and management of Ethereum accounts in browser so that when browser stored accounts are being used by dApps, their outgoing transactions can be securly signed by the accounts stored in browser. All account data is stored in the browsers localStore and can be optionally encrypted with a passphrase using AES. If you're using Meteor.js, the Accounts object will be a reactive variable. 

This module has been specifically designed as a transaction signer meant for use with the [HookedWeb3Provider](https://github.com/ConsenSys/hooked-web3-provider). See example below.

Please note that this module is still in Alpha. The security status of this module is still unknown and must still be vetted by trusted third-parties before production use.

## Installation

### Node.js

```
$ npm install ethereumjs-accounts
```
  
### Meteor.js

```
$ meteor add silentcicero:ethereumjs-accounts
```

## Usage

Require the NPM module or use the standalone browserified version where the 'Accounts' object is global.

```javascript
var Accounts = require('ethereumjs-accounts');
var accounts = new Accounts({minPassphraseLength: 6}); // or new Accounts(..) if using dist.

// Generate a new account encrypted with a passphrase
var accountObject = accounts.new('myPassphrase');

/* console.log(accountsObject); // returns {accountObject}:
{
  "address": "0x169aab499b549eac087035e640d3f7d882ef5e2d",
  "encrypted": true,
  "locked": true,
  "hash": "342f636d174cc1caa49ce16e5b257877191b663e0af0271d2ea03ac7e139317d",
  "private": "U2FsdGVkX19ZrornRBIfl1IDdcj6S9YywY8EgOeOtLj2DHybM/CHL4Jl0jcwjT+36kDnjj+qEfUBu6J1mGQF/fNcD/TsAUgGUTEUEOsP1CKDvNHfLmWLIfxqnYHhHsG5",
  "public": "U2FsdGVkX19EaDNK52q7LEz3hL/VR3dYW5VcoP04tcVKNS0Q3JINpM4XzttRJCBtq4g22hNDrOR8RWyHuh3nPo0pRSe9r5AUfEiCLaMBAhI16kf2KqCA8ah4brkya9ZLECdIl0HDTMYfDASBnyNXd87qodt46U0vdRT3PppK+9hsyqP8yqm9kFcWqMHktqubBE937LIU0W22Rfw6cJRwIw=="
}
*/

// Get and decrypt an account stored in browser
var accountObject = accounts.get('0x169aab499b549eac087035e640d3f7d882ef5e2d', 'myPassphrase');

/* console.log(accountsObject); // returns {accountObject} unlocked:
{
  "address": "0x169aab499b549eac087035e640d3f7d882ef5e2d",
  "encrypted": true,
  "locked": false,
  "hash": "342f636d174cc1caa49ce16e5b257877191b663e0af0271d2ea03ac7e139317d",
  "private": "beab6210b7bbcc121c941832c9f944e7e755a836a23b23ee239b8f9a495c95f3",
  "public": "72f4b266d09f8b00a175a65e2448911c62680d18c9493a841f2b97ed61c187dad658a77ae9fdc61012a7064fdce0d2952cd0bdd04e00bc812e71efd8e0bc7e1e"
}
*/

// Return all accounts stored in browser
var account_list = accounts.get();

// Integrate with web3. See: https://github.com/ConsenSys/hooked-web3-provider
var provider = new HookedWeb3Provider({
  host: "http://localhost:8545",
  transaction_signer: accounts
});
web3.setProvider(provider);

```

## API

- [`Accounts`](#accounts)
    - [`new Accounts([options])`](#new-accounts)
    - [`Accounts` Properties](#accounts-properties)
        - [`Accounts.length`](#property-length) 
    - [`Accounts` Methods](#accounts-methods)
        - [`Accounts.new(passphrase)`](#method-new) 
        - [`Accounts.get(address[, passphrase])`](#method-get) 
        - [`Accounts.set(address, accountObject)`](#method-set) 
        - [`Accounts.isPassphrase(passphrase)`](#method-isPassphrase) 
        - [`Accounts.list()`](#method-list) 
        - [`Accounts.remove(address)`](#method-remove) 
        - [`Accounts.clear()`](#method-clear) 
        - [`Accounts.contains(address)`](#method-clear) 
        - [`Accounts.import()`](#method-import) 
        - [`Accounts.export()`](#method-export) 
        - [`Accounts.backup()`](#method-backup) 
        - [`Accounts.hasAddress(address, callback)`](#hasAddress)
        - [`Accounts.signTransaction(tx_params, callback)`](#signTransaction)
        
## Browserify

You may browserify ethereumjs-accounts, by installing the npm modules `npm install` and then running the browserify CMD below. Please refer to the examples to see how a standalone browserified version is setup and used.

```
$ browserify --s Accounts index.js -o dist/ethereumjs-accounts.js
```

## Components

* [underscore.js](http://underscorejs.org) v1.8.3
* [localstorejs](https://github.com/SilentCicero/LocalStore)  v0.1.9
* [ethereumjs-tx](https://github.com/ethereum/ethereumjs-tx) v0.2.3
* [browserify-cryptojs](https://github.com/fahad19/crypto-js/) v0.3.1
* [bignumber.js](https://github.com/MikeMcl/bignumber.js/) ^2.0.7
* [jszip](https://stuk.github.io/jszip/) ^2.5.0
* [node-safe-filesaver](https://github.com/domderen/FileSaver.js) ^0.1.0

## Security

This module uses the browser cyrptojs module to generate random alphanumeric characters. The security of this module as a safe source of random number generation is still not clear.

This module uses standardized AES encryption to encrypt the private and public keys of accounts before they are stored in browser storage. A hash is made that concats the public and private keys together in order to verify account decryption.

While localStore is known to be relatively secure, there is still a chance that browser extensions or third-party software could access the raw data. If a password is provided, this module will encrypt the private and public keys with AES before it is stored in the browsers local storage.

As stated previously, the security of this module is still unknown, and I do not in any way guarantee it to be secure or ready for production use.

## Licence

Released under the MIT License, see LICENSE file.
