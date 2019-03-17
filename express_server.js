//requires
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');


//middleware
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ["the cat jumped over the moon"],
}))

// In memory database

const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "userRandomID"},
  "9sm5xK": {longURL: "http://www.google.com", userID:"userRandomID"}
};

// global (?)
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "123"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

//helper functions

function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}


function checkEmail(email) {
  for ( userID in users) {
    if (users[userID].email === email) {
      return users[userID]
    }
  } return null
}


function urlsForUser(id) {
  var urls = {};
    for (var shortURL in urlDatabase) {
      if (urlDatabase[shortURL].userID === id){
        urls[shortURL]= urlDatabase[shortURL].longURL
      }
    }
  return urls;
  }
//routes

// GET REQUESTS



app.get("/urls", (req, res) => {
  var userUrls = urlsForUser(req.session.user_id )
  let templateVars = {urls: userUrls, user: users[req.session.user_id]};
  console.log("cookie",req.session.user_id)

  if (users[req.session.user_id]){
  res.render("urls_index", templateVars);
  }
  else {
    res.send("you are not logged in")
  }
});

app.get("/urls/new", (req, res) => {
  let templateVars = { user: users[req.session.user_id] };  
  if (templateVars.user){
    res.render("urls_new", templateVars);
  } else {
  res.redirect("/urls")
  }
});

// ********** EDIT AND FIX THIS REQUEST ***************** //



app.get("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  if(!users[req.session.user_id]){
    res.send("you are not logged in")
  }
  if(urlDatabase[req.params.shortURL].userID === users[req.session.user_id].id){
    let templateVars = {user:req.session.user_id, shortURL: shortURL,
      longURL: urlDatabase[shortURL].longURL};
      res.render("urls_show", templateVars);

  } else {
    res.send("you do not own url")
  }

});

app.get("/u/:shortURL", (req, res) => {
const longURL = urlDatabase[req.params.shortURL].longURL
 res.redirect(longURL);
});



app.get("/register", (req, res) => {
  let templateVars = {user: users[req.session.user_id]}
  res.render("urls_registration", templateVars);
  
});


// **********
app.get("/login", (req, res) =>{
  console.log("cookie", users[req.session.user_id])

  var user = users[req.session.user_id]
  if (user){
    res.redirect("/urls")
  }
  else{res.render("login")
}

  });


// POST REQUESTS

app.post("/register", (req, res) => {
    const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
    if(!email || !password){
      return res.status(400).send('<h2>please fill out both fields</h2>')
    }

    if(checkEmail(email) === true) {
      console.log("Email exists")
      return res.status(400).send('email already exists')
    
    }
    
    const newUser = {
      email: email, 
      password: hashedPassword,
      id: generateRandomString()
    }

    users[newUser.id]= newUser;
    res.redirect("/login")


});


app.post("/urls", (req, res) => {
  var shortURL = generateRandomString();
  var user = users[req.session.user_id]
  if (user){
  urlDatabase[shortURL] = {
    longURL:req.body.longURL,
    userID:req.session.user_id 
  } 
  res.redirect(`/urls/${shortURL}`); 
  }else {
    res.status(403).send("you are not logged in")
  }
         // Respond with 'Ok' (we will replace this)
});

// ****** 
app.post ("/urls/:shortURL/delete", (req, res) => {
  if (users[req.session.user_id]){
  var shortURL = [req.params.shortURL]
  delete urlDatabase[shortURL]
  res.redirect("/urls")
  }else {
    res.status(403).send("you are not logged in")
  }
});

app.post ("/urls/:shortURL/update", (req, res) => {
  if (users[req.session.user_id]){
  var shortURL = req.params.shortURL;
  urlDatabase[shortURL].longURL = req.body.longURL
  res.redirect("/urls")
  } else {
    res.status(403).send("you are not logged in")
  }

});

app.post ("/logout", (req, res) => {
  req.session= null;
  res.redirect("/urls")

});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const user = checkEmail(email);
  const password = req.body.password
  
  if (user && bcrypt.compareSync(password, user.password )) {
    req.session.user_id = user.id
    res.redirect("/urls")
    
  }
  else {
    res.status(403).send("Email or password cannot be found")
  }

});

// LISTENING FOR SOMETHING

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)});