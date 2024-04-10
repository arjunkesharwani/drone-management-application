# Drone-Management-System


## Quick Start

Get started developing

```shell
# Switch to correct node version
nvm use

# install dependencies
npm install


# run application
npm run start

```

---

## Environments

- `.env` sample file and pass the values of following env

```
DB_HOST='localhost'
DB_PORT='27017'
DB_NAME='drone-management-system'
```

- Env defaults are already initialized in project boilerplate.

```
{
  PORT: 3000,
  SESSION_SECRET: 'mySecret',
  DB_HOST: 'localhost',
  DB_NAME: 'drone-management-system',
  DB_PORT: '27017',
  DB_USERNAME: '',
  DB_PASSWORD: '',
  TOKEN_EXPIRY_TIME: '24h'
}
```

---

## Directory Structure

- The Application logic is maintaind in `/src` directory.

**Following is the directory structure of src directory**



- > /controllers
- > /models
- > /services
- > /common
- > /config
- > /middlewares 
- > /interfaces 
- > /routes 
- > /validators 



- `controllers`: The API routes and controller logic should be added here within a folder. `.routes/routes.data.ts` file contains all the open routes of the API. `.controller.ts` file contains the validation and data transformation logic.

- `services`: `.service.ts` Contains the database CRUD logic.

- `models`: `.model.ts` Contains the schema defination of the database collection.

- `common`: Common utilities of the application are configured in this directory.

- `validators`: contains validation schema of the application.

## Start Creating APIs?

There are two key files:

## Install Dependencies

Install all package dependencies (one time operation)

```shell
npm i
```

## Run It

```shell
npm run start
```

## Author

- Arjun Kesharwani - arjun.kesharwani246@gmail.com
