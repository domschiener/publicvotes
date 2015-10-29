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

- **/both**
  - Contains a collection called "poll", which stores all the basic information about all the polls

- **/client**
  - /libraries
    - Client side .js files
  - /stylesheets
    - CSS Stylesheets
  - /templates
    - HTML Templates for the website

- **/lib**
  - Contains the specified routes

- **/packages**
  - Contains a modified version of silentcicero's ethereumjs module

- **/public**
  - Contains images and fonts used for the website

- **/server**
  - Contains server side functionality and collections
