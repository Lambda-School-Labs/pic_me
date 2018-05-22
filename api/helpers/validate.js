module.exports = {
  signup: (req, res, next) => {
    const { email, password, firstName, lastName } = req.body;

    if (!email && !password) {
      res.status(422).send({ message: `email and password not provided` });
      return;
    }

    if (!email) {
      res.status(422).send({ message: `email not provided` });
      return;
    }

    if (!password) {
      res.status(422).send({ message: `password not provided` });
      return;
    }

    if (!firstName && !lastName) {
      res.status(422).send({ message: `first and last names not provided` });
      return;
    }

    if (!firstName) {
      res.status(422).send({ message: `first name not provided` });
      return;
    }

    if (!lastName) {
      res.status(422).send({ message: `last name not provided` });
      return;
    }

    next();
  },
};