import * as queries from "../models/queries.js";

const messageDeleteController = async (req, res) => {
  if (req.isAuthenticated() && req.user.status === "ADMIN") {
    const { messageId } = req.params;
    if (await queries.deleteThatMessage(messageId)) {
      res.sendStatus(200);
      return;
    } else {
      res.sendStatus(500);
      return;
    }
  } else {
    res.sendStatus(401);
    return;
  }
};

export { messageDeleteController };
