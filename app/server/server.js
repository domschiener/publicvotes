web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

Meteor.publish('poll_listings', function() {
  //TODO: Subscribe only to active and public polls
  return poll.find();
});

var accountstowatch = [];

Meteor.startup(function() {
  //process.env.HTTP_FORWARDED_COUNT = 1;

  function polldeadline(poll_input, _current_date) {
    var current_poll = poll_input;
    var current_date = _current_date;
    var timer = false;

    timer = Meteor.setTimeout(function() {
      console.log("ID:" + current_poll._id + " Name: " + current_poll.poll.name + " went offline!");
      poll.update({_id:current_poll._id}, {$set: {'poll.isvoted': true, 'poll.isactive':false}});
      //TODO: Make transaction that changes contract state
    },(current_poll.endDate - current_date));
    console.log("New timer set for Poll: " + current_poll._id);
  }

  //
  // set the deadline for each poll on server startup
  //
  var active_polls = poll.find({'poll.isactive':true}).fetch();
  for (var i = 0; i < active_polls.length; i++) {
    var current_poll = active_polls[i];
    var current_date = Date.now();
    if ((current_poll.endDate - current_date) <= 0) {
      console.log("ID:" + current_poll._id + " Name: " + current_poll.poll.name + " went offline!");
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

  //
  //  On Startup, setInterval for all Ethereum accounts to watch for incoming tx
  //  Interval set for every 2 minutes
  //
  Meteor.setInterval(function(){
    for (var i = 0; i < accountstowatch.length; i++) {
      var current_poll = accountstowatch[i];
      var pub_address = current_poll.address;
      var balance = web3.eth.getBalance(pub_address);
      var balance_wei = balance.toString(10);
      var balance_eth = web3.fromWei(balance_wei, "ether");

      // If a poll is not ready after 7 days, we remove it
      if (current_poll.createdAt + 1000 * 60 * 60 * 24 * 7 <= Date.now()) {
        poll.remove({_id: current_poll._id});
      }

      if (balance_eth >= 0.2) {
        console.log("Poll: " + current_poll._id + " is ready to go live!");
        var index = accountstowatch.indexOf(i);
        accountstowatch.splice(index, 1);
        poll.update({_id:current_poll._id}, {$set:{'poll.ready':true}});
      }
    }
  }, 120000)
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
    var ip_connection = web3.sha3(this.connection.clientAddress);
    Uservotes.update({ _id: poll_id}, {$push: {connection: ip_connection}});
    return poll.update({_id:poll_id}, {$push: {votes: vote}});
  },
  get_accounts: function(poll_id) {
    check(poll_id, String);
    return EthAccounts.findOne({_id:poll_id});
  },
  store_account: function(poll_id, pubaddress, accounts) {
    poll.update({_id:poll_id}, {$set:{address:pubaddress}});
    accountstowatch.push(poll.findOne({_id:poll_id}));
    return EthAccounts.insert({_id:poll_id, address: pubaddress, account: accounts});
  },
  make_live: function(abi, address, poll_id, _block, start_date, end_date) {
    Uservotes.insert({ _id: poll_id});
    EthAccounts.update({_id:poll_id},{$set:{contract_abi:abi, contract_address:address}});
    poll.update({_id:poll_id}, {$set: {'poll.isactive': true, block: _block, startDate: start_date, endDate: end_date}});
    Meteor.setTimeout(function() {
      console.log("ID: " + poll_id + " went offline!");
      poll.update({_id:poll_id}, {$set: {'poll.isvoted': true, 'poll.isactive':false}});
    },(end_date - start_date));
    console.log("New timer set for Poll: " + poll_id);
  },
  already_voted: function(poll_id) {
    var ip_connection = web3.sha3(this.connection.clientAddress);
    return Uservotes.findOne({_id:poll_id, connection:ip_connection});
  }
});
