/**
 * # BombRisk
 * Copyright(c) 2020 Samuel Mueller
 *
 * Measures risk preferences with the BOMB risk elicitation
 *
 */
(function(node) {

    //"use strict";

    node.widgets.register('BombRisk', BombRisk);

    // ## Meta-data

    BombRisk.version = '0.1.0';
    BombRisk.description = 'Displays an interface to ' +
        'measure risk preferences.';

    BombRisk.title = 'Bomb Risk';
    BombRisk.className = 'bombrisk';

    BombRisk.texts = {

        mainText:
            'Below you see 100 black boxes. '+
            'All boxes contain a prize.'+
            'You have to decide how many boxes you want to open. You will ' +
            'the sum of all prizes that were in the boxes you opened. ' +
            '<strong>However, in one of these boxes there is a bomb.' +
            '</strong> If you open the box with the bomb, you get nothing.' +
            '<br><strong> How many boxes do you want to open?</strong><br>',

        hint:
            'Use the slider to change the number of boxes you want to open.',

        Prize: 'Each box contains: ',

        currentValue: ' Number of boxes to open: ',

        currentPrize: ' You can win: ',

        currency: 'ECU',

        openButton: 'Open Boxes',

        warning: 'You have to open at least one box!',

        win: 'You did not open the box with the bomb and won.',

        lose: 'You opened the box with the bomb and lost.'

    };

    // ## Dependencies
    BombRisk.dependencies = {
        JSUS: {}
    };

    /**
     * ## BombRisk constructor
     *
     * Creates a new instance of BombRisk
     *
     * @param {object} options Optional. Configuration options
     * which is forwarded to BombRisk.init.
     *
     * @see BombRisk.init
     */
    function BombRisk() {

        /**
         * ### BombRisk.methods
         *
         * List of available methods
         *
         * Maps names to functions.
         *
         * Each function is called with `this` instance as context,
         * and accepts the `options` parameters passed to constructor.
         * Each method must return widget-like gauge object
         * implementing functions: append, enable, disable, getValues
         *
         * or an error will be thrown
         */
        this.methods = {};

        /**
         * ## BombRisk.method
         *
         * The method used to measure mood
         *
         * Available methods: 'Bomb'
         *
         * Default method is: 'Bomb'
         *
         * References:
         *
         * Holt, C. A., & Laury, S. K. (2002).
         * Risk aversion and incentive effects.
         * American economic review, 92(5), 1644-1655.
         */
        this.method = 'Bomb';

        /**
         * ### BombRisk.mainText
         *
         * A text preceeding the SVO gauger
         */
        this.mainText = null;

        /**
         * ## SVOGauge.gauge
         *
         * The object measuring mood
         *
         * @see SVOGauge.method
         */
        this.gauge = null;

        this.addMethod('Bomb', bomb);
    }

    // ## BombRisk methods.

    /**
     * ### BombRisk.init
     *
     * Initializes the widget
     *
     * @param {object} opts Optional. Configuration options.
     */
    BombRisk.prototype.init = function(opts) {
        var gauge;
        if ('undefined' !== typeof opts.method) {
            if ('string' !== typeof opts.method) {
                throw new TypeError('BombRisk.init: method must be string ' +
                                    'or undefined: ' + opts.method);
            }
            if (!this.methods[opts.method]) {
                throw new Error('BombRisk.init: method is invalid: ' +
                                opts.method);
            }
            this.method = opts.method;
        }
        if (opts.mainText) {
            if ('string' !== typeof opts.mainText) {
                throw new TypeError('BombRisk.init: mainText must be string ' +
                                    'or undefined. Found: ' + opts.mainText);
            }
            this.mainText = opts.mainText;
        }
        if (opts.withPrize) {
            if ('boolean' !== typeof opts.withPrize) {
                throw new TypeError('BombRisk.init: withPrize must be boolean ' +
                                    'or undefined. Found: ' + opts.withPrize);
            }
            this.withPrize = opts.withPrize;
        }
        // Call method.
        gauge = this.methods[this.method].call(this, opts);

        // Check properties.
        checkGauge(this.method, gauge);
        // Approved.
        this.gauge = gauge;

        this.on('enabled', function() {
            gauge.enable();
        });

        this.on('disabled', function() {
            gauge.disable();
        });

        this.on('highlighted', function() {
            gauge.highlight();
        });

        this.on('unhighlighted', function() {
            gauge.unhighlight();
        });
    };

    BombRisk.prototype.append = function() {
        node.widgets.append(this.gauge, this.bodyDiv, { panel: false });

    };

    /**
     * ## BombRisk.addMethod
     *
     * Adds a new method to measure mood
     *
     * @param {string} name The name of the method
     * @param {function} cb The callback implementing it
     */
    BombRisk.prototype.addMethod = function(name, cb) {
        if ('string' !== typeof name) {
            throw new Error('BombRisk.addMethod: name must be string: ' +
                            name);
        }
        if ('function' !== typeof cb) {
            throw new Error('BombRisk.addMethod: cb must be function: ' +
                            cb);
        }
        if (this.methods[name]) {
            throw new Error('BombRisk.addMethod: name already existing: ' +
                            name);
        }
        this.methods[name] = cb;
    };

    BombRisk.prototype.getValues = function(opts) {
        var value, bombBox, payment;
        value = this.gauge.getValues(opts);

        bombBox = this.gauge.bombBox;

        // delete value.isCorrect;

        if (value['value'] < bombBox) {
          payment = value['value'] * this.gauge.factor;
          value.isWinner = true;
        }
        else {
          value.isWinner = false;
          payment = 0;
        }

        value.box = bombBox;
        value.payment = payment;

        return value;
    };

    BombRisk.prototype.setValues = function(opts) {
        return this.gauge.setValues(opts);
    };

    // ## Helper functions.

    /**
     * ### checkGauge
     *
     * Checks if a gauge is properly constructed, throws an error otherwise
     *
     * @param {string} method The name of the method creating it
     * @param {object} gauge The object to check
     *
     * @see ModdGauge.init
     */
    function checkGauge(method, gauge) {
        if (!gauge) {
            throw new Error('BombRisk.init: method ' + method +
                            'did not create element gauge.');
        }
        if ('function' !== typeof gauge.getValues) {
            throw new Error('BombRisk.init: method ' + method +
                            ': gauge missing function getValues');
        }
        if ('function' !== typeof gauge.enable) {
            throw new Error('BombRisk.init: method ' + method +
                            ': gauge missing function enable');
        }
        if ('function' !== typeof gauge.disable) {
            throw new Error('BombRisk.init: method ' + method +
                            ': gauge missing function disable');
        }
        if ('function' !== typeof gauge.append) {
            throw new Error('BombRisk.init: method ' + method +
                            ': gauge missing function append');
        }
    }

    // ## Available methods.


    function makeBoxLine(j) {
      var i, out, id;
      out = '<tr>';

      for (i = 0; i < 10; i++) {
        if (j > 0) {
          id = String(j) + String(i);
        }
        else {
          id = String(i);
        }
        out = out + '<td>' +
            '<div class ="square" id="' + id +
            '" style="height: 50px;  width: 50px; background: black">' +
            '</td>';

        if (i === 9) this.out = this.out + '</tr>';
      }
      return out;
    }

    function makeTable() {
      var j, out, k;
      out = '<table style="width:60%; margin-left:20%; margin-right:20%">';
      //k=l;
      for (j = 0; j < 10; j++) {
        out = out + makeBoxLine(j);
        if (j === 9) this.out = this.out + '</table><br>';
      }
      return out;
    }

    function bomb(options) {
        var gauge, i, len, j;
        var div, k, payment;
        var table, bombBox, resultMessages, hider;

        len = 10;

        scale = options.scale || 1;
        currency = options.currency || this.getText('currency');

        withPrize = options.withPrize;

        if (withPrize === undefined) withPrize=true;

        if (withPrize === false) hider = '<p style="display: none">';
        else hider = '<p>';


        table = makeTable();

        resultMessages = {
          mainText: options.mainText || this.getText('mainText'),
          hint: options.hint || this.getText('hint'),
          Prize: options.PrizeDescription || this.getText('Prize'),
          currentValue: options.currentValueDescription || this.getText('currentValue'),
          currentPrize: options.currentPrizeDescription || this.getText('currentPrize'),
          openButton: options.buttonText || this.getText('openButton') ,
          warning: options.warningText || this.getText('warning'),
          win: options.winText || this.getText('win'),
          lose: options.loseText || this.getText('lose')
        };

        bombBox;
        bombBox = Math.ceil(Math.random()*100);

        payment = -500;

        var slid = node.widgets.get('Slider', {
            id: options.id || 'bomb',
            min: 0,
            max: 100,
            mainText: resultMessages.mainText + table,
            hint: resultMessages.hint,
            title: false,
            initialValue: 0,
            displayNoChange: false,
            requiredChoice: true,
            correctValue: 5,
            texts: {
              currentValue: function(widget, value) {
                return '<p>' +resultMessages.currentValue+ value + '</p>'+
                hider+ resultMessages.Prize+ scale + currency + '</p>'+
                hider+ resultMessages.currentPrize + value*scale + currency+'</p>' +
                '<button id="open", class="btn-danger", style="font-size:20px; font-weight: bold; height:75px; width:150px; display:none">'+
                resultMessages.openButton+'</button>'+
                '<p id="warn",style="font-size:20px; font-weight: bold; height:75px; width:150px">'+
                '<br>'+resultMessages.warning+'<br></p>'+
                '<p id="won", style="color: #1be139; font-weight: bold; display:none">'+
                resultMessages.win+' </p>'+
                '<p id="lost", style="color: #fa0404; font-weight: bold; display:none">'+
                resultMessages.lose+'</p>'
                ;
              }
            },
            onmove: function(value) {
              k = value;
              button = W.gid('open');
              warn = W.gid('warn');
              doneButton = W.gid('donebutton');

              slider = W.getElementsByClassName('volume-slider');
              for (i = 0; i < 100; i++) {
                if (k > 0) {
                  button.style.display='';
                  warn.style.display='none';
                }
                div = W.gid(String(i));
                if (k > i) div.style.background = '#1be139';
                else div.style.background = '#000000';
              }
              button.onclick = function() {
                  trigger = W.gid(String(bombBox-1)).style.background = '#fa0404';
                  slider[0].style.display = 'none';
                  button.style.display = 'none';
                  donebutton.disabled = false;
                  if (k < bombBox) {
                    W.gid('won').style.display = '';
                  }
                  else {
                    W.gid('lost').style.display = '';
                  }

              }

            }
        });

        gauge = slid;
        gauge.bombBox = bombBox;
        gauge.factor = scale;

        return gauge;
    }

})(node);
