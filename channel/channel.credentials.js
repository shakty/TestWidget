/**
 * # Channel secret file
 * Copyright(c) 2020 Samy <sammuell@mail.uni-mannheim.de>
 * MIT Licensed
 *
 * The file must return the administrator user name and password
 *
 * The secret key can be stored here directly or loaded asynchronously from
 * another source, e.g a remote service or a database.
 *
 * http://www.nodegame.org
 * ---
 */
module.exports = function(settings, done) {

    return {
        user: 'Samuel',
        pwd: 'widget'
    };

    // Example: return key asynchronously

    // loadCredentialsFromDatabase(function(err, credentials) {
    //     done(err, credentials);
    // });
};
