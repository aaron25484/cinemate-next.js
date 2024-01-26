# Cinemate Next.js Project

This is a Next.js project created with TypeScript, Prisma, MongoDB, and deployed on Vercel. Jest is used for unit testing, and Jenkins is implemented for CI/CD. Authentication is handled through Auth0.

## Project Overview

Cinemate is a web application developed using Next.js, a React framework. It leverages TypeScript for type-checking, Prisma for database management (MongoDB), and Auth0 for user authentication. The project includes unit tests written with Jest to ensure the reliability of individual components.

## Getting Started

To run the project locally, follow these steps:

1. Install dependencies:

    ```bash
    pnpm install
    ```

2. Run the development server:

    ```bash
    pnpm run dev
    ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building the Project

To build the project for deployment, use the following command:

 ```bash
    pnpm run build
  ```
This will generate a production-ready build in the .next directory.

Running Tests
Jest is used for unit testing. Run the tests with the following command:

```bash
pnpm run test
``````


#### Continuous Integration/Continuous Deployment (CI/CD)
This project is set up with Jenkins for CI/CD. Jenkins is configured to automate the build and deployment processes. It ensures that changes are tested and deployed consistently.

#### Technologies Used
* Next.js: A React framework for building web applications.
* TypeScript: A superset of JavaScript that adds static types.
* Prisma: A database toolkit for TypeScript and Node.js.
* MongoDB: A NoSQL database for storing application data.
* Auth0: A platform for authentication and authorization.
* Jest: A testing framework for JavaScript and TypeScript.
* Jenkins: An automation server for building, testing, and deploying.