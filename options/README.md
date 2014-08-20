A NodeJS script that sets up MarkLogic search options for the AR Game.

## How to run

1. Install [NodeJS](http://nodejs.org/).
2. Install the dependencies using the Node Package Manager. From the project directory, run: `npm install`
3. Edit `config.js` for your MarkLogic environment.
4. Run the script. You can include the name of your search-options set as an argument (otherwise a default "argame" will be used):

`node options`

(Creates a search-options set named "argame")

`node options myopts`

(Creates a search-options set named "myopts")
