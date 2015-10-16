var accounts = new Accounts({minPassphraseLength: 6});

Template.voted.onRendered(function(){
  /**console.log(accounts.get());
  var unlocekd = accounts.get("0xffebe5cfa9acb04556c1e4367aa371fd5117fc1f", 'supersleeckpassword540190121241512142');
  console.log(unlocekd);
  var gasPrice = 50000000000;
  console.log("here");
  web3.eth.sendTransaction({
    from: unlocekd['address'],
    account: unlocekd,
    to: '0xddf3ad76353810be6a89d731b787f6f17188612b',
    value: 1000000000000000000,
    gas: 3141592,
    gasPrice: gasPrice
  }, function(error,result) {
    console.log("Error", error);
    console.log("S", result);
  });
  Meteor.call('getaccounts', current_poll._id, function(error,success) {
    //accounts.import(success.account);
    var signer_acc = accounts.new('supersleeckpassword54019012124');
    var unlocekd = accounts.get(signer_acc['address'], 'supersleeckpassword54019012124');
    console.log(unlocekd);
    var gasPrice = 50000000000;
    accounts.signTransaction(unlocekd, {
      from: signer_acc['address'],
      to: '0xddf3ad76353810be6a89d731b787f6f17188612b',
      value: 1000000000000000000,
      gas: 3141592,
      gasPrice: gasPrice
    }, function(err, result) {
      console.log("Error", err);
      console.log("S", result);
      web3.eth.sendTransaction({data:result}, function(error,results){
        console.log("Error", error);
        console.log("S", results);
      });
    });
  });**/

  var timer = Session.get('timer')
  $('#countdown').countdown(timer, function(event) {
    $(this).html(event.strftime('%Dd %H:%M:%S'));
  });
});

Template.voted.helpers({
  vote_count: function() {
    var current_poll = Session.get('current_poll');
    if (current_poll.votes) {
      return current_poll.votes.length;
    }
    else {
      return 0;
    }
  },
  time_limit: function() {
    var current_poll = Session.get('current_poll');
    if (current_poll.poll.isvoted) {
      Session.set('timer','2015/01/01');
    }
    else {
      var end_date = new Date(current_poll.endDate[0]);
      var seconds = end_date.getSeconds();
      var minutes = end_date.getMinutes();
      var hours = end_date.getHours();
      var days = end_date.getUTCDate();
      var months = end_date.getMonth() + 1;
      var year = end_date.getFullYear();
      var final_date = year + '/' + months + '/' + days + ' ' + hours + ':' + minutes + ':' + seconds;

      Session.set('timer', final_date);
    }
  },
  topGenresChart: function() {
    var current_poll = Session.get('current_poll');
    var poll_options = current_poll.poll.options;

    var votes_counted = { };
    if (current_poll.votes) {
      for (var i = 0, j = current_poll.votes.length; i < j; i++) {
         votes_counted[current_poll.votes[i]] = (votes_counted[current_poll.votes[i]] || 0) + 1;
      }
    }

    var votes_full = [];
    for (var i = 0; i < poll_options.length; i++) {
      var option = poll_options[i];
      if (votes_counted[option]) {
        votes_full.push(votes_counted[option]);
      }
      else {
        votes_full.push(0);
      }
    }

    return {
        chart: {
            backgroundColor: '#3A4156',
            type: 'bar',
        },
        title: {
          text: ''
        },
        xAxis: {
            categories: poll_options,
            labels: {
              style: {
                fontSize: '16px',
                color: '#fff'
              }
            }
        },
        yAxis: {
            min: 0,
            allowDecimals: false,
            labels: {
                overflow: 'justify',
                style: {
                  fontSize: '13px',
                  color: '#fff'
                },
            },
            title: {
              text: ''
            },
            gridLineColor: 'transparent',
            lineColor: 'transparent'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            data: votes_full,
            color: '#2ecc71',
            name: 'Votes',
            showInLegend: false,
            dataLabels: {
              enabled: true,
              color: '#fff',
              style: {
                fontSize: '16px'
              }
            }
        }]
      }
    }
});
