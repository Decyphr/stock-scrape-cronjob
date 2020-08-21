const express = require('express');
const cron = require('node-cron');
const { request, gql, GraphQLClient } = require('graphql-request');

const getEtradeValues = require("../scraper/etradeScrape");

// TODO: configure correct path to src .env file
require('dotenv').config({ path: __dirname + '/../.env' });


const INSERT_IRA_VALUE = gql`
mutation insert_value($gain: numeric, $assets: numeric, $gainIsPositive: Boolean) {
  insert_ira_values_one(object:{
    daily_gain: $gain,
    net_assets: $assets,
    gain_isPositive: $gainIsPositive
  }) {
    id
  }
}`;


const app = express();
const port = 5000;

// create GraphQL client to send requests with HASURA_ADMIN_SECRET
const gqlClient = new GraphQLClient("https://cunning-hamster-10.hasura.app/v1/graphql", { headers: { "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET } });

app.get('/', (req, res) => {
  res.send("Server Started.");
});

// schedule web scraper
// TODO: set schedule to Daily @ 5PM
cron.schedule("* * * * *", async function () {
  // need to integrate web scrape here
  console.log("Scraping Etrade...");

  const variables = await getEtradeValues();
  // run insert mutation into hasura endpoint
  // TODO: pass in variables from web scrape, gain & assets
  console.log("Pushing data to database");
  return gqlClient.request(INSERT_IRA_VALUE, variables);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

