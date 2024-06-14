const handleProfile = (req, res, dB) => {
  const { id } = req.params;

  let found = false;
  dB.select("*")
    .from("users")
    .where({
      id: id,
    })
    .then((user) => {
      console.log(user[0]);
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Error getting user");
      }
    })
    .catch((err) => res.status(400).json("not found"));
};

module.exports = {
  handleProfile: handleProfile,
};
