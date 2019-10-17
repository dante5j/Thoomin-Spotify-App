const functions = require('firebase-functions');
const express = require('express');
const app = express();

const cors = require('cors')({origin: true});
app.use(cors);

app.get('/api/helloworld', (req, res) => {
    return res.status(200).json({"message":"EXPRESS WORKS!!!"});
  });

exports.app = functions.https.onRequest(app);