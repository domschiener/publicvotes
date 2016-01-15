Router.route('/', {
  template: 'main'
});

Router.route('/polls', {
  name: 'polls',
  template: 'all_polls'
});

Router.route('/vote/:_id', {
  name: 'vote',
  template: 'vote',
  data: function() {
    poll: {
      //TODO: Instead of storing ID in Session, store the actual vote
      var current_poll = poll.findOne({_id: this.params._id});
      return current_poll;
    }
  },
  onBeforeAction: function() {
    var vote_id = this.params._id;
    var current_poll = poll.findOne({_id: this.params._id});
    if (current_poll) {
      if (current_poll.poll.isvoted === true) {
        var route = "/vote/" + vote_id + "/voted";
        Router.go(route);
      }

      Meteor.call('already_voted', vote_id, function(error, success) {
        if(success) {
          var route = "/vote/" + vote_id + "/voted";
          Router.go(route);
        }
      });
    }
    this.next();
  }
});

Router.route('/vote/:_id/voted', {
  name: 'voted',
  template: 'voted',
  data: function() {
    poll: {
      //TODO: Instead of storing ID in Session, store the actual vote
      var current_poll = poll.findOne({_id: this.params._id});
      return current_poll;
    }
  },
  onBeforeAction: function() {
    var cont = this.next;
    var vote_id = this.params._id;
    var current_poll = poll.findOne({_id: this.params._id});
    if (current_poll) {
      if (current_poll.poll.isvoted) {
        cont();
      }
      else {
        Meteor.call('already_voted', vote_id, function(error, success) {
          if (success) {
            cont();
          }
          else {
            var route = "/vote/" + vote_id;
            Router.go(route);
          }
        });
      }
    }

    cont();
  }
});
