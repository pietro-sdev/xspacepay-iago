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
        [{ text: "💎 𝐐𝐆 𝐃𝐀𝐒 𝐍𝐈𝐍𝐅𝐄𝐓𝐈𝐍𝐇𝐀𝐒 𝐑$ 𝟗,𝟗𝟎", callback_data: "adquirir_10_00" }],
        [{ text: "🔥 𝐒𝐄𝐌𝐀𝐍𝐀 𝐒𝐄𝐂𝐑𝐄𝐓𝐀 𝐑$ 𝟏𝟑,𝟗𝟎 (𝟓𝟎% 𝐎𝐅𝐅)", callback_data: "adquirir_15_00" }],
        [{ text: "🌟 𝐕𝐈𝐓𝐀𝐋𝐈𝐂𝐈𝐎 + 𝟓 𝐆𝐑𝐔𝐏𝐎𝐒 𝐑$ 𝟏𝟗,𝟗𝟎", callback_data: "adquirir_20_00" }],
        [{ text: "👑 𝐏𝐀𝐂𝐊 𝐄𝐗𝐂𝐋𝐔𝐒𝐈𝐕𝐎 + 𝟏𝟎 𝐆𝐑𝐔𝐏𝐎𝐒 𝐑$ 𝟐𝟔,𝟗𝟎", callback_data: "adquirir_25_00" }],
        [{ text: "🌹 𝐌𝐄𝐆𝐀 𝐏𝐀𝐂𝐊 𝟏𝟓 𝐂𝐀𝐓𝐄𝐆𝐎𝐑𝐈𝐀𝐒 𝐑$ 𝟑𝟗,𝟗𝟎", callback_data: "adquirir_30_00" }],
      ],
      us: [
        [{ text: "💎 𝐐𝐆 𝐕𝐈𝐑𝐆𝐈𝐍𝐒 $𝟗.𝟗𝟎", callback_data: "adquirir_10_00" }],
        [{ text: "🔥 𝐒𝐄𝐂𝐑𝐄𝐓 𝐖𝐄𝐄𝐊 $𝟏𝟑.𝟗𝟎 (𝟓𝟎% 𝐎𝐅𝐅)", callback_data: "adquirir_15_00" }],
        [{ text: "🌟 𝐋𝐈𝐅𝐄𝐓𝐈𝐌𝐄 + 𝟓 𝐆𝐑𝐎𝐔𝐏𝐒 $𝟏𝟗.𝟗𝟎", callback_data: "adquirir_20_00" }],
        [{ text: "👑 𝐄𝐗𝐂𝐋𝐔𝐒𝐈𝐕𝐄 𝐏𝐀𝐂𝐊 + 𝟏𝟎 𝐆𝐑𝐎𝐔𝐏𝐒 $𝟐𝟔.𝟗𝟎", callback_data: "adquirir_25_00" }],
        [{ text: "🌹 𝐌𝐄𝐆𝐀 𝐏𝐀𝐂𝐊 𝟏𝟓 𝐂𝐀𝐓𝐄𝐆𝐎𝐑𝐈𝐄𝐒 $𝟑𝟗.𝟗𝟎", callback_data: "adquirir_30_00" }],
      ],
      es: [
        [{ text: "💎 𝐐𝐆 𝐍𝐈𝐍𝐅𝐄𝐓𝐈𝐍𝐀𝐒 € 𝟗,𝟗𝟎", callback_data: "adquirir_10_00" }],
        [{ text: "🔥 𝐒𝐄𝐌𝐀𝐍𝐀 𝐒𝐄𝐂𝐑𝐄𝐓𝐀 € 𝟏𝟑,𝟗𝟎 (𝟓𝟎% 𝐎𝐅𝐅)", callback_data: "adquirir_15_00" }],
        [{ text: "🌟 𝐕𝐈𝐓𝐀𝐋𝐈𝐂𝐈𝐎 + 𝟓 𝐆𝐑𝐔𝐏𝐎𝐒 € 𝟏𝟗,𝟗", callback_data: "adquirir_20_00" }],
        [{ text: "👑 𝐏𝐀𝐐𝐔𝐄𝐓𝐄 𝐄𝐗𝐂𝐋𝐔𝐒𝐈𝐕𝐎 + 𝟏𝟎 𝐆𝐑𝐔𝐏𝐎𝐒 € 𝟐𝟔,𝟗𝟎", callback_data: "adquirir_25_00" }],
        [{ text: "🌹 𝐌𝐄𝐆𝐀 𝐏𝐀𝐐𝐔𝐄𝐓𝐄 𝟏𝟓 𝐂𝐀𝐓𝐄𝐆𝐎𝐑𝐈𝐀𝐒 € 𝟑𝟗,𝟗𝟎", callback_data: "adquirir_30_00" }],
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
  