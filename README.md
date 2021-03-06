# Snippet Hunt

Snippet Hunt is a simple augmented-reality game played on a Google Map.

The user explores a map of the local world and interacts with items
overlaid on the map.

The game uses *MarkLogic Server* as a database, *NodeJS* for server-side
scripting, and *jQuery* and the *Google Maps JavaScript API v3* for client-side
scripting.

A web browser with HTML5 geolocation capabilities is require to play (e.g., new
versions of Chrome, Firefox, Safari, or IE).

<img src="https://raw.githubusercontent.com/wooldridge/snippet-hunt/master/src/images/player-snippet-map.png" alt="Snippet Hunt" style="width: 538px;"/>

<em>Collecting snippets and MarkLogic executives scores a player points.</em>

## Setting Up the Game

1. Install MarkLogic Server and Node.js.
2. Start MarkLogic Server.
3. Set up a MarkLogic database named `argame` using the default settings. You
   can do this at: `http://localhost:8000/appservices/`
4. In the `argame` database, set up an Element Range Index for `exp` property.
5. Set up a REST server for the `argame` database on port `8077`. You can do
   this at: `http://localhost:8000/appservices/`
6. Set up a MarkLogic user that has `rest-admin` privileges.
7. Open `config-sample.js` and enter the server settings for your environment.
   Save the file in the root directory as `config.js`.
8. In the root directory, run `npm install` to load Node.js dependencies.
9. In the root directory, run `node options` to define search options for
   the REST server.
10. Install bower with `npm install -g bower`. In the root directory, run `bower
   install` to install browser dependencies.
11. Set the Node.js environment variable:
    `export NODE_ENV=[DEVELOPMENT|PRODUCTION]`
12. Install grunt with `npm install -g grunt-cli`. In the root directory, run
   `grunt` to build the application.
13. In the root directory, run `node server` to start the NodeJS to start the
    application.
14. In a web browser, open the project: `http://localhost:8066`
15. When the browser asks for permission to access location information, allow
    it.
