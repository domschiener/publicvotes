web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

Meteor.publish('poll_listings', function() {
  //TODO: Subscribe only to active and public polls
  return poll.find();
});

var timer = false;

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
        Meteor.clearTimeout(timer);
        poll.update({_id:poll_id}, {$set: {'poll.isvoted': true, 'poll.isactive':false}});
      }
    }
    //Uservotes.insert({ _id: poll_id, votes: {connection: this.connection.clientAddress}});
    return poll.update({_id:poll_id}, {$push: {votes: vote}});
  },
  get_accounts: function(poll_id) {
    return EthAccounts.findOne({_id:poll_id});
  },
  store_account: function(poll_id, pubaddress, balance_required, accounts, _current_poll) {
    var min_balance = balance_required;
    var pub_address = pubaddress;
    var test = balance_required;
    var current_poll = _current_poll;
    var balance_interval = false;

    balance_interval = Meteor.setInterval(function(){
      var balance = web3.eth.getBalance(pub_address);
      var balance_wei = balance.plus(21).toString(10);
      var balance_eth = web3.fromWei(balance_wei, "ether");
      console.log("New Poll", pub_address);
      if (balance_eth >= min_balance) {

        var cur_date = Date.now();
        var days = (current_poll.poll.limit_days) * 86400000;
        var hours = (current_poll.poll.limit_hours) * 3600000;
        var end_date = cur_date + days + hours;

        //TODO: only make life once the transaction has been made
        Meteor.call('make_live', current_poll._id, cur_date, end_date);
        Meteor.clearInterval(balance_interval);
      }
      /**test += 1;
      if (test >= 3) {
        console.log("Destroying", pub_address)
        var cur_date = Date.now();
        var days = (current_poll.poll.limit_days) * 86400000;
        var hours = (current_poll.poll.limit_hours) * 3600000;
        var end_date = cur_date + days + hours;

        Meteor.call('make_live', current_poll._id, cur_date, end_date);
        Meteor.clearInterval(balance_interval);
      }**/
    },120000)

    poll.update({_id:poll_id}, {$set:{address:pubaddress}});
    return EthAccounts.insert({_id:poll_id, address: pubaddress, account: accounts});
  },
  make_live: function(poll_id, start_date, end_date) {
    //TODO: Transaction with contract
    timer = Meteor.setTimeout(function() {
      console.log("Removed Poll");
      poll.update({_id:poll_id}, {$set: {'poll.isvoted': true, 'poll.isactive':false}});
      console.log(poll.findOne({_id:poll_id}));
    },(end_date - start_date));
    return poll.update({_id:poll_id}, {$set: {'poll.isactive': true}, $push: {startDate: start_date, endDate: end_date}});
  },
  already_voted: function(poll_id) {
    return Uservotes.findOne({_id:poll_id, votes:{connection:this.connection.clientAddress}});
  }
});
