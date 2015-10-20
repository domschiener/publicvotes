var accounts;
var min_balance;
var ethaccount;

Template.vote.onRendered(function(){
  accounts = new Accounts({minPassphraseLength: 6});

  accounts.import('{"0x7731d6e987f9f7446b9cc4ae6f2e64522e8acdef":{"address":"0x7731d6e987f9f7446b9cc4ae6f2e64522e8acdef","encrypted":true,"locked":false,"hash":"81440692271c6630f77ce01678c7d2e2eed3289d6ea26a791f92d927bf95e638","private":"362c2d58f933aa0ec14803c9f9c6b64edfcb3c4499f3040791750dd9fc4c9495","public":"d5c3dbd482dac10ee5974a9aafb5bf70674e5c3343bc78e70fdc99f3ad0e8b2e6a47268c5149647d509504da729e4c0d08fe8ce885fb486abe8b9333d8c1fbf2"},"selected":"0x7731d6e987f9f7446b9cc4ae6f2e64522e8acdef"}');
  //passphrase = generatePassword();
  //ethaccount = accounts.new(passphrase);
  ethaccount = accounts.get('0x7731d6e987f9f7446b9cc4ae6f2e64522e8acdef');
  //console.log(ethaccount);**/
});

Template.registerHelper("option_count", function(count) {
  if (count == 2) {
    return "true";
  }
});

Template.vote.helpers({
  single_option: function(index, options) {
    return options[index];
  }
});

Template.not_ready.helpers({
  contract_cost: function() {
    min_balance = 0.1;
    return min_balance;
  }
})

