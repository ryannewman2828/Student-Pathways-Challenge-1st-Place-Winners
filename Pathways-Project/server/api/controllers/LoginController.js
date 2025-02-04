import passport from 'passport';

const LoginController = {};

/*
 * The route responsible for registering the user
 *
 * Used by route:
 * POST /api/v1/register
 *
 * Request Body:
 *   StudentID - The student ID of the user
 *   name - The name of the user registering
 *   password - The password of the user
 */
LoginController.register = (req, res) => {
  const { studentID, name, password } = req.body;

  if (!studentID || !name || !password) {
    return res.status(400).json({ message: 'Missing credentials' });
  }

  passport.authenticate('local-signup', (err, user, info) => {
    // If Passport throws/catches an error
    if (err) {
      return res.status(404).json(err);
    }

    // If a user is found
    if (user) {
      const token = user.generateJwt();
      return res.status(201).json({ token, studentID });
    }

    return res.status(400).json(info);
  })(req, res);
};

/*
 * The route responsible for logging in
 *
 * Used by route:
 * POST /api/v1/login
 *
 * Request Body:
 *   StudentID - The student ID of the user
 *   password - The password of the user
 */
LoginController.login = (req, res) => {
  const { studentID, password } = req.body;

  if (!studentID || !password) {
    return res.status(400).json({ message: 'Missing credentials' });
  }

  passport.authenticate('local-login', (err, user, info) => {
    if (err) {
      return res.status(404).json(err);
    }

    // If a user is found
    if (user) {
      const token = user.generateJwt();
      return res.status(200).json({ token });
    }

    return res.status(401).json(info);
  })(req, res);
};

export default LoginController;
