const users = {};

const respondJSON = (req, res, status, obj) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(obj));
  res.end();
};

const respondJSONMeta = (req, res, status) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end();
};

const getUsers = (req, res) => {
  const responseJSON = {
    users,
  };

  return respondJSON(req, res, 200, responseJSON);
};

const getUsersMeta = (req, res) => respondJSONMeta(req, res, 200);

const addUser = (req, res, body) => {
  const responseJSON = {
    message: 'Name and age are both required',
  };

  if (!body.name || !body.age) {
    responseJSON.id = 'missingParams';
    return respondJSON(req, res, 400, responseJSON);
  }

  let responseCode = 201; // Created

  if (users[body.name]) {
    responseCode = 204;
  } else {
    users[body.name] = {};
    users[body.name].name = body.name;
  }

  users[body.name].age = body.age;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully!';
    return respondJSON(req, res, responseCode, responseJSON);
  }
  return respondJSONMeta(req, res, responseCode);
};

const notFound = (req, res) => {
  const responseJSON = {
    message: 'The page you are looking for was not found!',
    id: 'notFound',
  };

  return respondJSON(req, res, 404, responseJSON);
};

const notFoundMeta = (req, res) => respondJSONMeta(req, res, 404);

module.exports = {
  getUsers,
  getUsersMeta,
  addUser,
  notFound,
  notFoundMeta,
};
