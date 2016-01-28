var accounts = new Accounts({minPassphraseLength: 6});
var min_balance;
var ethaccount;

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
    min_balance = 0.2;
    return min_balance;
  }
});

Template.vote.events({
  'click .option_click': function(event) {
    var current_poll = $(event.currentTarget).attr('pollid');
    Meteor.call('get_accounts', current_poll, function(error,success){
      accounts.clear();
      accounts.import(success.account)
      var unlocked = accounts.get(success.address)
      var abi = success.contract_abi;
      var address = success.contract_address;
      var contract = web3.eth.contract(abi).at(address);
      var option = event.target.id;

      var gasprice = web3.eth.gasPrice.toString(10);

      contract.vote(option, {from: success.address, account: unlocked, gas: 200000, gasPrice: gasprice}, function(error,success) {
        if(success) {
          Meteor.call('post_vote', current_poll, event.target.id, function(error, success){
            if(success) {
              var route = "/vote/" + current_poll + "/voted";
              Router.go(route);
            }
          });
        }
      })
    });
  },
  'click .get_address': function() {
    var current_poll = this;

    // TODO: Include preformated transaction for client
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
      var passphrase = generatePassword();
      var ethaccount = accounts.new(passphrase);
      var unlocked = accounts.get(ethaccount['address'], passphrase);

      var exported1 = '{"' + ethaccount['address'] + '":';
      var exported2 = JSON.stringify(unlocked);
      var exported3 = ',"selected":"' + ethaccount['address'] + '"}';
      var exported = exported1 + exported2 + exported3;

      Meteor.call('store_account', this._id, ethaccount['address'], exported, function(error, success) {
        if(success) {
          var element = document.getElementById('eth_address');
          element.innerHTML = "<input type='text' class='form-control' style='margin:0 auto; width:280px;' value='" + ethaccount['address'] + "'></input>"
        }
      });
    }
  },
  'click .start_poll': function() {
    var current_poll = this;
    Meteor.call('get_accounts', this._id, function(error,success) {
      $('.start_poll').addClass('disabled');
      var element = document.getElementById('patience');
      element.innerHTML = "<h7>Received your request, this could take a few minutes.</h7>";
      accounts.import(success.account);
      var unlocked = accounts.get(success.address);
      var gasprice = web3.eth.gasPrice.toString(10);
      var cur_date = Date.now();
      var days = (current_poll.poll.limit_days) * 86400000;
      var hours = (current_poll.poll.limit_hours) * 3600000;

      var _deadline = cur_date + days + hours;
      var _options = JSON.stringify(current_poll.poll.options);
      var _votelimit = current_poll.poll.vote_limit;
      var _title = current_poll.poll.name;

      var newpollContract = web3.eth.contract([{"constant":false,"inputs":[],"name":"endPoll","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"p","outputs":[{"name":"owner","type":"address"},{"name":"title","type":"string"},{"name":"votelimit","type":"uint256"},{"name":"options","type":"string"},{"name":"deadline","type":"uint256"},{"name":"status","type":"bool"},{"name":"numVotes","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"choice","type":"string"}],"name":"vote","outputs":[{"name":"","type":"bool"}],"type":"function"},{"inputs":[{"name":"_options","type":"string"},{"name":"_title","type":"string"},{"name":"_votelimit","type":"uint256"},{"name":"_deadline","type":"uint256"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"votechoice","type":"string"}],"name":"NewVote","type":"event"}]);
      var newpoll = newpollContract.new(
         _options,
         _title,
         _votelimit,
         _deadline,
         {
           from: unlocked['address'],
           account: unlocked,
           data: '60606040526040516106f93803806106f9833981016040528080518201919060200180518201919060200180519060200190919080519060200190919050505b33600060005060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055508360006000506003016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100c557805160ff19168380011785556100f6565b828001600101855582156100f6579182015b828111156100f55782518260005055916020019190600101906100d7565b5b5090506101219190610103565b8082111561011d5760008181506000905550600101610103565b5090565b50508260006000506001016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061017857805160ff19168380011785556101a9565b828001600101855582156101a9579182015b828111156101a857825182600050559160200191906001019061018a565b5b5090506101d491906101b6565b808211156101d057600081815060009055506001016101b6565b5090565b505081600060005060020160005081905550806000600050600401600050819055506001600060005060050160006101000a81548160ff0219169083021790555060006000600050600601600050819055505b505050506104c0806102396000396000f360606040526000357c0100000000000000000000000000000000000000000000000000000000900480638d99b2eb1461004f5780639ae8886a14610072578063fc36e15b146101d95761004d565b005b61005c600480505061042d565b6040518082815260200191505060405180910390f35b61007f6004805050610243565b604051808873ffffffffffffffffffffffffffffffffffffffff16815260200180602001878152602001806020018681526020018581526020018481526020018381038352898181546001816001161561010002031660029004815260200191508054600181600116156101000203166002900480156101405780601f1061011557610100808354040283529160200191610140565b820191906000526020600020905b81548152906001019060200180831161012357829003601f168201915b50508381038252878181546001816001161561010002031660029004815260200191508054600181600116156101000203166002900480156101c35780601f10610198576101008083540402835291602001916101c3565b820191906000526020600020905b8154815290600101906020018083116101a657829003601f168201915b5050995050505050505050505060405180910390f35b61022d6004808035906020019082018035906020019191908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509090919050506102b0565b6040518082815260200191505060405180910390f35b60006000508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690806001016000509080600201600050549080600301600050908060040160005054908060050160009054906101000a900460ff16908060060160005054905087565b6000600060005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614158061032b57506001600060005060050160009054906101000a900460ff1614155b156103395760009050610428565b600160006000506006016000828282505401925050819055507f24bcf19562365f6510754002f8d7b818d275886315d29c7aa04785570b97a3638260405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156103d45780820380516001836020036101000a031916815260200191505b509250505060405180910390a16000600060005060020160005054111561041f5760006000506002016000505460006000506006016000505410151561041e5761041c61042d565b505b5b60019050610428565b919050565b6000600060005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561049557600090506104bd565b6000600060005060050160006101000a81548160ff02191690830217905550600190506104bd565b9056',
           gas: 800000,
           gasPrice: gasprice
         }, function(e, contract){
          if (typeof contract.address != 'undefined') {
            console.log('Contract mined! address: ' + contract.address);
            var blocknum = web3.eth.blockNumber;

            var contractAbi = [{"constant":false,"inputs":[],"name":"endPoll","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"p","outputs":[{"name":"owner","type":"address"},{"name":"title","type":"string"},{"name":"votelimit","type":"uint256"},{"name":"options","type":"string"},{"name":"deadline","type":"uint256"},{"name":"status","type":"bool"},{"name":"numVotes","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"choice","type":"string"}],"name":"vote","outputs":[{"name":"","type":"bool"}],"type":"function"},{"inputs":[{"name":"_options","type":"string"},{"name":"_title","type":"string"},{"name":"_votelimit","type":"uint256"},{"name":"_deadline","type":"uint256"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"votechoice","type":"string"}],"name":"NewVote","type":"event"}]

            Meteor.call('make_live', contractAbi, contract.address, current_poll._id, blocknum, cur_date, _deadline);
          }
       });
    });
  }
});
