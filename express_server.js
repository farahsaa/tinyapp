//requires
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser')


//middleware
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(cookieParser())

// In memory database

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// global (?)
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

//helper function
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
  }
  return false;
}

//routes


// GET REQUESTS


app.get("/urls/new", (req, res) => {
  let templateVars = { user: users[req.cookies.user_id], urls: urlDatabase };  
  res.render("urls_new", templateVars);
  });


app.get("/urls", (req, res) => {
  let templateVars = { user: req.cookies.user_id, urls: urlDatabase };

  res.render("urls_index", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { user: req.cookies.user_id, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
const longURL = urlDatabase[req.params.shortURL]
 res.redirect(longURL);
});



app.get("/register", (req, res) => {
  res.render("urls_registration");
  
});


// **********
app.get("/login", (req, res) =>{
  res.render("login");
  });


// POST REQUESTS

app.post("/register", (req, res) => {

  const email = req.body.email;
  const password = req.body.password;
    if(!email || !password){
      return res.status(400).send('<h2>please fill out both fields</h2>')

      // res.redirect("/urls")
    }

    if(checkEmail(email)=== true) {
      console.log("Email exists")
      return res.status(400).send('email already exists')
    
    }
    
    const newUser = {
      email: email, 
      password: password,
      id: generateRandomString()
    }

    users[newUser.id]= newUser;
    console.log(users);
    res.cookie('user_id', newUser.id);

    res.redirect("/urls")


});


app.post("/urls", (req, res) => {
  var shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls/:shortURL");         // Respond with 'Ok' (we will replace this)
});

// ****** 
app.post ("/urls/:shortURL/delete", (req, res) => {
  var shortURL = [req.params.shortURL]
  delete urlDatabase[shortURL]
  res.redirect("/urls")

});

app.post ("/urls/:shortURL/update", (req, res) => {
  var shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL
  res.redirect("/urls")

});
app.post ("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls")

});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const user = checkEmail(email);
  if (user && user.password === req.body.password) {
    
    res.cookie('user_id', user.id)
    res.redirect("/urls")

  }
  else if (user === false)
    res.status(403).send("Email cannot be found")



     
  // }
  // else {
  //   res.status(403).send("Bad password")

  // }
  // res.cookie('name', username);

});


// LISTENING FOR SOMETHING

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




