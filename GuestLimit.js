"use strict";

var main = function() {

    var subscription;
    var maxGuestCount = 100;
    var onlyInPark = false;

    ui.registerMenuItem("Guest Limit", function(){       
        var window = ui.openWindow({
            title: "Guest Limit",
            id: 1,
            classification: "Guest Limit",
            width: 165,
            height: 83,
            onClose: function onClose() {
                subscription.dispose();
            },
            widgets: [{
                type: "checkbox",
                name: "enableLimit",
                x: 10,
                y: 20,
                width: 130,
                height: 13,
                text: "Enable guest limit",
                onChange: function onChange(isChecked) {
                    if(isChecked){
                        subscription = context.subscribe('guest.generation', function(guest) {
                            var entity = map.getEntity(guest.id);
                            if(onlyInPark){
                                var guestCount = park.guests;
                            }
                            else{
                                var guestCount = map.getAllEntities("guest").length;
                            }
                            if(guestCount>maxGuestCount){
                                entity.remove();
                            }                           
                        });
                    }
                    else{
                        subscription.dispose();
                    }
                }
            },{
                type: "checkbox",
                name: "onlyInPark",
                x: 10,
                y: 40,
                width: 130,
                height: 13,
                text: "Only count guests in park",
                onChange: function onChange(isChecked) {
                    if(isChecked){
                        onlyInPark = true;
                    }
                    else{
                        onlyInPark = false;
                    }
                }
            },{
                type: "label",
                name: "limitLabel",
                x: 10,
                y: 60,
                width: 35,
                height: 13,
                text: "Limit:"
            },{
                type: "textbox",
                name: "limit",
                x: 47,
                y: 60,
                width: 108,
                height: 13,
                text: maxGuestCount.toString(),
                onChange: function onChange(text) {
                    var input = Number(text);
                    if(isNaN(input)){
                        ui.showError("The limit has to be a number.", "");
                    }
                    else{
                        maxGuestCount = input;
                    } 
                }
            }]
        })
    });
};

registerPlugin({
    name: 'Guest Limit',
    version: '1.0',
    authors: ['Flyxxpy'],
    type: 'remote',
    licence: 'MIT',
    targetApiVersion: 34,
    main: main
});