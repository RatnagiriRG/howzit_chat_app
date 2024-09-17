const messageModel = require("../model/messageModel");

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;

    if (!from || !to || !message) {
      return res
        .status(400)
        .json({ msg: "All fields (from, to, message) are required." });
    }

    const data = await messageModel.create({
      // Use messageModel here
      message: message,
      users: [from, to],
      sender: from,
    });

    if (data) {
      return res.json({ msg: "Message added successfully" });
    } else {
      return res
        .status(500)
        .json({ msg: "Failed to add message to the database" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await messageModel
      .find({
        users: {
          $all: [from, to],
        },
      })
      .sort({ updatedAt: 1 });
    const projectMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message,
      };
    });
    res.json(projectMessages);
  } catch (error) {
    next(error);
  }
};
