### GET endpoints

##### /api/v0/fighter/list

Lists all fighters

```json
[
    {
        "fighter_UID": 1,
        "fighter_name": "Bob",
        "fighter_player_UID": 1,
        "stat_atk": 5,
        "stat_def": 5,
        "stat_tej": 5,
        "rec_wins": 0,
        "rec_losses": 0
    }
]
```

##### /api/v0/fighter/search/:pattern

Searches fighters and returns all fighters who have **:pattern** in their name. See */api/v0/fighter/list* formatting.

##### /api/v0/player/list

Lists all players.

```JSON
[
    {
        "player_UID": 1,
        "player_name": "Mr. Smith"
    },
    {
        "player_UID": 2,
        "player_name": "Big Bubba"
    }
]
```

##### /api/v0/player/show/:player

Lists all fighters in player by *playerUID* in **:player**. See */api/v0/player/list* formatting.

##### /api/v0/fighter/show/:fighter

Returns a single fighter's information. **:fighter** is the fighter's ID number. See */api/v0/fighter/list* formatting (returns only one fighter).

### POST endpoints

##### /api/v0/fighter/add

Adds a fighter to the database.
Must contain *x-www-form-urlencoded* data and the body must contain:
**player_name**: The name of the player being created

##### /api/v0/fighter/remove/:fighter

Removes a fighter from the database by fighter_UID

##### /api/v0/player/add

Adds a fighter to the database.
Must contain *x-www-form-urlencoded* data and the body must contain:
**playername**: The name of the player this fighter will belong to
**playerUID**: The complete name of the fighter

##### /api/v0/player/remove/:player

Removes a player from the database by player_UID
