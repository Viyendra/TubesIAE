const express = require('express');
const proxy = require('express-http-proxy');
const cors = require('cors');
const app = express();

const PORT = 8080;

app.use(cors());
app.use(express.json());

app.use('/auth', proxy('http://auth-service:3001'));

app.use('/appointment', proxy('http://appointment-service:3002'));

app.use('/prescription', proxy('http://prescription-service:3003'));

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});