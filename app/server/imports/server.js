import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { addressGenerator } from '/server/imports/helpers/iotaAddress';

import { Polls } from '/lib/imports/collections/polls';

Meteor.methods({

    // Insert a new user poll into MongoDB
    'polls.insert'(pollData) {

        // Validity inputs check
        check(pollData, {
            name: String,
            description: String,
            public: Boolean,
            vote_limit: Number,
            isactive: Boolean,
            isvoted: Boolean,
            ready: Boolean,
            options: [String],
            limit_hours: Number,
            limit_days: Number
        })

        // insert into polls database, generate unique IOTA address
        return Polls.insert({
            poll: pollData,
            iotaAddress: addressGenerator(),
            createdAt: new Date()
        });
    }
})
