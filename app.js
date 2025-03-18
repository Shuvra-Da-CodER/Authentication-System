const express=require('express');
const app= express();
const cookieParser=require('cookie-parser');
const path=require('path');
const User=require('./models/user.js');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser())   ;

app.get('/',(req,res)=>{
    res.render('index');
});

app.post('/create',async(req,res)=>{
    let {username,email,password,age}=req.body;
    console.log(req.body);
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async(err,hash)=>{
            console.log(hash);
            password=hash;
            let createdUser=await User.create({
                username,
                email,
                password,
                age
            });
            res.send(createdUser);
            console.log(createdUser);

        })
    })
    let token= jwt.sign({email},"shhhhhhh");
    res.cookie('token',token)

    
    
    console.log(req.cookies);
    
});

app.get('/logout',(req,res)=>{
    res.token="";
    res.redirect('/');
})

app.get('/login',async(req,res)=>{
    res.render('login');
})

app.post('/login',async(req,res)=>{
    let user =await User.findOne({email:req.body.email});
    if(!user){
        res.send('Email not registered');
    }
    else{
        bcrypt.compare(req.body.password,user.password,(err,result)=>{
            if(result) {
                let token= jwt.sign(req.body.email,"shhhhhhh");
                res.cookie('token',token)
                res.send('user verified');}
            else res.send('Incorrect password');
        })
    }
})



app.listen(3000);