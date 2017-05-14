import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './create.html';

Template.create.events({
    // When the user submits a new poll
    'click #submit': function() {

        event.preventDefault();

        const num_options = Session.get('NumberOfOptions');

        const poll = {
            'name':         '',
            'description':  '',
            'options':      '',
            'public':       false,
            'vote_limit':   0,
            'isactive':     false,
            'isvoted':      false,
            'ready':        false,
            'limit_hours':  0,
            'limit_days':   0
        }

        poll.name= $('#name_poll').val();
        poll.description = $('#description').val();

        let option = [];

        // Get the list of options the user chose
        for (var i = 1; i <= num_options; i++) {
            let element_id = "#option-" + i;
            option.push($(element_id).val());
        }

        poll.options = option;
        poll.public = $('#public_poll_switch').is(":checked");
        poll.vote_limit = parseInt($('#vote_limit').val());

        let hours = $('#hour_limit option:selected').text();
        let days = $('#day_limit option:selected').text();

        poll.limit_hours = parseInt(hours.match(/\d+/)[0]);
        poll.limit_days = parseInt(days.match(/\d+/)[0]);

        // SEND DATA TO SERVER
        console.log(poll);
        console.log(typeof poll.vote_limit);

        Meteor.call('polls.insert', poll, function( e, pollId ) {

            if (e) throw e;

            FlowRouter.go('poll', { _id: pollId })
        })
    }
});
