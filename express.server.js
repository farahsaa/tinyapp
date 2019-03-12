var express = require("express");
var app = express();
var PORT = 8080; // default port 8080

app.set("view engine", "ejs");


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });

app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
  });

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  console.log('db================', templateVars)
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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});