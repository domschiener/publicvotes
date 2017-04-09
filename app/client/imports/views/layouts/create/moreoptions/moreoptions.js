import { Template } from 'meteor/templating';
import { Session } from 'meteor/session'

import './moreoptions.html';

Template.moreoptions.events({
    'click #add_option' : function () {

        // Get session storage for NumberOfOptions and increment by 1
        var numOptions = Session.get('NumberOfOptions') + 1;

        if (numOptions <= 10) {

            //Create new DOM element for each additional Option
            var new_option = document.createElement("div");
            new_option.className = "form-group";
            new_option.innerHTML = '<input id="option-' + numOptions + '" type="text" value="" maxlength="20" placeholder="Option ' + numOptions +'" class="form-control poll_options" />';
            document.getElementById('options').appendChild(new_option);

            Session.set('NumberOfOptions', numOptions);
        }
    },
    'click #rmv_option' : function() {

        var numOptions = Session.get('NumberOfOptions');

        if (numOptions > 2) {
            var elementId = 'option-' + numOptions;
            var element_to_remove = document.getElementById(elementId).parentNode;
            document.getElementById('options').removeChild(element_to_remove);

            //Update Session
            Session.set('NumberOfOptions', numOptions - 1);
        }
    }
});
