/**
 * # Logic type implementation of the game stages
 * Copyright(c) 2020 Samy <sammuell@mail.uni-mannheim.de>
 * MIT Licensed
 *
 * http://www.nodegame.org
 * ---
 */

"use strict";

var ngc = require('nodegame-client');
var J = ngc.JSUS;

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    var node = gameRoom.node;
    var channel =  gameRoom.channel;

    // Must implement the stages here.

    stager.setOnInit(function() {
        // Initialize the client.
    });


    stager.extendStep('end', {
        cb: function() {
            // Save data in the data/roomXXX directory.
            node.game.memory.save('data.json');
        }
    });

    stager.setOnGameOver(function() {
        // Something to do.
    });
};
