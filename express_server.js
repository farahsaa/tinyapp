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

//helper function
function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return generateRandomString;
}


//routes

app.get("/urls/new", (req, res) => {
  let templateVars = { username: req.cookies.name, urls: urlDatabase };  
  res.render("urls_new", templateVars);
  });


app.get("/urls", (req, res) => {
  let templateVars = { username: req.cookies.name, urls: urlDatabase };

  res.render("urls_index", templateVars);
});

// /urls/b2xVn2 => http://www.lighthouselabs.ca
// /urls/9sm5xK => http://www.google.com

// /users/:id/posts/:post_id
// /users/1/posts/3
// params = { id: 1, post_id: 3}
// User.find(req.params.id)
// postMessage.find(req.params.post_id)




app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { username: req.cookies.name, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
const longURL = urlDatabase[req.params.shortURL]
 res.redirect(longURL);
});



// POST R: CREATES

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
  res.clearCookie('name');
  res.redirect("/urls")

});

app.post("/login", (req, res) => {
  var username = req.body.username;
  res.cookie('name', username);
  res.redirect("/urls")
});




// LISTENING FOR SOMETHING

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




