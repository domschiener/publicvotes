import { Meteor } from 'meteor/meteor';
import { Polls } from '/lib/imports/collections/polls';


Meteor.publish('polls.find', function() {
    return Polls.find();
});

Meteor.publish('polls.findOne', function(pollId) {
    return Polls.findOne({ _id: pollId });
});
