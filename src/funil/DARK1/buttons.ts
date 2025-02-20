export const BUTTONS = {
  PLAN_DAILY:  "𝐃𝐀𝐈𝐋𝐘 𝐏𝐋𝐀𝐍 𝐏𝐔𝐓𝐈𝐍𝐇𝐀𝐒 𝐃𝐄𝐄𝐏 𝐖𝐄𝐁 𝐑$𝟏𝟎😈",
  PLAN_WEEKLY: "𝐒𝐄𝐌𝐀𝐍𝐀𝐋 𝐂𝐎𝐍𝐓𝐄𝐔𝐃𝐎𝐒 𝐏𝐑𝐎𝐅𝐔𝐍𝐃𝐎𝐒 𝐑$𝟏𝟓🔥",
  PLAN_MONTHLY:"𝐌𝐄𝐍𝐒𝐀𝐋 𝐃𝐀𝐑𝐊 𝐖𝐄𝐁 + 𝟖 𝐆𝐑𝐔𝐏𝐎𝐒 𝐑$𝟐𝟎💋",
  PLAN_PREMIUM:"𝐏𝐑𝐄𝐌𝐈𝐔𝐌 𝐏𝐔𝐓𝐈𝐍𝐇𝐀𝐒 + 𝟏𝟎 𝐆𝐑𝐔𝐏𝐎𝐒 𝐑$𝟐𝟓⚡",
  PLAN_DEEP:   "𝐃𝐄𝐄𝐏 𝐖𝐄𝐁 𝐏𝐔𝐓𝐈𝐍𝐇𝐀𝐒 + 𝟐𝟓 𝐆𝐑𝐔𝐏𝐎𝐒 𝐑$𝟑𝟎🎭"
};

export const inlineKeyboard = [
  [{ text: BUTTONS.PLAN_DAILY,   callback_data: "PLAN_DAILY" }],
  [{ text: BUTTONS.PLAN_WEEKLY,  callback_data: "PLAN_WEEKLY" }],
  [{ text: BUTTONS.PLAN_MONTHLY, callback_data: "PLAN_MONTHLY" }],
  [{ text: BUTTONS.PLAN_PREMIUM, callback_data: "PLAN_PREMIUM" }],
  [{ text: BUTTONS.PLAN_DEEP,    callback_data: "PLAN_DEEP" }]
];
