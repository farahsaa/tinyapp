//requires
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
//middleware
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

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
app.get("/", (req, res) => {
  res.send("Hello!");
});


app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });

app.get("/urls/new", (req, res) => {
    res.render("urls_new");
  });

  

app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
  });

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  // console.log('db================', templateVars)
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
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
const longURL = urlDatabase[req.params.shortURL]
 res.redirect(longURL);
});


app.post("/urls", (req, res) => {
  var shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls/:shortURL");         // Respond with 'Ok' (we will replace this)
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});