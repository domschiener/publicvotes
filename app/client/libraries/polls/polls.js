Template.all_polls.helpers({
  countpolls: function() {
    return (poll.find({'poll.isvoted': false, 'poll.isactive':true}).count() > 0);
  },
  live_polls: function() {
    return poll.find({'poll.ready':true, 'poll.isvoted': false, 'poll.isactive':true, "poll.public":true}, {sort: {createdAt: -1}}).fetch();
  },
  past_polls: function() {
    return poll.find({'poll.ready':true, 'poll.isvoted': true, 'poll.isactive':false, "poll.public":true}, {sort: {createdAt: -1}}).fetch();
  },
  get_votes: function() {
    var cur_poll = this;
    var vote_limit = cur_poll.poll.vote_limit;

    if (cur_poll.votes) {
      if (vote_limit) {
        return cur_poll.votes.length + "/" + vote_limit;
      }
      else {
        return cur_poll.votes.length;
      }
    }
    else {
      if (vote_limit) {
        return "0 /" + vote_limit;
      }
      else {
        return 0
      }
    }
  }
});
