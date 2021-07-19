const bcrypt = require('bcryptjs');
const User = require('../users/users-model');


/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
/** @type {import("express").RequestHandler} */
function restricted(req, res, next) {
  if (req.session && req.session.user) {
    next();
  }
  else {
    res.status(401).json({ message: "You shall not pass!" });
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
/** @type {import("express").RequestHandler} */
async function checkUsernameFree(req, res, next) {
  if (!req.body.username || typeof req.body.username !== 'string') {
    res.status(422).json({ message: "Username required" });
    return;
  }

  const username = req.body.username.trim();
  const result = await User.findBy({ username });

  if (result.length > 0) {
    res.status(422).json({ message: "Username taken" });
    console.log(result);
  }
  else {
    req.newUser = { username };
    next();
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
/** @type {import("express").RequestHandler} */
async function checkUsernameExists(req, res, next) {
  const { username } = req.body;

  if (!username || typeof username !== 'string' || username.length === 0) {
    res.status(401).json({ message: "invalid credentials" });
    return;
  }

  const user = await User.findBy({ username });

  if (!user || user.length !== 1) {
    res.status(401).json({ message: "invalid credentials" });
  }
  else {
    req.user = user[0];
    next();
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
/** @type {import("express").RequestHandler} */
function checkPasswordLength(req, res, next) {
  if (!req.body.password || typeof req.body.password !== 'string' || req.body.password.length <= 3) {
    res.status(422).json({ message: "Password must be longer than 3 chars" });
  }
  else {
    req.newUser.password = bcrypt.hashSync(req.body.password);
    next();
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
}
