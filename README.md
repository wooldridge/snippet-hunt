# AR Game

AR Game is an augmented reality game played on a Google Map.

In the game, the user explores a map of the local world and interacts
with items overlaid on the map.

The game uses *MarkLogic Server* as a database, *NodeJS* for server-side
scripting, and *jQuery* and the *Google Maps JavaScript API v3* for client-side
scripting.

A web browser with HTML5 geolocation capabilities is require to play (e.g., new
versions of Chrome, Firefox, Safari, or IE).


## Setting Up the Game

1. Start MarkLogic Server.
2. Set up a database named `argame` using the default settings. You can do this
at: `http://localhost:8000/appservices/`
3. Set up a REST server for the database on port `8077`. You can do this at:
`http://localhost:8000/appservices/`
4. In the root directory, run `npm install` to load dependencies.
5. In the `options` directory, run `node options` to define search options for
the REST server.
6. In the root directory, start the middle-tier NodeJS Express server to serve
the application and handle REST calls: `node server`
6. In a web browser, open the project, e.g.: `http://localhost:9055`
7. When the browser asks for permission to access location information, allow
it.
8. You can edit server settings in `config.js`.
