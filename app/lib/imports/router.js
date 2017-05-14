import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/', {
    subscriptions: function(params) {
        this.register('thisPoll', Meteor.subscribe('polls.findOne', params._id));
    },
    action: function () {
        BlazeLayout.render("mainLayout");
    }
});


FlowRouter.route('/poll/:_id', {
    name: 'poll',
    subscriptions: function(params) {
        this.register('thisPoll', Meteor.subscribe('polls.findOne', params._id));
    },
    action: function () {
        BlazeLayout.render('vote');
    }
})
