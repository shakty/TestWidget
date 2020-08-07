/**
 * # BombRisk
 * Copyright(c) 2020 Samuel Mueller
 *
 * Displays an interface to measure risk preferences with the BOMB risk elicitation.
 *
 */

/*(function(node) {

    // Register the widget in the widgets collection
    // (will be stored at node.widgets.widgets).
    node.widgets.register('BombRisk', BombRisk);

    // Add Meta-data.

    BombRisk.version = '0.0.1';
    BombRisk.description = 'Creates a Bomb risk game'+
                'to measure risk preferences.';

    // Title is displayed in the header.
    BombRisk.title = 'Bomb Risk';
    // Classname is added to the widgets.
    BombRisk.className = 'bombrisk';

    // Text
    BombRisk.texts.mainText = 'Below you see 100 black boxes. '+
      '<strong>In one of these boxes there is a bomb.</strong> ' +
        'You have to decide how many boxes you want to open.' +
        ' <strong>Each box contains 1 ECU</strong>. ' +
        'You will get the sum of all ECU that were in the boxes you opened. ' +
        'However, if you <strong>open the box with the bomb, ' +
        'you get nothing</strong>. '+
        '<strong> How many boxes do you want to open?</strong>';

    // Dependencies are checked when the widget is created.
    BombRisk.dependencies = { JSUS: {} };

    // Constructor taking a configuration parameter.
    // The options object is always existing.
    function BombRisk(options) {
        // You can define widget properties here,
        // but they should get assigned a value in init.
        this.methods = {};

        this.method= 'Bomb';

        this.mainText = null;

        this.gauge = null;


        this.addMethod('Bomb', bomb);

    }

    BombRisk.prototype.init = function(options) {
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
       // Init widget variables, but do not create
       // HTML elements, they should be created in append.

       // Furthermore, you can add internal listeners here
       // or in the listeners method.
       this.on('destroyed', function() {
           // Do something. For example, notify another player.
       });
    }

    // Implements the Widget.append method.
    BombRisk.prototype.append = function() {
        // Widgets are Bootstrap panels. The following HTML
        // elements are available at the time when
        // the `append` method is called:
        //
        //   - panelDiv:   the outer container
        //   - headingDiv: the title container
        //   - bodyDiv:    the main container
        //   - footerDiv:  the footer container
        //

        node.widgets.append(this.gauge, this.bodyDiv, { panel: false });

        this.button = document.createElement('button');
        this.button.onclick = function() {
         // Do something.
       };
       this.bodyDiv.appendChild(this.button);
    };

    // Implements the Widget.listeners method (optional).
    /*BombRisk.prototype.listeners = function() {
        // Listeners added here using `node.on`
        // are automatically removed when the widget
        // is destroyed.
        node.on.data('MyEvent', function() {
          // Do something.
        });
    };

    // Overwrites some default methods, for example
    // the highlight method (optional).
    BombRisk.prototype.highlight = function() {
        if (!this.panelDiv) return;
        this.panelDiv.style.background = 'red';
        this.highlighted = true;
        // Do not forget to emit the event.
        this.emit('highlighted');
    };

    // Overwrites some default methods, for example
    // the unhighlight method (optional).
    BombRisk.prototype.unhighlight = function() {
        if (!this.panelDiv) return;
        this.panelDiv.style.background = 'white';
        this.highlighted = false;
        // Do not forget to emit the event.
        this.emit('unhighlighted');
    };*/
/*
    function makeProbString(p1, v1, p2, v2, opts) {
        var of, cur, sep, out;
        opts = opts || {};
        of = (opts.of || ' chance to win ');
        cur = opts.currency || '$';
        sep = opts.sep || '<span class="sep">and</span>';
        out = p1 + of;
        // Place currency sign before or after.
        out += opts.currencyAfter ? v1 + cur : cur + v1;
        out += sep + p2 + of;
        return out + (opts.currencyAfter ? v2 + cur : cur + v2);
    }

    function bomb(options) {
        var items, gauge, i, len, j;
        var tmp, v1, v2, v3, v4, p1, p2;

        tmp = options.values || [ 2, 1.6, 3.85, 0.1 ];

        if (options.scale) {
            tmp = tmp.map(function(i) { return i * options.scale; });
        }
        // Make it two decimals.
        v1 = tmp[0].toFixed(2);
        v2 = tmp[1].toFixed(2);
        v3 = tmp[2].toFixed(2);
        v4 = tmp[3].toFixed(2);

        len = 10;
        items = new Array(len);
        for (i = 0; i < len ; i++) {
            j = i + 1;
            p1 = j + '/' + len;
            p2 = (len - j) + '/' + len;
            items[i] = {
                id: 'hl_' + j,
                left: j + '. ',
                choices: [
                    makeProbString(p1, v1, p2, v2, options),
                    makeProbString(p1, v3, p2, v4, options),
                ]
            };
        }

        gauge = node.widgets.get('ChoiceTableGroup', {
            id: options.id || 'bomb',
            items: items,
            mainText: this.mainText || this.getText('mainText'),
            title: false,
            requiredChoice: true,
            storeRef: false
        });

        return gauge;
    }
})(node);*/
