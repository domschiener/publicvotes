var accounts;
var min_balance;

Template.vote.onRendered(function(){
  accounts = new Accounts({minPassphraseLength: 6});
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
    min_balance = 0.5;
    return min_balance;
  }
})

Template.vote.events({
  'click .option_click': function(event) {
    var current_poll = Session.get('current_poll');
    Meteor.call('get_accounts', current_poll._id, function(error,success){
      accounts.clear();
      accounts.import(success.account)
      //TODO: MAke transaction with account
      if(event.target.id) {
        Meteor.call('post_vote', current_poll._id, event.target.id, function(error, success){
          if(success) {
            var route = "/vote/" + current_poll._id + "/voted";
            Router.go(route);
          }
        });
      }
    });
  },
  'click .get_address': function() {
    var current_poll = Session.get('current_poll');
    function generatePassword() {
        var length = 12,
            charset = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*'#-.,;:_!$%&/()=?'{}[]+",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }
    //TODO: Include preformated transaction for client

    if(current_poll.address) {
      var element = document.getElementById('eth_address');
      element.innerHTML = "<input type='text' class='form-control' style='margin:0 auto; width:280px;' value='" + current_poll.address + "'></input>"
    }
    else {
      accounts.clear()
      var passphrase = generatePassword();
      var ethaccount = accounts.new(passphrase);
      var unlocked = accounts.get(ethaccount['address'],passphrase);

      var exported1 = '{"' + ethaccount['address'] + '":';
      var exported2 = JSON.stringify(unlocked);
      var exported3 = ',"selected":"' + ethaccount['address'] + '"}';
      var exported = exported1 + exported2 + exported3;
      console.log("Exported", exported);
      console.log(accounts.get());

      Meteor.call('store_account', this._id, ethaccount['address'], min_balance, exported, current_poll, function(error, success) {
        if(success) {
          var element = document.getElementById('eth_address');
          element.innerHTML = "<input type='text' class='form-control' style='margin:0 auto; width:280px;' value='" + ethaccount['address'] + "'></input>"
        }
      });
    }
  }
});
