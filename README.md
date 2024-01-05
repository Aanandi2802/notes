# Notes App
> The notes application offers a comprehensive set of features, allowing users to create, read, update, and delete notes. Additionally, it facilitates seamless sharing of notes with other users, and provides a convenient search functionality to explore both personal and shared notes effortlessly.
---

## Prerequisites
This project requires NodeJS (version 8 or later) and NPM.
[Node](http://nodejs.org/) and [NPM](https://npmjs.org/) are really easy to install.
To make sure you have them available on your machine,
try running the following command.

```sh
$ npm -v && node -v
10.2.3
v20.10.0
```

## Instructions

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)

Start with cloning this repo on your local machine:

```sh
$ git clone https://github.com/Aanandi2802/notes.git
$ cd notes
```
Follow these instructions to run the code and tests locally:

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Configure Environment Variables:**
    - Create a new file in the root directory named `.env`.
   - Open the `.env` file and add the following:
    ```env
     ACCESS_TOKEN_SECRET=<yourAccessTokenSecret>
     MONGODB_CONNECTION_URL=<yourMongoDBConnectionURL>
     ```
   - Replace `<yourAccessTokenSecret>` with your actual access token secret.
   - Replace `<yourMongoDBConnectionURL>` with your actual MongoDB connection URL.

3. **Run the Application:**
   - To start the application:
     ```bash
     node server.js
     ```
   - Alternatively, for development with automatic server restarts:
     ```bash
     npm run devStart
     ```

4. **Run Tests:**
   - To run tests:
     ```bash
     npm test
     ```

5. **Check Test Coverage:**
   - To check coverage:
     ```bash
     npm run test:coverage
     ```

6. **Test Endpoints (VS Code):**
   - Install the REST Client extension in VS Code.
   - Open the `requests.rest` file.
   - Change data and replace tokens after signup/login.
  
## Built with

This project utilizes several libraries to enhance functionality, manage dependencies, and streamline the development and testing processes. Here's a breakdown of the chosen libraries:

### 1. [Express](https://expressjs.com/)
   - **Purpose**: Web application framework for building robust and scalable server-side applications.
   - **Why Chosen**: Express is known for its simplicity, flexibility, and wide community support, making it an excellent choice for building web servers and APIs.

### 2. [MongoDB](https://www.mongodb.com/)
   - **Purpose**: NoSQL database for storing and managing data.
   - **Why Chosen**: MongoDB is a popular choice for its flexibility, scalability, and ease of integration with Node.js. It's well-suited for handling document-oriented data in a JavaScript environment.

### 3. [Mongoose](https://mongoosejs.com/)
   - **Purpose**: MongoDB object modeling for Node.js.
   - **Why Chosen**: Mongoose simplifies working with MongoDB by providing a schema-based solution, validation, and support for queries. It enhances the interaction between the Node.js application and the MongoDB database.

### 4. [Express Rate Limit](https://www.npmjs.com/package/express-rate-limit)
   - **Purpose**: Middleware for rate limiting HTTP requests.
   - **Why Chosen**: Express Rate Limit helps prevent abuse by controlling the rate at which requests are allowed. This is crucial for protecting the server from potential DDoS attacks and ensuring fair usage.

### 5. [Bcrypt](https://www.npmjs.com/package/bcrypt)
   - **Purpose**: Library for hashing passwords.
   - **Why Chosen**: Bcrypt is a widely-used library for securely hashing passwords, making it a solid choice for user authentication. It adds a layer of security by protecting sensitive user data.

### 6. [JSON Web Token (JWT)](https://www.npmjs.com/package/jsonwebtoken)
   - **Purpose**: Library for generating and verifying JSON web tokens.
   - **Why Chosen**: JWTs are a standard for token-based authentication. This library facilitates secure communication between the client and server by encoding information in a token.

### 7. [Dotenv](https://www.npmjs.com/package/dotenv)
   - **Purpose**: Zero-dependency module that loads environment variables from a .env file.
   - **Why Chosen**: Dotenv simplifies the process of managing environment variables, allowing for a more secure configuration of sensitive information such as database credentials.

### 8. [Jest](https://jestjs.io/)
   - **Purpose**: JavaScript testing framework.
   - **Why Chosen**: Jest provides an easy-to-use and feature-rich environment for testing JavaScript and Node.js applications. It supports various testing types, including unit and integration testing.

### 9. [Supertest](https://www.npmjs.com/package/supertest)
   - **Purpose**: HTTP assertions library often used with testing frameworks like Jest.
   - **Why Chosen**: Supertest simplifies testing HTTP requests and responses, enabling thorough and efficient testing of API endpoints.

### 10. [Nodemon](https://www.npmjs.com/package/nodemon)
   - **Purpose**: Utility that automatically restarts the server on file changes during development.
   - **Why Chosen**: Nodemon enhances the development workflow by eliminating the need to manually restart the server after code changes.

### 11. [Jest Dev Server](https://www.npmjs.com/package/jest-dev-server)
   - **Purpose**: Jest utility for managing development servers during testing.
   - **Why Chosen**: Jest Dev Server simplifies the process of starting and stopping servers during test runs, ensuring a seamless integration of server-related tests.

### 12. [Jest Express](https://www.npmjs.com/package/jest-express)
   - **Purpose**: Jest utility for mocking Express applications during testing.
   - **Why Chosen**: Jest Express facilitates the creation of mock Express applications, allowing for isolated testing of routes and middleware.

### 13. [Istanbul](https://www.npmjs.com/package/istanbul)
   - **Purpose**: JavaScript code coverage tool.
   - **Why Chosen**: Istanbul provides insights into code coverage, helping to identify areas that require additional testing and ensuring comprehensive test coverage.

### 14. [Babel](https://babeljs.io/)
   - **Purpose**: JavaScript compiler that allows the use of the latest ECMAScript features.
   - **Why Chosen**: Babel enables writing modern JavaScript code without worrying about compatibility issues. It ensures that the code can run on various environments by transpiling it to an older ECMAScript version.

Feel free to explore the documentation of each library for more details on their usage and features.

```
Happy coding!
```