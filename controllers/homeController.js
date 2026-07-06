import * as queries from "../models/queries.js";

const filterMessages = async (req, res) => {
  const messages = await queries.getMessages();
  //if user is vip let them see the message with author info
  if (
    req.isAuthenticated() &&
    (req.user.status === "VIP" || req.user.status == "ADMIN")
  ) {
    return messages;
  } else {
    //if user is a guest or just a regular member, messages only contain the hidden messages
    const filterdMsg = await Promise.all(
      messages.map(async (msg) => {
        if ((await queries.getUserStatus(msg.user_id)) === "ADMIN") {
          //if the message is sent by the admin, don't hide the name and the date(only for guests and reg members)
          return {
            ...msg,
            email: "****@email.com",
            user_id: 0,
          };
        } else {
          //i
          return {
            //if the message is not sent by the admin,hide the name and the date(only for guests and reg members)
            ...msg,
            username: "****",
            email: "****@email.com",
            date: "xx-yy-zz",
            user_id: 0,
          };
        }
      }),
    );
    s;
    return filterdMsg;
  }
};

const getHomePage = async (req, res) => {
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
