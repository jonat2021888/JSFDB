const express = require('express'); // Express framework
const app = express();

let session = require('express-session');
// Set up session with express
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
let path = require('path');

const sqlite3 = require('sqlite3'); // Interfaces with sqlite3 database
const db = new sqlite3.Database('database/JSFdatabase.db');

const bodyParser = require('body-parser'); // Parses data from http request bodies
//S et up bodyParser with express
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//Set up web folders
app.use(express.static("public"));

app.listen(3001, function() {
    console.log('Listening on port ' + 3001 + '.');
});

/*
██       ██████   ██████  ██ ███    ██
██      ██    ██ ██       ██ ████   ██
██      ██    ██ ██   ███ ██ ██ ██  ██
██      ██    ██ ██    ██ ██ ██  ██ ██
███████  ██████   ██████  ██ ██   ████
*/

app.get('/', function(request, response) {
    if (request.session.loggedin) {
        response.redirect('/home');
    } else {
        response.redirect('/login');
    }
    response.end();
});

app.get('/login', function(request, response) {
    response.sendFile(path.join(__dirname + '/public/login.html'));
});

app.post('/auth', function(request, response) {
    let username = request.body.username;
    let password = request.body.password;
    if (username && password) {
        db.get('SELECT * FROM jsf_accounts WHERE username = \'' + username + '\' AND password = \'' + password + '\';', function(err, results) {
            if (err)
                console.log(err);
            if (results) {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/home');
            } else {
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.redirect('/login');
	}
	response.end();
});

/*
███████ ██  ██████  ██   ██ ████████ ███████ ██████
██      ██ ██       ██   ██    ██    ██      ██   ██
█████   ██ ██   ███ ███████    ██    █████   ██████
██      ██ ██    ██ ██   ██    ██    ██      ██   ██
██      ██  ██████  ██   ██    ██    ███████ ██   ██
*/


app.get('/api/v0/fighter/list/', function(req, res) {
    db.all("SELECT * FROM jsf_fighters;", function(err, results) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log('Serving /fighter/list/ to ' + req.ip);
            res.set('Content-Type', 'application/json');
            if (results != "") {
                res.send(JSON.stringify(results));
            } else {
                res.send('undefined');
            }
        }
    });
});

app.get('/api/v0/fighter/show/:fighterUID', function(req, res) {
    db.get("SELECT * FROM jsf_fighters INNER JOIN jsf_players ON jsf_players.player_UID=jsf_fighters.fighter_player_UID WHERE fighter_UID = \'" + req.params.fighterUID + "\';", function(err, results) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.set('Content-Type', 'application/json');
            if (results != undefined) {
                console.log('Serving /fighter/show/' + req.params.fighterUID + ' to ' + req.ip);
                res.send(JSON.stringify(results));
            } else {
                res.send('undefined');
            }
        }
    });
});

app.post('/api/v0/fighter/add/', function(req, res) {
    db.get("SELECT fighter_name FROM jsf_fighters WHERE fighter_UID = \'" + req.body.fighterID + "\';", function(err, results) {
        console.log(results);
        if (!results) {
            db.run("INSERT INTO jsf_fighters (fighter_name, fighter_player_UID, stat_atk, stat_def, stat_tek, rec_wins, rec_losses) VALUES (\'" + req.body.fightername + "\', \'" + req.body.fighterplayerUID + "\', 5, 5, 5, 0, 0);", function(err) {
                if (err) {
                    console.log("INSERT query: " + err);
                } else {
                    res.status(201).send("Success");
                }
            });
        } else {
            res.status(403).send("User already exists");
        }
    });
});

app.put('/api/v0/fighter/edit/:fighterID', function(req, res) {

});

app.delete('/api/v0/fighter/remove/:fighterID', function(req, res) {

});

app.get('/api/v0/fighter/search/:pattern', function(req, res) {
    db.all("SELECT * FROM jsf_fighters WHERE fighter_name LIKE \'\%" + req.params.pattern + "\%\';", function(err, results) {
        console.log(results);
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.set('Content-Type', 'application/json');
            if (results != undefined) {
                res.send(JSON.stringify(results));
            } else {
                res.send('undefined');
            }
        }
    });
});

/*
██████  ██       █████  ██    ██ ███████ ██████
██   ██ ██      ██   ██  ██  ██  ██      ██   ██
██████  ██      ███████   ████   █████   ██████
██      ██      ██   ██    ██    ██      ██   ██
██      ███████ ██   ██    ██    ███████ ██   ██
*/

app.get('/api/v0/player/list/', function(req, res) {
    db.all("SELECT * FROM jsf_players;", function(err, results) {
        console.log(results);
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.set('Content-Type', 'application/json');
            if (results != "") {
                res.send(JSON.stringify(results));
            } else {
                res.send('undefined');
            }
        }
    });
});

app.get('/api/v0/player/show/:playerUID', function(req, res) {
    db.all("SELECT * FROM jsf_fighters INNER JOIN jsf_players ON jsf_fighters.fighter_player_UID=jsf_players.player_UID WHERE jsf_players.player_UID = \'" + req.params.playerUID + "\';", function(err, results) {
        console.log(results);
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.set('Content-Type', 'application/json');
            if (results != undefined) {
                res.send(JSON.stringify(results));
            } else {
                res.send('undefined');
            }
        }
    });
});

app.post('/api/v0/player/add/', function(req, res) {
    db.get("SELECT player_name FROM jsf_players WHERE player_UID = \'" + req.body.playerID + "\';", function(err, results) {
        console.log(results);
        if (!results) {
            db.run("INSERT INTO jsf_players (player_name) VALUES (\'" + req.body.playername + "\');", function(err) {
                if (err) {
                    console.log("INSERT query: " + err);
                } else {
                    res.status(201).send("Success");
                }
            });
        } else {
            res.status(403).send("User already exists");
        }
    });
});

app.put('/api/v0/player/edit/:playerID', function(req, res) {

});

app.delete('/api/v0/player/remove/:playerID', function(req, res) {

});

app.get('/api/v0/player/search/:pattern', function(req, res) {

});

app.get('/api/v0/player/search/:pattern', function(req, res) {
    db.all("SELECT * FROM jsf_players WHERE player_name LIKE \'\%" + req.params.pattern + "\%\';", function(err, results) {
        console.log(results);
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.set('Content-Type', 'application/json');
            if (results != undefined) {
                res.send(JSON.stringify(results));
            } else {
                res.send('undefined');
            }
        }
    });
});
