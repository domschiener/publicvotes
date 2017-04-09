import { Template } from 'meteor/templating';

import './timelimit.html';

Template.timelimit.helpers({
    hours: function(){
        return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
    },
    days: function() {
        return [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14];
    }
});
