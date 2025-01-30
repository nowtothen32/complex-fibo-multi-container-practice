const keys = require('./keys');

// Express App Setup
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres Client Setup
const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort,
    ssl: process.env.NODE_ENV !== 'production' ? false : {
        rejectUnauthorized: false
    },
});

pgClient.on('connect', (client) => {
    client.query('CREATE TABLE IF NOT EXISTS values (number INT)')
        .catch((err) => console.error(err));
});

// Redis Client Setup
const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

redisClient.on('error', () => console.log('Lost Redis connection'));