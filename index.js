require('dotenv').config();  // Loads environment variables from a .env file

const express = require('express');
const { graphqlHTTP } = require('express-graphql');  // Middleware for handling GraphQL requests
const { buildSchema } = require('graphql');  // Helper function to build the GraphQL schema
const axios = require('axios');  // HTTP client for making requests
const NodeCache = require('node-cache');  // In-memory caching library

const cache = new NodeCache({ stdTTL: 3600 });  // Initialize the cache with a standard TTL of 3600 seconds (1 hour)

const baseUrl = process.env.BASE_URL;
const apiKey = process.env.API_KEY;
const port = process.env.PORT;

// Define the GraphQL schema using the buildSchema function
const schema = buildSchema(`
  type Article {
    title: String
    author: String
    description: String
    url: String
    publishedAt: String
  }
  
  type Query {
    articles(max: Int): [Article]
    article(title: String): [Article]
    search(keyword: String): [Article]
  }
`);

// Define the root resolver object containing the resolver functions for each GraphQL query
const root = {
    articles: async ({ max }) => {
        try {
            const cacheKey = `articles:${max || ''}`;  // Generate a cache key based on the maximum number of articles requested
            const cachedData = cache.get(cacheKey);  // Check if the data is already cached
            if (cachedData) {
                return cachedData;  // Return the cached data if available
            }
            const response = await axios.get(`${baseUrl}/top-headlines?category=general&max=${max}&apikey=${apiKey}`);  // Make a request to the RESTful API to fetch articles
            const articles = response.data.articles;
            cache.set(cacheKey, articles);  // Cache the articles for future requests
            return articles;
        } catch (error) {
            throw new Error('Failed to fetch articles!');  // Throw an error if fetching articles fails
        }
    },
    article: async ({ title }) => {
        try {
            const cacheKey = `article:${title}`;  // Generate a cache key based on the article title
            const cachedData = cache.get(cacheKey);  // Check if the data is already cached
            if (cachedData) {
                return cachedData;  // Return the cached data if available
            }
            const response = await axios.get(`${baseUrl}/search?q=${title}&in=title&apikey=${apiKey}`);  // Make a request to the RESTful API to search for articles by title
            const articles = response.data.articles;
            cache.set(cacheKey, articles);  // Cache the articles for future requests
            return articles;
        } catch (error) {
            throw new Error('Failed to find article!');  // Throw an error if finding the article fails
        }
    },
    search: async ({ keyword }) => {
        try {
            const cacheKey = `search:${keyword}`;  // Generate a cache key based on the search keyword
            const cachedData = cache.get(cacheKey);  // Check if the data is already cached
            if (cachedData) {
                return cachedData;  // Return the cached data if available
            }
            const response = await axios.get(`${baseUrl}/search?q=${keyword}&apikey=${apiKey}`);  // Make a request to the RESTful API to search for articles by keyword
            const articles = response.data.articles;
            cache.set(cacheKey, articles);  // Cache the articles for future requests
            return articles;
        } catch (error) {
            throw new Error('Failed to search article!');  // Throw an error if searching for articles fails
        }
    }
};

const app = express();

app.use(
    '/graphql',
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true
    })
);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);  // Print a message indicating that the server is running
});
