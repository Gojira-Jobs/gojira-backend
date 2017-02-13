var express = require('express');
var app = express();
var bodyParser =require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var cors=require('cors');
var jwt = require('jsonwebtoken');
var config = require('./config');
var User = require('./app/models/user');
var UserRouter = require('./app/routes/userRoutes');
var PostRouter = require('./app/routes/postRouter');
var userPromises = require('./app/promises/userPromises');
var Hr=require('./app/models/admin').hrSchema;
var commonlogin = require('./app/routes/commonroute');
var superlogin = require('./app/routes/superlogin');
var auth_user_route = require('./app/routes/userroute');//user route
var hr_route = require('./app/routes/adminroute');// admin route
var auth_super_route = require('./app/routes/superroute');// super user route
var user_regis = require('./app/routes/userregistration');// user registration route
mongoose.connect(config.url);
var db = mongoose.connection;
mongoose.set('debug', true);
db.on('error',console.error.bind(console,'Connection Error:'));
db.once('open',()=>{
    console.log('Connected Successfully Done......');
});
app.set('Supersecret',config.secret);
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.use(morgan('dev'));

app.get('/',(req,res,next)=>{
    res.end("Connected Successfully...");
});
function addInitial(obj){
    return new Promise((resolve,reject)=>{
        Hr.create(obj,(err,docs)=>{
            if(err)
                reject(err);
            else
                resolve(docs);
        });
    });
}
app.get('/setup',(req,res,next)=>{
    
   addInitial({name:"Ajit jain",email:"jainajit194@gmail.com",password:"ajitjain",gender:"Male"}).then((docs)=>{
           res.json(docs);
    }).catch((err)=>{
            console.log(err);
            res.end("Failed..")
    })

    
})
app.use('/api/register',user_regis);
app.use('/api/authenticate',commonlogin);
app.use('/api/user',UserRouter);
app.use('/api/super/login',superlogin);
app.use('/api/user/auth',auth_user_route);
app.use('/api/hr',hr_route);
app.use('/api/super/auth',auth_super_route);
app.use('/api',PostRouter);

app.listen(8000);
console.log("Server is Running...");