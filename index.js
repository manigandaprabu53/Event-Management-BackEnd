import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import AppsRoutes from './Src/AppRoutes/index.js';


const app = express();

app.use(cors());
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '10mb'}))
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({limit: '10mb'}))
app.use(AppsRoutes)

app.listen(process.env.PORT, ()=>console.log(`App is running on ${process.env.PORT}`));
