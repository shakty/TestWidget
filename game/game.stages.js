/**
 * # Game stages definition file
 * Copyright(c) 2020 Samy <sammuell@mail.uni-mannheim.de>
 * MIT Licensed
 *
 * Stages are defined using the stager API
 *
 * http://www.nodegame.org
 * ---
 */

module.exports = function(stager, settings) {

     stager
        .next('Sliders')
        .next('Bomb')
        .next('end')
        .gameover();

    // Modify the stager to skip one stage.
      //stager.skip('end');
stager.skip('Sliders');
    // To skip a step within a stage use:
    // stager.skip('stageName', 'stepName');
    // Notice: here all stages have just one step.
};
