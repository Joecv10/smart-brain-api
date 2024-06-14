const handleRegister = (req, res, dB, bcrypt) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json("Incorrect form submition.");
  }

  let hash = bcrypt.hashSync(password);

  dB.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((logInEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            name: name,
            email: logInEmail[0].email,
            joined: new Date(),
          })
          .then((user) => res.json(user[0]));
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json("Unable to register."));
};

module.exports = {
  handleRegister: handleRegister,
};
