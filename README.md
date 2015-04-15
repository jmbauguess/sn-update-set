# sn-update-set
### Instructions to run locally
1. Clone this repository
2. Create a .env file
  1. Set the following variables in the file: USER, PASSWORD, DEV, PROD
3. Start up the server.js file

### What it does
The page presents a list of Update Sets, in descending chronological order. Selecting one (or more) places them in a table to view pages information.
By entering valid credentials, valid dev and production instances, a change number (in production), and a release number, a knowledge base article will be generated from update set information and saved in the dev environment.
The article will contain a link to the change number in the given production environment.

### Demo
[My Demo on Heroku](https://afternoon-reef-8264.herokuapp.com/)
