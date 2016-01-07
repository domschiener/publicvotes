# OpenVotes Meteor Setup

This describes the file structure as well as the dependencies which are used for the OpenVotes voting platform.


## Ethereum JSON RPC

In order for OpenVotes to function, we need to have an Ethereum node with the JSON RPC enabled. We are using the standard port, `port 8545`. To start the JSON RPC in the Go Client, you can run the following command (if you are using the C++ or the Python client, you can find the correct command on the [Ethereum Wiki](https://github.com/ethereum/wiki/wiki/JSON-RPC)):

```
geth --rpc --rpcaddr="localhost" --rpcport="8545" --rpccorsdomain="http://localhost:3000"
```


## Dependencies

```
iron:router
twbs:bootstrap
hilios:jquery.countdown
maazalik:highcharts
ethereum:web3                          --- version 0.13.0
silentcicero:ethjs                     --- Modified local package of ethereumjs-accounts
silentcicero:hooked-web3-provider      --- version 0.0.3
```


## File Structure

- **/client**
  - /libraries
    - *home:* Contains the Client Side .js files for the homepage
    - *polls:* Contains the Client Side .js files for the polls-related pages
  - /stylesheets
    - *home:* Contains the stylesheets for the homepage
    - *polls:* Contains the stylesheets for the polls-related pages
  - /templates
    - *home:* Contains the templates files for the homepage
    - *polls:* Contains the templates files for the polls-related pages
  - /subscribed.js
    - Contains all subscriptions

- **/shared**
  - *routes.js:* Contains the specified routes

- **/packages**
  - Contains a modified version of silentcicero's ethereumjs module

- **/public**
  - Contains images and fonts used for the website

- **/server**
  - Contains server side functionality and publications to the client

- **/collections**
  - Contains three collections:
    - *polls:* Collection of all poll related meta-data and casted votes
    - *Uservotes:* Contains IP-addresses that votes on a specific poll (used for redirecting)
    - *EthAccounts:* Contains the Ethereum-related accounts which are sent to the browser for signing transactions
