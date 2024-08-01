# Project Description

## Introduction
**Buddy-Express** is my own unique take on the popular Express framework with my own implementation.

## Requirements
Here are the key features that our framework will provide:

1. **Installation**: You should be able to install our framework using the command `npm install buddyexpress`.

2. **Application Creation**: You should be able to create an `buddyexpress` app using the following code: `const app = buddyexpress()`.

3. **Middlewares**: Our framework allows you to add middlewares using the `app.use((req, res, next) => {})` or `app.use('/<route>', (req, res, next) => {})`.

4. **Routes**: We support the definition of `get`, `post`, `put`, `delete`, `patch` and `all` routes.

5. **TypeScript Support**: `buddyexpress` is strongly typed using TypeScript.

6. **Response Methods**: The framework includes the response methods `res.status()`, `res.send()`, `res.json()`, and `res.redirect()`.

7. **URL Query Parameters**: You can access URL query parameters using `req.query`.

8. **URL Route Parameters**: You can define routes with parameters. Example: define `/test/:id` and access the `:id` from `req.params`.

9. **Static Files**: `buddyexpress` includes a built-in middleware to serve static files using `app.use(app.static('public'))`.

10. **JSON Body Parser**: `buddyexpress` includes a built-in json body parser middleware `app.json()` using like `app.use(app.json())`.

## Tech Stack
Our framework is built using the following technologies:

- NodeJS
- TypeScript
