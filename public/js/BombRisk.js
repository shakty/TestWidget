/**
 * # BombRisk
 * Copyright(c) 2020 Samuel Mueller
 *
 * Displays an interface to measure risk preferences with the BOMB risk elicitation.
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

    BombRisk.texts.mainText = 'Below you see 100 black boxes. '+
      '<strong>In one of these boxes there is a bomb.</strong> ' +
        'You have to decide how many boxes you want to open.' +
        ' <strong>Each box contains 1 ECU</strong>. ' +
        'You will get the sum of all ECU that were in the boxes you opened. ' +
        'However, if you <strong>open the box with the bomb, ' +
        'you get nothing</strong>. '+
        '<strong> How many boxes do you want to open?</strong>';

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
    function BombRisk(options) {

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
        return this.gauge.getValues(opts);
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


    function MakeBoxLine(j) {
      var i, out, id;
      out='<tr>';

      for(i=0; i < 10; i++){
        if(j>0){
          id= String(j)+String(i);
        }
        else{
          id=String(i);
        }
        out=out+'<td>'+
            '<div class="square" id="'+id+
            '" style="height: 50px;  width: 50px; background: black">'+
            '</td>';

        if(i===9){
          this.out=this.out+'</tr>';
        }
      }
      return out;
    }

    function MakeTable(){
      var j, out, k;
      out= '<table style="width:60%; margin-left:20%; margin-right:20%">';
      //k=l;
      for(j=0; j < 10; j++){
        out=out+MakeBoxLine(j);

        if(j===9){
          this.out=this.out+'</table>'+'<br>';
        }
      }
      return out;
    }

    function bomb(options) {
        var items, gauge, i, len, j;
        var div, k;



        len = 10;

        scale = options.scale || 1;

        var table=MakeTable();

        gauge=node.widgets.get('Slider', {
            id: options.id || 'bomb',
            min: 1,
            max: 100,
            mainText: this.getText('mainText')+table,
            hint:'Use the slider to change the number of boxes you want to open.',
            title: false,
            initialValue: 1,
            displayNoChange: false,
            requiredChoice: true,
            texts: {
              currentValue: function(widget, value){
                return '<p> Number of boxes to open: ' + value + '</p>'+
                '<p> ECU you can win: ' + value*scale + 'ECU </p>';
              }
            },
            onmove: function(value) {
              k=value;
              //div = W.getElementById(String(k-1)).style.background = '#1be139';
              //div = W.getElementById(String(k)).style.background = '#000000';
              for(i=0; i<100; i++){
                if(k>i){
                  div = W.getElementById(String(i)).style.background = '#1be139';
                }
                else{
                  div = W.getElementById(String(i)).style.background = '#000000';
                }
              }
            }
        });

        return gauge;
    }

    function activateBomb(){
      var trigger, bomb_box;

      trigger=document.createElement('input');
      trigger.type = 'button';
      
    }

})(node);
