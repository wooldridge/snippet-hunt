# express-mid

express-mid is a middle-tier application that enables communication with a MarkLogic database through the MarkLogic REST API.

## How to run

1. Install [Node.js](http://nodejs.org/).
2. Install the dependencies using the Node Package Manager. From the project directory, run: `npm install`
3. Edit `config.js` for your environment.
4. Run the script to start the server. From the project directory, run: `node app`

## Notes

The application passes through REST API calls with query values untouched. Authentication is handled based on the config settings.

For example, with the application running on port 9055, the following performs a search against the Search API for 'javascript', retrieving the first 10 results:

`http://localhost:9055/v1/search?q=javascript&start=1&pageLength=10&format=json&view=all`