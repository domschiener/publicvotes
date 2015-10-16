TODO:
- Delete all polls that are not live after 48 hours (simple script that runs in the back). Don't forget to destroy the IntervalScripts
- Create a separate script that turns the polls off
- IPFS Integration
- Remove Timelimit so that polls can go on for unlimited time. Requires faucet to work.

Questions:
- Is it better for the client or the server to send the transactions?
- What is a more efficient way to determine if an account has received a specific amount of Ether? Right now I'm pretty much setting up background operations that constantly check if the specified addresses have a certain balance, and I don't really think that this is super efficient.
-Make poll system more decentralized i.e. make poll limit and timelimit through Blockchain. Determine if Poll is live by making a call to the contract

geth --rpc --rpcaddr="localhost" --unlock=1 --rpcport="8545" --rpccorsdomain="http://localhost:3000"
