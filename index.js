const server = require('./api/server.js');

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

test();

async function test() {
  const users = require('./api/users/users-model');
  console.log(await users.find());
console.log(await users.findBy({username: 'kelly'}))
  console.log(await users.findById(1))

  // console.log(await users.add({username: 'kelly', password: 'blablahash'}))
}
