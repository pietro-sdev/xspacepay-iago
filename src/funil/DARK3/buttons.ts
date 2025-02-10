// src/funil/buttons.ts
export const BUTTONS = {
    language: [
      [
        { text: "🇧🇷 Brasil", callback_data: "lang_br" },
        { text: "🇺🇸 USA", callback_data: "lang_us" },
        { text: "🇪🇸 España", callback_data: "lang_es" },
      ],
    ],
    colors: {
      br: [
        [{ text: "🔒𝐃𝐙𝟔+ 𝐀𝐂𝐄𝐒𝐒𝐎 𝐑𝐄𝐒𝐓𝐑𝐈𝐓𝐎🔒 R$ 9,90", callback_data: "adquirir_10_00" }],
        [{ text: "🖤𝐒𝐄𝐌𝐀𝐍𝐀 𝐒𝐔𝐁 𝐏𝐑𝐎𝐅𝐔𝐍𝐃𝐀🖤 R$ 13,90 50%OFFF", callback_data: "adquirir_15_00" }],
        [{ text: "⚫𝐕𝐈𝐓𝐀𝐋𝐈𝐂𝐈𝐎 𝐒𝐄𝐆𝐑𝐄𝐃𝐎⚫ + 3 Grupos R$ 19,90", callback_data: "adquirir_20_00" }],
        [{ text: "🔗𝐂𝐎𝐌𝐁𝐎 𝐒𝐔𝐁 𝐄𝐋𝐈𝐓𝐄🔗 + 10 Grupos R$ 26,90", callback_data: "adquirir_25_00" }],
        [{ text: "👑𝐌𝐄𝐆𝐀 𝐏𝐀𝐂𝐊 𝐃𝐙𝟔+👑 15 Categorias R$ 39,90", callback_data: "adquirir_30_00" }],
      ],
      us: [
        [{ text: "🔒𝐃𝐙𝟔+ 𝐑𝐄𝐒𝐓𝐑𝐈𝐂𝐓𝐄𝐃 𝐀𝐂𝐂𝐄𝐒𝐒🔒 $9.90", callback_data: "adquirir_10_00" }],
        [{ text: "🖤𝐃𝐄𝐄𝐏 𝐒𝐔𝐁 𝐖𝐄𝐄𝐊🖤 $13.90 50%OFF", callback_data: "adquirir_15_00" }],
        [{ text: "⚫𝐒𝐄𝐂𝐑𝐄𝐓 𝐋𝐈𝐅𝐄𝐓𝐈𝐌𝐄⚫ + 3 Groups $19.90", callback_data: "adquirir_20_00" }],
        [{ text: "🔗𝐄𝐋𝐈𝐓𝐄 𝐒𝐔𝐁 𝐂𝐎𝐌𝐁𝐎🔗 + 10 Groups $26.90", callback_data: "adquirir_25_00" }],
        [{ text: "👑𝐌𝐄𝐆𝐀 𝐏𝐀𝐂𝐊 𝐃𝐙𝟔+👑15 Categories $39.90", callback_data: "adquirir_30_00" }],
      ],
      es: [
        [{ text: "🔒𝐃𝐙𝟔+ 𝐀𝐂𝐂𝐄𝐒𝐎 𝐑𝐄𝐒𝐓𝐑𝐈𝐂𝐓𝐎🔒 € 9,90", callback_data: "adquirir_10_00" }],
        [{ text: "🖤𝐒𝐄𝐌𝐀𝐍𝐀 𝐒𝐔𝐁 𝐏𝐑𝐎𝐅𝐔𝐍𝐃𝐀🖤 € 13,90 50%OFF", callback_data: "adquirir_15_00" }],
        [{ text: "⚫𝐕𝐈𝐓𝐀𝐋𝐈𝐂𝐈𝐎 𝐒𝐄𝐆𝐑𝐄𝐓𝐎⚫ + 3 Grupos € 19,90", callback_data: "adquirir_20_00" }],
        [{ text: "🔗𝐂𝐎𝐌𝐁𝐎 𝐒𝐔𝐁 𝐄𝐋𝐈𝐓𝐄🔗 + 10 Grupos € 26,90", callback_data: "adquirir_25_00" }],
        [{ text: "👑𝐌𝐄𝐆𝐀 𝐏𝐀𝐂𝐊 𝐃𝐙𝟔+👑 15 Categorías € 39,90", callback_data: "adquirir_30_00" }],
      ],
    },
    vip: {
      br: [
        [{ text: "Acessar Grupo VIP", url: "https://t.me/+cJfUvPasqPU5ZWQx" }],
      ],
      us: [
        [{ text: "Access VIP Group", url: "https://t.me/+cJfUvPasqPU5ZWQx" }],
      ],
      es: [
        [{ text: "Acceder al Grupo VIP", url: "https://t.me/+cJfUvPasqPU5ZWQx" }],
      ],
    },
    paymentMethod: {
      us: [
        [
          { text: "💳 Pay with PayPal", callback_data: "pay_with_paypal" },
          { text: "💳 Pay with Stripe", callback_data: "pay_with_stripe" },
        ],
      ],
      es: [
        [
          { text: "💳 Paga con Stripe", callback_data: "pay_with_stripe" },
          { text: "💳 Paga con PayPal", callback_data: "pay_with_paypal" },
        ],
      ],
    },
    discount: {
      br: [
        [{ text: "🔗 Pague com desconto agora", callback_data: "pagar_com_desconto" }],
      ],
      us: [
        [{ text: "🔗 Pay with discount now", callback_data: "pay_with_discount" }],
      ],
      es: [
        [{ text: "🔗 Paga con descuento ahora", callback_data: "pagar_con_descuento" }],
      ],
    },

    CROSS_UPSELL_BUTTONS: {
  br: [
    { text: "Conteúdo Premium Extra 🔥", callback_data: "cross_sell_conteudo" },
    { text: "VIP BLACKROOM - R$13,97🔥", callback_data: "upsell_anual" }
  ],
  us: [
    { text: "Premium Extra Content 🔥", callback_data: "cross_sell_conteudo" },
    { text: "VIP BLACKROOM - $13.97🔥", callback_data: "upsell_anual" }
  ],
  es: [
    { text: "Contenido Extra Premium 🔥", callback_data: "cross_sell_conteudo" },
    { text: "VIP BLACKROOM - 13,97€🔥", callback_data: "upsell_anual" }
  ]
  },
  };
  