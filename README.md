# Notifications UI

This application allows you to see a feed of notifications, view a particular one in further detail, and create one as well.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

[Docker for Mac](https://docs.docker.com/v17.12/install/)
Postgres
Redis

### Installing

Ensure there is a .env file in the root folder

```
REACT_APP_PORT=3000
API_SERVER_PORT=3001
NGINX_PORT=80
```

To get a development environment running,

```
brew install postgresql redis

brew services start postgresql
brew services start redis

cd notifications-ui
npm i && cd client && npm i && cd ..
yarn dev
```

open a second terminal tab,
```
cd client
yarn start
```

Then go to http://localhost:3000/

## Running the tests

Make sure postgres & redis are running as background services. In another tab,
```
yarn test
```

## Deployment

```
cd notifications-ui
docker-compose up -d
```

To restore to base data: `docker-compose up --build`

Then go to http://localhost/

## External Dependencies

Assumptions made about the following:
* All the following packages are relatively safe at their current versions. I have pinned all of the dependencies at their current versions. Also, I have provided lockfiles.
* The docker images are relatively safe

### Overall
* Postgres Alpine
* Redis Alpine
* Nginx Alpine

### Back End

* cookie-parser
* cross-env
* dotenv
* express
* express-rate-limit
* express-validator
* knex
* morgan
* objection
* pg
* redis
* rotating-file-stream
* debug
* jest
* supertest

### Front End

* axios
* react
* react-dom
* react-router
* react-router-dom
* react-scripts
* styled-components
* jest
* enzyme (didn't get a chance to test the front end)
