const express = require('express');
const bodyParser = require('body-parser');
//mongodb client
const {mongodbClient} = require('./config/mongodbConfig');
//aws client
const {s3Client,ListBucketsCommand} = require('./config/awsConfig');
const cors = require("cors");
const userRoutes = require('./APIs/routes/userRoutes');
const unAuthRoutes = require('./APIs/routes/unAuthRoutes');
const authMiddlewarefunc = require('./middleware/authMiddleware');
const app = express();

require('dotenv').config();

//app.use(express.json()); // for parsing application/json
app.use(bodyParser.json());

//cors option
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  
  app.use(cors(corsOptions));

const port = 5000;

//routes
app.use('/user',authMiddlewarefunc,userRoutes);
app.use('/',unAuthRoutes);


app.listen(port, ()=>{
    console.log(`Api-Gateway server is running on Port ${port}`);
});

//MongoDB connection
mongodbClient.catch(error => {
    console.error(error);
});

//Check if aws bucket is accessible
const testS3 = async () =>{
    try {
        const data = await s3Client.send(new ListBucketsCommand({}));
        console.log("AWS Bucket Accessible",data.Buckets);
    } catch (error) {
        console.error(error);
    }
};

//call the test function
testS3();