Template.vote.events({
  'click .option_click': function(event) {
    var current_poll = Session.get('current_poll');
    Meteor.call('get_accounts', current_poll._id, function(error,success){
      accounts.clear();
      accounts.import(success.account)
      var unlocked = accounts.get(success.address)
      var abi = success.contract_abi;
      var address = success.contract_address;
      var contract = web3.eth.contract(abi).at(address);
      var option = "0x657468657265756d00000000000000";//web3.fromAscii(event.target.id);

      var gaspriced1 = web3.eth.gasPrice;
      var gaspriced = gaspriced1.toString(10);
      //console.log(contract.votes());
      //var voted = contract.vote(option);
      //console.log(voted);

      contract.vote.sendTransaction(option, {from: success.address, account: unlocked, gas: 200000, gasPrice: gaspriced}, function(error,success) {
        console.log(success,error);
        console.log(contract.votes());
        //TODO: Make transaction with account
        /**Meteor.call('post_vote', current_poll._id, event.target.id, function(error, success){
          if(success) {
            var route = "/vote/" + current_poll._id + "/voted";
            Router.go(route);
          }
        });**/
      })
    });
  },
  'click .get_address': function() {
    var current_poll = Session.get('current_poll');

    //TODO: Include preformated transaction for client

    if(current_poll.address) {
      var element = document.getElementById('eth_address');
      element.innerHTML = "<input type='text' class='form-control' style='margin:0 auto; width:280px;' value='" + current_poll.address + "'></input>"
    }
    else {
      function generatePassword() {
          var length = 12,
              charset = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*'#-.,;:_!$%&/()=?'{}[]+",
              retVal = "";
          for (var i = 0, n = charset.length; i < length; ++i) {
              retVal += charset.charAt(Math.floor(Math.random() * n));
          }
          return retVal;
      }
      //var passphrase = generatePassword();
      //var ethaccount = accounts.new(passphrase);
      //var unlocked = accounts.get(ethaccount['address'],passphrase);
      var unlocked = ethaccount;

      var exported1 = '{"' + ethaccount['address'] + '":';
      var exported2 = JSON.stringify(unlocked);
      var exported3 = ',"selected":"' + ethaccount['address'] + '"}';
      var exported = exported1 + exported2 + exported3;
      console.log(unlocked);
      Meteor.call('store_account', this._id, ethaccount['address'], min_balance, exported, function(error, success) {
        if(success) {
          var element = document.getElementById('eth_address');
          element.innerHTML = "<input type='text' class='form-control' style='margin:0 auto; width:280px;' value='" + ethaccount['address'] + "'></input>"
        }
      });
    }
  },
  'click .start_poll': function() {
    var current_poll = Session.get('current_poll');
    Meteor.call('get_accounts', this._id, function(error,success) {
      $('.start_poll').addClass('disabled');
      var element = document.getElementById('patience');
      element.innerHTML = "<h7>Received your request, this could take a few minutes.</h7>"
      accounts.import(success.account);
      var unlocked = accounts.get('0x7731d6e987f9f7446b9cc4ae6f2e64522e8acdef');
      var gaspriced1 = web3.eth.gasPrice;
      var gaspriced = gaspriced1.toString(10);

      var cur_date = Date.now();
      var days = (current_poll.poll.limit_days) * 86400000;
      var hours = (current_poll.poll.limit_hours) * 3600000;
      var _deadline = cur_date + days + hours;

      var _options = JSON.stringify(current_poll.poll.options);
      var _votelimit = current_poll.poll.vote_limit;
      var _title = current_poll.poll.name;

      var newpollContract = web3.eth.contract([{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"votes","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":false,"inputs":[],"name":"endPoll","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"p","outputs":[{"name":"owner","type":"address"},{"name":"title","type":"string"},{"name":"votelimit","type":"uint256"},{"name":"options","type":"string"},{"name":"deadline","type":"uint256"},{"name":"status","type":"bool"},{"name":"numvotes","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"choice","type":"bytes32"}],"name":"vote","outputs":[{"name":"","type":"bool"}],"type":"function"},{"inputs":[{"name":"_options","type":"string"},{"name":"_title","type":"string"},{"name":"_votelimit","type":"uint256"},{"name":"_deadline","type":"uint256"}],"type":"constructor"}]);
      var newpoll = newpollContract.new(
         _options,
         _title,
         _votelimit,
         _deadline,
         {
           from: unlocked['address'],
           account: unlocked,
           data: '60606040526040516106b73803806106b7833981016040528080518201919060200180518201919060200180519060200190919080519060200190919050505b33600160005060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055508360016000506003016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100c557805160ff19168380011785556100f6565b828001600101855582156100f6579182015b828111156100f55782518260005055916020019190600101906100d7565b5b5090506101219190610103565b8082111561011d5760008181506000905550600101610103565b5090565b50508260016000506001016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061017857805160ff19168380011785556101a9565b828001600101855582156101a9579182015b828111156101a857825182600050559160200191906001019061018a565b5b5090506101d491906101b6565b808211156101d057600081815060009055506001016101b6565b5090565b505081600160005060020160005081905550806001600050600401600050819055506001600160005060050160006101000a81548160ff0219169083021790555060006001600050600601600050819055505b5050505061047e806102396000396000f360606040526000357c0100000000000000000000000000000000000000000000000000000000900480635df813301461005a5780638d99b2eb146100865780639ae8886a146100a9578063a69beaba1461021057610058565b005b61007060048080359060200190919050506103ec565b6040518082815260200191505060405180910390f35b6100936004805050610359565b6040518082815260200191505060405180910390f35b6100b66004805050610411565b604051808873ffffffffffffffffffffffffffffffffffffffff16815260200180602001878152602001806020018681526020018581526020018481526020018381038352898181546001816001161561010002031660029004815260200191508054600181600116156101000203166002900480156101775780601f1061014c57610100808354040283529160200191610177565b820191906000526020600020905b81548152906001019060200180831161015a57829003601f168201915b50508381038252878181546001816001161561010002031660029004815260200191508054600181600116156101000203166002900480156101fa5780601f106101cf576101008083540402835291602001916101fa565b820191906000526020600020905b8154815290600101906020018083116101dd57829003601f168201915b5050995050505050505050505060405180910390f35b610226600480803590602001909190505061023c565b6040518082815260200191505060405180910390f35b6000600160005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415806102b757506001600160005060050160009054906101000a900460ff1614155b156102c55760009050610354565b816000600050600160005060060160005054815481101561000257906000526020600020900160005b508190555060016000506006016000818150548092919060010191905055506000600160005060020160005054111561034b5760016000506002016000505460016000506006016000505410151561034a57610348610359565b505b5b60019050610354565b919050565b6000600160005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156103c157600090506103e9565b6000600160005060050160006101000a81548160ff02191690830217905550600190506103e9565b90565b600060005081815481101561000257906000526020600020900160005b915090505481565b60016000508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690806001016000509080600201600050549080600301600050908060040160005054908060050160009054906101000a900460ff1690806006016000505490508756',
           gas: 800000,
           gasPrice: gaspriced
         }, function(e, contract){
          if (typeof contract.address != 'undefined') {
            console.log('Contract mined! address: ' + contract.address);

            var contractAbi = [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"votes","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":false,"inputs":[],"name":"endPoll","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"p","outputs":[{"name":"owner","type":"address"},{"name":"title","type":"string"},{"name":"votelimit","type":"uint256"},{"name":"options","type":"string"},{"name":"deadline","type":"uint256"},{"name":"status","type":"bool"},{"name":"numvotes","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"choice","type":"bytes32"}],"name":"vote","outputs":[{"name":"","type":"bool"}],"type":"function"},{"inputs":[{"name":"_options","type":"string"},{"name":"_title","type":"string"},{"name":"_votelimit","type":"uint256"},{"name":"_deadline","type":"uint256"}],"type":"constructor"}]


            Meteor.call('make_live', contractAbi, contract.address, current_poll._id, cur_date, _deadline);
          }
       });
     })
  }
});
