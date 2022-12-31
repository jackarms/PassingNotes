const daysjs = require("dayjs");
let now = daysjs();

function formatMessage(userName, txt) {
  return {
    userName,
    txt,
    time: now.format("h:mm a"),
  };
}

module.exports = formatMessage;
