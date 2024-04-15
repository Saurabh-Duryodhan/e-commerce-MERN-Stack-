export class User {
  constructor() {}

  getUser = (req, res, next) => {
    console.log(req.user);
    return res.status(200).json({ success: true });
  };
}
