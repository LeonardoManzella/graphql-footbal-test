## GraphQL football data app

## Introduction

This is a backend application that exposes data from http://www.football-data.org/ as an API built with GraphQL, with a mutation and some queries.

## Technologies used

The application is based on Javascript technologies to minimize the overhead from fetching, transforming, saving and reading the data.
It uses the following core dependencies for the project:

* [**M**ongoDB](https://www.mongodb.com/): NoSQL database
* [**E**xpress.js](http://expressjs.com): backend framework
* [**A**pollo.js](https://www.apollographql.com/): graphql server framework
* [**N**ode.js](https://nodejs.org): runtime environment

## Architecture

The project uses express as a base layer, which loads all the other dependencies (Mongoose, Apollo, Winston logger, Axios, etc..).

Mongoose is used to facilitate access to the database and allows us to define the document schemas and methods that are easily mapped and serve as GraphQL queries and mutations, thanks to the `graphql-compose-mongoose` utility

For logging the Winston logger is being used since it is very flexible, easy to configure, uses different logging levels and can have multiple transports, see (transports)[https://www.npmjs.com/package/winston#transports].

For requests the Axios library is being used to make use of its interceptors to hook before and after each request.

## Database decision and instructions
A free instance of Atlas MongoDB cluster is being use as a database for various reasons:
- Using MongoDB reduces the overhead from saving/reading data since it natively supports Javascript objects. No transformations are required
- Atlas cluster provides built-in automation for resource and workload optimization, also has unmatched data distribution and mobility across AWS, Azure, and Google Cloud
- Atlas is designed for developer productivity making easier to integrate, manipulate, visualize and analyze the data

## Exploring the DB with MongoDBCompass
- First download Compass from https://www.mongodb.com/products/compass
- Then in the `New Connection` section paste the following connection string:

> mongodb+srv://footballdb:Uh43M8Vnphic0zZE@football-project.fbrsj.mongodb.net/test?authSource=admin&replicaSet=atlas-1eumbu-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true

- Finally you can go to the `football_data` database to see the different collections and it's data.

## Running the app
First make sure you have the 14.15.1 node version
Then install all dependencies with `npm install`

To run the project just run `npm run dev`.
The project should now be running in port `8080` by default. 

## Problems with different node versions:
If you’re using multiple versions for each of your projects, you might use the `nvm use` command every time you need to switch. This gets old very fast and `nvm` doesn’t have a native solution for this problem.

Instead of a manual switching each time you change projects, you may use an automated solution using a script like this at the end of your `.zshrc` file, after the nvm initialization:

```sh
# place this after nvm initialization!
autoload -U add-zsh-hook
load-nvmrc() {
  if [[ -f .nvmrc && -r .nvmrc ]]; then
    nvm use
  elif [[ $(nvm version) != $(nvm version default)  ]]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

Now every time you cd into a directory you’ll switch to the project version if it has the `.nvmrc` inside with a valid version.
If you go out of the directory or cd into a directory that doesn’t have the version file, your shell will use the default one in your system.

## Using the Apollo GraphQL IDE
The project has a GraphQL IDE thanks to the `"apollo-server-express` and `apollo-engine` dependencies.

You can access it at `http://localhost:8080`

## Running with Docker
The project is ready to be used with docker if it's necessary
Just execute `docker-compose up` to run the app in http://localhost:8080

## Testing with Postman
The project also includes a test suite ready to use under the `newman` folder, just import the collection.

## Test reports
Using `newman` and `newman-reporter-htmlextra` the project can make interactive `.html` report files under the `newman` folder, you can find an example in the folder.
To run the tests and make a report just execute `npm run test-report`.
**Note:** The tests take several minutes until completion, be patient