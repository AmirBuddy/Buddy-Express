# Project Description

## Introduction
**Amir-Express** is my own unique take on the popular Express framework. I decided to create my own version of this framework.

## Requirements
Here are the key features that our framework will provide:

1. **Installation**: You should be able to install our framework using the command `npm install amirexpress`.

2. **Application Creation**: You should be able to create an AmirExpress app using the following code: `const app = amirexpress()`.

3. **Middlewares**: Our framework allows you to add middlewares using the `app.use((req, res, next) => {})` function.

4. **Routes**: We support the definition of `get`, `post`, `put`, and `delete` routes.

5. **TypeScript Support**: AmirExpress is strongly typed using TypeScript.

6. **Response Methods**: The framework includes the response methods `res.end()`, `res.json()`, and `res.redirect()`.

7. **URL Query Parameters**: You can access URL query parameters using `req.query`.

8. **Static Files**: AmirExpress includes a built-in middleware to serve static files.

## Tech Stack
Our framework is built using the following technologies:

- NodeJS
- TypeScript