const db = require('../../data/db-config');

/**
  resolves to an ARRAY with all users, each user having { user_id, username }
 */
async function find() {
  const result = await db('users').select('user_id', 'username');
  return result;
}

/**
  resolves to an ARRAY with all users that match the filter condition
 */
async function findBy(filter) {
  const result = await db('users').where(filter).select('*');

    return result;
}

/**
  resolves to the user { user_id, username } with the given user_id
 */
async function findById(user_id) {
  const result = await findBy({ user_id });
  return result.length > 0 ? result[0] : null;
}

/**
  resolves to the newly inserted user { user_id, username }
 */
async function add(user) {
  const id = await db('users').insert(user);
  const newUser = await findById(id);

  return newUser;
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  find,
  findBy,
  findById,
  add
}
