# GNews-API

## How to run the application

1. Copy the content of the 'env_example' file to create a '.env' file in project root folder. Obtain the API_KEY from 'https://gnews.io/' (Sign up and obtain the API key from the dashboard.) Then change the '.env' file with your API key.

2. Install Npm packages (Node version 16+)

   ```bash
    npm i
   ``` 

3. Run Server

    ```bash
     npm start
    ```

## Testing the API

You can use the GraphiQL interface to test the GraphQL API and execute queries and mutations.

1. Open your browser and navigate to `http://localhost:4000/graphql`.

2. In the GraphiQL interface, you can enter GraphQL queries and mutations to test the API. Here are some examples:

   - Fetch N articles:

     ```
     query {
       articles(max: 5) {
         title
         author
         description
         url
         publishedAt
       }
     }
     ```

   - Find article by title:

     ```
     query {
       article(title: "Your Title Here") {
         title
         author
         description
         url
         publishedAt
       }
     }
     ```

   - Search article by keyword:

     ```
     query {
       search(keyword: "Your Keyword Here") {
         title
         author
         description
         url
         publishedAt
       }
     }
     ```

3. Customize the queries and mutations according to the defined schema and available resolvers.

## Comments

- The solution is a GraphQL API server built with Node.js and Express.
- It integrates with a RESTful API to fetch articles based on different queries.
- The fetched data is cached using the NodeCache library to improve performance.
- The server uses environment variables to store sensitive information like the RESTful API base URL and API key.
- The API supports three queries: articles, article, and search.
- The GraphQL schema defines the Article type with fields like title, author, description, url, and publishedAt.
- The server utilizes the express-graphql middleware to handle GraphQL requests and provide the GraphiQL interface for testing.
- Error handling is implemented for failed API requests and cache retrievals.
- The solution includes a README.md file with instructions for setting up and running the project, testing the API, and additional comments about the solution.
