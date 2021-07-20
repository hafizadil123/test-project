#  Websockets Service

This project is in an platform for managing all related to reaturants.

## Description

This project contains the Websockets Service code. It is a basic implementation and can be used as starting point for the production service. This code will change as the rest of microservices are created.

## Modules used

- <b>Typescript: </b>TypeScript is an open-source programming language developed and maintained by Microsoft. It is a strict syntactical superset of JavaScript, and adds optional static typing to the language.
- <b>NodeJS: </b> Node.js is an open-source, cross-platform JavaScript run-time environment that executes JavaScript code outside of a browser.
- <b>MongoDB: </b> MongoDB is an open-source document database and leading NoSQL database. MongoDB is written in C++.

## How to start

## Manual

You need to have[Node.js](https://nodejs.org) and [git](https://git-scm.com/) installed before starting the application. (I prefer `yarn` as package manager over `npm`).

### Installation

```sh
# Clone the repository
git clone https://github.com/OrganizationName

# Change working directgry
cd /websockets-service

# Install dependencies
yarn install
```

### Setting variables

In order to start properly, the user should change set some variables in the config folder. The fields for mongo are required in the files `default` and `test`.

```yaml
service:
  mongo:
    uri: fill-this-value
```

### Start development mode

```sh
# Development mode
yarn run dev
```

### Star testing mode

```sh
# Development mode
yarn test
```

### Star production mode

```sh
# Development mode
yarn start
```

## Docker

It is required to have Docker installled

### Create the docker image

```bash
docker build /websockets-service:v0.1
```

### Start the application

```bash
docker run -dit -p 3011:8080 /websockets-service:v0.1
```

## API

Here are listed all events that the service can process

- <b>orders::create</b> Create a order in the database
- <b>orders::created</b> Returns the created order data
- <b>payments::create</b> Create a payment in the database
- <b>payments::created</b> Returns the created payment data

## Author
