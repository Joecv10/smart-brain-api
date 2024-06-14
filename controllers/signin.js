const handleSignin = (req, res, dB, bcrypt) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("Incorrect form submition.");
  }

  dB.select("email", "hash")
    .from("login")
    .where({
      email: email,
    })
    .then((data) => {
      let isValid = bcrypt.compareSync(password, data[0].hash); // true

      if (isValid) {
        return dB
          .select("*")
          .from("users")
          .where({
            email: req.body.email,
          })
          .then((user) => {
            console.log(user[0]);
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("Unable to get user"));
      } else {
        res.status(400).json("Wrong Credentials");
      }
    })
    .catch((err) => res.json("Wrong Credentials"));
};

module.exports = {
  handleSignin: handleSignin,
};
