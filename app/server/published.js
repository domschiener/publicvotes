Meteor.publish('pollListings', function() {
  return poll.find({});
});
