import * as queries from "../models/queries.js";

const filterMessages = async (req, res) => {
  const messages = await queries.getMessages();
  if (!req.isAuthenticated()) {
    const filterdMsg = messages.map((msg) => {
      return {
        ...msg,
        username: "****",
        email: "****@email.com",
        date: "xx-yy-zz",
        user_id: 0,
      };
    });
    return filterdMsg;
  } else if (req.isAuthenticated()) {
    return messages;
  }
};

const getHomePage = async (req, res) => {
  console.log(await filterMessages(req, res));
  if (req.isAuthenticated()) {
    res.render("home.ejs", {
      user: req.user,
      messages: await filterMessages(req, res),
    });
  } else {
    res.render("home.ejs", { messages: await filterMessages(req, res) });
  }
};

export { getHomePage };
