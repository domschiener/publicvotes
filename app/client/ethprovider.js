var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var accounts = new Accounts();
/**var provider = new HookedWeb3Provider({
  host: "http://localhost:8545",
  transaction_signer: accounts // transaction_signer must implement signTransaction() and hasAddress()
});
web3 = new Web3.providers.HttpProvider(provider);**/
