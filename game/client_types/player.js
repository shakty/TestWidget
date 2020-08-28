/**
 * # Player type implementation of the game stages
 * Copyright(c) 2020 Samy <sammuell@mail.uni-mannheim.de>
 * MIT Licensed
 *
 * Each client type must extend / implement the stages defined in `game.stages`.
 * Upon connection each client is assigned a client type and it is automatically
 * setup with it.
 *
 * http://www.nodegame.org
 * ---
 */

"use strict";

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    stager.setOnInit(function() {

        // Initialize the client.

        var header, frame;

        // Bid is valid if it is a number between 0 and 100.
        this.isValidBid = function(n) {
            return node.JSUS.isInt(n, -1, 101);
        };

        // Setup page: header + frame.
        header = W.generateHeader();
        frame = W.generateFrame();

        // Add widgets.
        this.visualRound = node.widgets.append('VisualRound', header);

        this.visualTimer = node.widgets.append('VisualTimer', header);

        this.doneButton = node.widgets.append('DoneButton', header);

        // Additional debug information while developing the game.
        // this.debugInfo = node.widgets.append('DebugInfo', header)
    });


    stager.extendStep('Sliders', {
        donebutton: true,
        frame: 'instructions.htm',
        /*widget: {
            name: 'BombRisk',
            root: "container",
            options: {

            }
        }*/
        cb: function(){
          var root = document.body;
          var slider = node.widgets.append('Slider', root, {
            id: 'myslider',
            initialValue: 25,
            correctValue: 89,
            displayValue: false,
            mainText: 'Move the slider to position 89',
            hint: 'Be precise!',
            required: true,
            onmove: function(value, diff) {
              console.log('Slider moved to ' + value + ' from ' + (value - diff));
            }
          });

// Replacing the default texts: numeric value is replaced with a label.
          var slider2 = node.widgets.append('Slider', root, {
            id: 'myslider2',
            min: 1,
            max: 7,
            correctValue: 1,
            mainText: 'How do you feel?',
            texts: {
              currentValue: function(widget, value) {
                let mood = [
                  'Terrible!', 'Bad', 'Could be better',
                  'Normal',
                  'Not bad', 'Good', 'Great!'
                ];
                return mood[(value-1)];
              }
            }
          });
      }
    });


    stager.extendStep('Bomb', {
        donebutton: false,
        frame: 'end.htm',
        widget: {
            name: 'BombRisk',
            root: "container",
            options: {
              scale: 2,
              currency: '$',
              button: 'BOOOOM'
            }
        }
    });

    stager.extendStep('end', {
        donebutton: false,
        frame: 'end.htm',
        cb: function() {
            node.game.visualTimer.setToZero();
        }
    });
};
