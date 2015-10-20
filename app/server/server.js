var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

Meteor.publish('poll_listings', function() {
  //TODO: Subscribe only to active and public polls
  return poll.find();
});

var accountstowatch = [];

Meteor.startup(function() {
  //for each poll, set the deadline on server startup
  function polldeadline(poll_input, _current_date) {
    var current_poll = poll_input;
    var current_date = _current_date;
    var timer = false;
    timer = Meteor.setTimeout(function() {
      console.log("ID:" + current_poll._id + " Name: " + current_poll.poll.name + "went offline!");
      poll.update({_id:current_poll._id}, {$set: {'poll.isvoted': true, 'poll.isactive':false}});

    },(current_poll.endDate[0] - current_date));
    numtimers += 1;
    console.log("New timer set for Poll: " + current_poll._id);
  }

  //TODO: check if this works
  var active_polls = poll.find({'poll.isactive':true}).fetch();
  for (var i = 0; i < active_polls.length; i++) {
    var current_poll = active_polls[i];
    var current_date = Date.now();

    if (current_poll.endDate[0] <= current_date) {
      console.log("ID:" + current_poll._id + " Name: " + current_poll.poll.name + "went offline!");
      poll.update({_id:current_poll._id}, {$set: {'poll.isvoted': true, 'poll.isactive':false}});
    }
    else {
      polldeadline(current_poll,current_date);
    }
  }

  notreadypolls = poll.find({'poll.ready':false, address:{$exists:true}}).fetch()
  for (var i = 0; i < notreadypolls.length; i++) {
    accountstowatch.push(notreadypolls[i]);
  }

  Meteor.setInterval(function(){
    for (var i = 0; i < accountstowatch.length; i++) {
      var current_poll = accountstowatch[i]
      var pub_address = current_poll.address;
      var balance = web3.eth.getBalance(pub_address);
      var balance_wei = balance.toString(10);
      var balance_eth = web3.fromWei(balance_wei, "ether");

      test += 2;
      if (balance_eth >= 0.2) {
        console.log("Poll: " + current_poll._id + " is ready to go live!");
        poll.update({_id:current_poll._id}, {$set:{'poll.ready':true}});
      }
    }
    console.log("No polls went live");
  },180000)
});

Meteor.methods({
  post_data: function(data) {
    return poll.insert({ poll: data, createdAt: new Date() }, function(error, success) {
      //TODO More rigorous error checking when failed to insert
      return success;
    });
  },
  post_vote: function(poll_id, vote) {
    var current_poll = poll.findOne({_id:poll_id});
    var vote_limit = current_poll.poll.vote_limit;

    if (current_poll.votes) {
      if (vote_limit == current_poll.votes.length + 1) {
        poll.update({_id:poll_id}, {$set: {'poll.isvoted': true, 'poll.isactive':false}});
      }
    }
    //Uservotes.insert({ _id: poll_id, votes: {connection: this.connection.clientAddress}});
    return poll.update({_id:poll_id}, {$push: {votes: vote}});
  },
  get_accounts: function(poll_id) {
    return EthAccounts.findOne({_id:poll_id});
  },
  store_account: function(poll_id, pubaddress, accounts) {
    poll.update({_id:poll_id}, {$set:{address:pubaddress}});
    accountstowatch.push(poll.findOne({_id:poll_id}));
    return EthAccounts.insert({_id:poll_id, address: pubaddress, account: accounts});
  },
  make_live: function(abi, address, poll_id, start_date, end_date) {
    EthAccounts.update({_id:poll_id},{$set:{contract_abi:abi, contract_address:address}});
    poll.update({_id:poll_id}, {$set: {'poll.isactive': true, startDate: start_date, endDate: end_date}});

    Meteor.setTimeout(function() {
      console.log("ID: " + current_poll._id + " went offline!");
      poll.update({_id:poll_id}, {$set: {'poll.isvoted': true, 'poll.isactive':false}});
    },(end_date - start_date));
    console.log("New timer set for Poll: " + poll_id);
  },
  already_voted: function(poll_id) {
    return Uservotes.findOne({_id:poll_id, votes:{connection:this.connection.clientAddress}});
  }
});
