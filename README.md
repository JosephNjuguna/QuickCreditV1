# QuickCreditV1

Quick Credit is an online lending platform that provides short term soft loans to individuals. This
helps solve problems of financial inclusion as a way to alleviate poverty and empower low
income earners.

## BADGES.
[![Coverage Status](https://coveralls.io/repos/github/JosephNjuguna/QuickCreditV1/badge.svg?branch=develop)](https://coveralls.io/github/JosephNjuguna/QuickCreditV1?branch=develop)
[![Build Status](https://travis-ci.com/JosephNjuguna/QuickCreditV1.svg?branch=develop)](https://travis-ci.com/JosephNjuguna/QuickCreditV1)
[![Maintainability](https://api.codeclimate.com/v1/badges/0ddd0dd44017b6b968b0/maintainability)](https://codeclimate.com/github/JosephNjuguna/QuickCreditV1/maintainability)



## API ENDPOINTS

| Resource URL                    | Methods | Description                 |
| -------------------------------- | ------- | --------------------------- |
| /api/v1/signup                   | POST    | Create an account           |
| /api/v1/login                    | POST    | Login                       |
| /api/v1/profile                  | GET     | user view profile           |
| /api/v1/users                    | GET     | admin get all users         |
| /api/v1/user/4                   | GET     | admin get one user          |
| /api/v1/user/{user_email}/verify | PATCH   | admin verify user           |
| /api/v1/requestloan              | POST    | user request loan           |
| /api/v1/viewloanrequest          | GET     | user view their loan request                 |
| /api/v1/loan/1                   | PATCH   | admin accept loan application                |
| /api/v1/payloan/1                | POST    |  user pay loan                               |
| /api/v1/loans                    | GET     | admin get all loan applications              |
| /api/v1/loan/1                   | GET     | admin get a single loan application          |
| /api/v1/loan?status=accepted&repaid=true  | GET     | admin get all loans fully paid      |
| /api/v1/loan?status=accepted&repaid=false | GET     | admin get all loans not fully paid  |
| /api/v1/loan?status=pending&repaid=false  | GET     | admin get all loans not accepted yet|
| /api/v1/payments                 | GET     | admin Get all loans repayment history        |
| /api/v1/paymenthistory/1         | GET     | user view his/her repayment history          |
| /api/v1/groups/:id               | GET     | Get one group                                |


## Tools Used

- Language: Javascript
- Server environment: Node.js (A javascript server side environment which can help you build web applications,microservices and APIs)
- Back-end framework: Express (A server side web framework which can help you build back-end applications and APIs fast.)
- Testing library: Mocha.js (A javascript library used for unit testing)
- Assertion library: Chai (A Javascript library to create assertions used in testing)
- Continuous integration: Travis CI
- Test coverage: nyc (A javascript library used to generate coverage reports)
- Test coverage badge: Coveralls (It shows test coverage statistics)
- Front-end deployment: Github Pages
- Back-end deployment: Heroku

### Github Pages link

[Quick Credit UI](https://josephnjuguna.github.io/QuickCredit/UI/index.html)

### Heroku link Example

[Quick Credit Endpoints](https://quickcredv1.herokuapp.com/api-docs/)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Prerequisites
```
npm
```
you can install **NPM**  in your machine using this [link](https://nodejs.org/en/download/). choose your machine OS to get started.
## Installing

The installation of this application is fairly straightforward, After cloning this repository to your local machine,`cd` into the package folder using your terminal and run the following

```
> npm install
```

It will install the node_modules which will help you run the project on your local machine.

Before running the server ensure that you create a  **.env** file.
Inside the **.env** file  add the following:
```
PORT = 3000
JWT_KEY = **your secret key** random values and digits.
```

## Run the server

```
$ npm start
```

## Run the test

```
$ npm test
```
# API ENDPOINTS DATA:
 use this data to test the api endpoint. feel free to change the data.
 
 **POST /api/v1/signup**
 ```
    firstname:Joe
    lastname:njuguna
    address:Nairobi,Kenya
    email:joe@gmail.com
    password:qwerQ@qwerre123
```

**POST /api/v1/login** (user)
```
email:joe@gmail.com
password:qwerQ@qwerre123
```

**POST /api/v1/login** (admin)
```
email:admin123@gmail.com
password:qwerQ@qwerre123
```

**GET /api/v1/profile**

```
copy token from login api endpoint result and paste it in header of this api endpoint as shown below.
```

![Screencast](/documentation/screenshots/tokenprofile.png)

**GET /api/v1/users** (admin view all users).
to use this API endpoint. Follow this steps.
```
1. log in as admin.
2. copy the token and paste it in this endpoint header as shown in screenshot above
```

**GET /api/v1/user/4** (admin view one user).
To use this API endpoint. Follow this steps.
```
1. log in as admin.
2. copy the token and paste it in this endpoint header as shown in screenshot above.
3. the results will be details of user with `ID` number 4.
```

**PATCH /api/v1/user/josephnjuguna482@gmail.com/verify**    (admin verify user).

**NOTE: the email can be change to any user with the email given as parameter.

```
status:verified.
```

**POST /api/v1/requestloan**
**ensure you have user token**

```
amount:2000
```

**GET /api/v1/viewloanrequest** (user view loan request status).
```
ensure you have token in the header
```

**PATCH /api/v1/loan/1**
use admin token.
```
status:accepted
```

**POST /api/v1/payloan/1**
use user token in this endpoint
```
amount:575
```

# ADMIN ENDPOINTS.
in the following API endpoint please use  admin token.

1. admin view all loans.

```
/api/v1/loans
```

2. admin view single loan.
```
/api/v1/loan/1
```

3. admin view loans fully paid.
```
/api/v1/loan?status=accepted&repaid=true
```

4. admin view loans not fully paid.
```
/api/v1/loan?status=accepted&repaid=false
```

5. loans that the admin has not yet accepted
```
/api/v1/loan?status=pending&repaid=false
```

6. admin check all loans repyament history
```
/api/v1/payments
```

# USER
use user token.

1. user view their loan repayment history.
```
/api/v1/paymenthistory/1
```





**Version 1.0.0**

## Contributor

- Joseph Njuguna <josephnjuguna482@gmail.com>

---
