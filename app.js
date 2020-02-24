const express = require('express'); // Express framework
const request = require('request'); // Express framework
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

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: '+add);
})



//Set up PUG view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static("public"));








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
	response.status(200).render('login', {
		darkmode: request.session.darkmode
	});
});



app.post('/auth', function(request, response) {
	let username = request.body.username;
	let password = request.body.password;
	var playerName = request.body.username;
	if (username && password) {
		db.get('SELECT * FROM jsf_account WHERE username = \'' + username + '\' AND password = \'' + password + '\';', function(err, results) {
			if (err)
				console.log(err);
			if (results) {
				request.session.loggedin = true;
				request.session.username = username;
				request.session.accUID = results.account_UID;
				if (results.account_color_theme == "dark") {
					request.session.darkmode = true;
				} else {
					request.session.darkmode = false;
				}
				response.redirect('/home');
				console.log(playerName + "#" + results.account_UID + " logged in.");
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
	// response.sendFile(path.join(__dirname + '/public/home.html'));
	if (request.session.loggedin) {
		// response.send('Welcome back, ' + request.session.username + '!');
		response.status(200).render('index', {
				username: request.session.username,
				accountUID: request.session.accUID,
				darkmode: request.session.darkmode
		});
	} else {
		response.redirect('/login');
	}
	// response.end();
});

app.get('/editor', function(request, response) {
	response.status(200).render('editor', {
		username: request.session.username,
		accountUID: request.session.accUID,
		darkmode: request.session.darkmode
	});
});

app.get('/create', function(request, response) {
	response.status(200).render('create', {
			username: request.session.username,
			accountUID: request.session.accUID,
			darkmode: request.session.darkmode
	});
});

app.get('/modify', function(request, response) {
	db.get('SELECT account_UID FROM jsf_account WHERE username = \'' + request.session.username + '\';', function(err, results) {
		if (err) {
			console.log("ERROR:");
			console.log(err);
		}
		else if (results) {
		 db.all('SELECT * FROM jsf_fighters WHERE fighter_player_UID = \'' + request.session.accUID + '\';', function(err, results) {
			 response.status(200).render('modify', {
				 	 username: request.session.username,
					 accountUID: request.session.accUID,
					 darkmode: request.session.darkmode,
					 fighters: results
			 });
		 });
		}
	});
});


app.post('/createFighter', function(request, response) {
	if (request.session.username != undefined) {




				if ((request.body.name) && ((parseFloat(request.body.atk) + parseFloat(request.body.def) + parseFloat(request.body.tek)) == 90) && (parseFloat(request.body.atk) >= 5) && (parseFloat(request.body.def) >= 5) && (parseFloat(request.body.tek) >= 5) && (parseFloat(request.body.atk) <= 60) && (parseFloat(request.body.def) <= 60) && (parseFloat(request.body.tek) <= 60)) {
					db.run("INSERT INTO jsf_fighters (fighter_name, fighter_player_UID, stat_atk, stat_def, stat_tek, rec_wins, rec_losses) VALUES ('" + request.body.name + "','" + request.session.accUID + "','" + request.body.atk + "','" + request.body.def + "','" + request.body.tek + "','" + "0" + "','" + "0" + "')", function(err) {
						response.redirect('/create');
						if (err) {
							console.log("ERROR:");
							console.log(err);
						} else {
							console.log(request.session.username + "#" + request.session.accUID + " created fighter: " + request.body.name);
						}
						});
				}

	} else {
		console.log("ALERT: Someone tried to create a fighter while they weren't logged in");
		response.send("You aren't logged in");
	}
});

app.post('/modifyFighter', function(request, response) {
	if (request.session.username != undefined) {

				if ((request.body.name) && ((parseFloat(request.body.atk) + parseFloat(request.body.def) + parseFloat(request.body.tek)) == 90) && (parseFloat(request.body.atk) >= 5) && (parseFloat(request.body.def) >= 5) && (parseFloat(request.body.tek) >= 5) && (parseFloat(request.body.atk) <= 60) && (parseFloat(request.body.def) <= 60) && (parseFloat(request.body.tek) <= 60)) {
					db.run("REPLACE INTO jsf_fighters (fighter_name, fighter_player_UID, stat_atk, stat_def, stat_tek, rec_wins, rec_losses) VALUES ('" + request.body.name + "','" + request.session.accUID + "','" + request.body.atk + "','" + request.body.def + "','" + request.body.tek + "','" + "0" + "','" + "0" + "')", function(err) {
						response.redirect('/modify');
						if (err) {
							console.log("ERROR:");
							console.log(err);
						} else {
							console.log(request.session.username + "#" + request.session.accUID + " modified fighter: " + request.body.name);
						}
						});
				}
	} else {
		console.log("ALERT: Someone tried to create a fighter while they weren't logged in");
		response.send("You aren't logged in");
	}
});

app.post('/deleteFighter', function(request, response) {
	if (request.session.username != undefined) {
				db.get('DELETE FROM jsf_fighters WHERE fighter_player_UID = \'' + request.session.accUID + '\' AND fighter_name = \'' + request.body.name + '\';', function(err) {
					if (err) {
						console.log("ERROR:");
						console.log(err);
					} else {
						console.log(request.session.username + "#" + request.session.accUID + " deleted Fighter: " + request.body.name);
						response.redirect('/delete');
					}
				});

	} else {
		console.log("ALERT: Someone tried to delete a fighter while they weren't logged in");
		response.send("You aren't logged in");
	}
});


app.get('/game', function(request, response) {
	response.status(200).sendFile(path.join(__dirname + '/public/JSFighter/index.html'));
	console.log(request.session.username + " joined the game.");
});

app.get('/play', function(request, response) {
	response.status(200).render('play', {
		username: request.session.username,
		accountUID: request.session.accUID,
		darkmode: request.session.darkmode
	});
});

app.get('/settings', function(request, response) {
	response.status(200).render('settings', {
		username: request.session.username,
		accountUID: request.session.accUID,
		darkmode: request.session.darkmode
	});
});

app.get('/jsfighterGame', function(request, response) {
	response.status(200).render('jsfighterGame', {
		username: request.session.username,
		accountUID: request.session.accUID,
		darkmode: request.session.darkmode
	});
});

app.get('/accountCreation', function(request, response) {
	response.status(200).render('account');
});






app.post('/createAccount', function(request, response) {
	if ((request.body.username1) && (request.body.username2) && (request.body.password1) && (request.body.password2) && (request.body.password3) && (request.body.username1 == request.body.username2) && (request.body.password1 == request.body.password2) && (request.body.password2 == request.body.password3)) {
		db.run("INSERT INTO jsf_account (username, password, account_wins, account_color_theme) VALUES ('" + request.body.username1 + "','" + request.body.password1 + "','" + "0" + "','" + "light" + "')", function(err) {
			response.redirect('/login');
			if (err) {
				console.log("ERROR:");
				console.log(err);
			} else {
				console.log("An account with the name of " + request.body.username1 + " was created.");
			}
		});
	} else {
		console.log("Someone didn't confirm their account correctly :)");
	}
});

app.get('/leaderboards', function(request, response) {
	db.get('SELECT account_UID FROM jsf_account WHERE username = \'' + request.session.username + '\';', function(err, results) {
		if (err) {
			console.log("ERROR:");
			console.log(err);
		}
		else if (results) {
		 db.all('SELECT * FROM jsf_account', function(err, results) {
			 results.sort(function(a, b) {
			 return parseFloat(b.account_wins) - parseFloat(a.account_wins);
			 });
			 response.status(200).render('leaderboards', {
					 username: request.session.username,
					 accountUID: request.session.accUID,
					 darkmode: request.session.darkmode,
					 accounts: results
			 });
		 });
		}
	});
});

app.get('/delete', function(request, response) {
	db.get('SELECT account_UID FROM jsf_account WHERE username = \'' + request.session.username + '\';', function(err, results) {
		if (err) {
			console.log("ERROR:");
			console.log(err);
		}
		else if (results) {
		 db.all('SELECT * FROM jsf_fighters WHERE fighter_player_UID = \'' + results.account_UID + '\';', function(err, results) {
			 response.status(200).render('delete', {
				 	 username: request.session.username,
					 accountUID: request.session.accUID,
					 darkmode: request.session.darkmode,
					 fighters: results
			 });
		 });
		}
	});
});





app.post('/darkmode', function(request, response) {
	request.session.darkmode = true;
	let page = request.body.page;
	if (page == "modify") {
		db.get('SELECT account_UID FROM jsf_account WHERE username = \'' + request.session.username + '\';', function(err, results) {
			if (err) {
				console.log("ERROR:");
				console.log(err);
			}
			else if (results) {
			 db.all('SELECT * FROM jsf_fighters WHERE fighter_player_UID = \'' + results.account_UID + '\';', function(err, results) {
				 response.status(200).render('modify', {
						 username: request.session.username,
						 accountUID: request.session.accUID,
						 darkmode: request.session.darkmode,
						 fighters: results
				 });
			 });
			}
		});
	} else if (page == "delete") {
		db.get('SELECT account_UID FROM jsf_account WHERE username = \'' + request.session.username + '\';', function(err, results) {
			if (err) {
				console.log("ERROR:");
				console.log(err);
			}
			else if (results) {
			 db.all('SELECT * FROM jsf_fighters WHERE fighter_player_UID = \'' + results.account_UID + '\';', function(err, results) {
				 response.status(200).render('delete', {
						 username: request.session.username,
						 accountUID: request.session.accUID,
						 darkmode: request.session.darkmode,
						 fighters: results
				 });
			 });
			}
		});
	} else if (page == "leaderboards") {
		db.get('SELECT account_UID FROM jsf_account WHERE username = \'' + request.session.username + '\';', function(err, results) {
			if (err) {
				console.log("ERROR:");
				console.log(err);
			}
			else if (results) {
			 db.all('SELECT * FROM jsf_account', function(err, results) {
				 results.sort(function(a, b) {
				 return parseFloat(b.account_wins) - parseFloat(a.account_wins);
				 });
				 response.status(200).render('leaderboards', {
						 username: request.session.username,
						 accountUID: request.session.accUID,
						 darkmode: request.session.darkmode,
						 accounts: results
				 });
			 });
			}
		});
	} else {
		response.status(200).render("" + page + "", {
				username: request.session.username,
				accountUID: request.session.accUID,
				darkmode: request.session.darkmode
		});
	}
});





app.post('/lightmode', function(request, response) {
	request.session.darkmode = false;
	let page = request.body.page;
	if (page == "modify") {
		db.get('SELECT account_UID FROM jsf_account WHERE username = \'' + request.session.username + '\';', function(err, results) {
			if (err) {
				console.log("ERROR:");
				console.log(err);
			}
			else if (results) {
			 db.all('SELECT * FROM jsf_fighters WHERE fighter_player_UID = \'' + results.account_UID + '\';', function(err, results) {
				 response.status(200).render('modify', {
						 username: request.session.username,
						 accountUID: request.session.accUID,
						 darkmode: request.session.darkmode,
						 fighters: results
				 });
			 });
			}
		});
	} else if (page == "delete") {
		db.get('SELECT account_UID FROM jsf_account WHERE username = \'' + request.session.username + '\';', function(err, results) {
			if (err) {
				console.log("ERROR:");
				console.log(err);
			}
			else if (results) {
			 db.all('SELECT * FROM jsf_fighters WHERE fighter_player_UID = \'' + results.account_UID + '\';', function(err, results) {
				 response.status(200).render('delete', {
						 username: request.session.username,
						 accountUID: request.session.accUID,
						 darkmode: request.session.darkmode,
						 fighters: results
				 });
			 });
			}
		});
	} else if (page == "leaderboards") {
		db.get('SELECT account_UID FROM jsf_account WHERE username = \'' + request.session.username + '\';', function(err, results) {
			if (err) {
				console.log("ERROR:");
				console.log(err);
			}
			else if (results) {
			 db.all('SELECT * FROM jsf_account', function(err, results) {
				 results.sort(function(a, b) {
				 return parseFloat(b.account_wins) - parseFloat(a.account_wins);
				 });
				 response.status(200).render('leaderboards', {
						 username: request.session.username,
						 accountUID: request.session.accUID,
						 darkmode: request.session.darkmode,
						 accounts: results
				 });
			 });
			}
		});
	} else {
		response.status(200).render("" + page + "", {
				username: request.session.username,
				accountUID: request.session.accUID,
				darkmode: request.session.darkmode
		});
	}
});















app.post('/themeSetDark', function(request, response) {
	request.session.darkmode = true;
	if (request.session.username != undefined) {
		var playerName = request.session.username;
		db.get('SELECT * FROM jsf_account WHERE username = \'' + playerName + '\';', function(err, results) {
			if (err) {
				console.log("ERROR1:");
				console.log(err);
			} else if (results) {
					db.run("REPLACE INTO jsf_account (account_UID, username, password, account_wins, account_color_theme) VALUES ('" + results.account_UID + "','" + results.username + "','" + results.password + "','" + results.account_wins + "','" + "dark" + "')", function(err) {
					response.redirect('/settings');
						if (err) {
							console.log("ERROR2:");
							console.log(err);
						} else {
							console.log(playerName + "#" + results.account_UID + " changed theme to dark");
						}
						});
					}
		});
	} else {
		console.log("ALERT: Someone tried to change theme while they weren't logged in");
		response.send("You aren't logged in");
	}
	});





	app.post('/themeSetLight', function(request, response) {
		request.session.darkmode = false;
		if (request.session.username != undefined) {
			var playerName = request.session.username;
			db.get('SELECT * FROM jsf_account WHERE username = \'' + playerName + '\';', function(err, results) {
				if (err) {
					console.log("ERROR1:");
					console.log(err);
				} else if (results) {
						db.run("REPLACE INTO jsf_account (account_UID, username, password, account_wins, account_color_theme) VALUES ('" + results.account_UID + "','" + results.username + "','" + results.password + "','" + results.account_wins + "','" + "light" + "')", function(err) {
						response.redirect('/settings');
							if (err) {
								console.log("ERROR2:");
								console.log(err);
							} else {
								console.log(playerName + "#" + results.account_UID + " changed theme to light");
							}
							});
						}
			});
		} else {
			console.log("ALERT: Someone tried to change theme while they weren't logged in");
			response.send("You aren't logged in");
		}
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
	db.get("SELECT * FROM jsf_players WHERE player_name = \'" + req.body.player_name + "\';", function(err, results) {
		console.log(results);
        console.log(err);
		if (!results) {
            console.log("No Player with that name.");
            res.status(403).send("No Player with that name.");
		} else {
			db.run("INSERT INTO jsf_fighters (fighter_name, fighter_player_UID, stat_atk, stat_def, stat_tek, rec_wins, rec_losses) VALUES (\'" + req.body.fightername + "\', \'" + results.player_UID + "\', 5, 5, 5, 0, 0);", function(err) {
				if (err) {
					console.log("INSERT query: " + err);
                    res.status(403).send("INSERT query: " + err);
				} else {
					res.status(201).send("Success");
				}
			});
		}
	});
});

app.put('/api/v0/fighter/edit/:fighterID', function(req, res) {

});

app.delete('/api/v0/fighter/remove/:fighterID', function(req, res) {
	db.all("DELETE FROM jsf_fighters WHERE fighter_UID LIKE \'\%" + req.params.fighterID + "\%\';", function(err, results) {
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







var options = {
  url: 'https://api.github.com/repos/andre2021537/JSFDB',
  headers: {
    'User-Agent': 'request'
  }
};

//github test
app.get('/api/v0/github', function(req, res) {
	request(options, function(request_err, request_res, request_body) {
					res.status(200).send(request_body);
			}
	)
});
