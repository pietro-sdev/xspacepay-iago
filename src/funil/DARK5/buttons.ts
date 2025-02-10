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
        [{ text: "🍓𝐀𝐜𝐞𝐬𝐬𝐨 𝐑𝐞𝐬𝐭𝐫𝐢𝐭𝐨 𝐕𝟏𝐫𝐠𝐞𝐧𝐳𝐢𝐧𝐡𝐚𝐬 𝐑$ 𝟗,𝟗𝟎", callback_data: "adquirir_10_00" }],
        [{ text: "🍒𝐒𝐞𝐦𝐚𝐧𝐚 𝐒𝐞𝐜𝐫𝐞𝐭𝐚 𝐕𝟏𝐫𝐠𝐞𝐧𝐳𝐢𝐧𝐡𝐚𝐬 𝐑$ 𝟏𝟑,𝟗𝟎 (𝟓𝟎% 𝐎𝐅𝐅)", callback_data: "adquirir_15_00" }],
        [{ text: "🍑𝐕𝐢𝐭𝐚𝐥𝐢𝐜𝐢𝐨 𝐒𝐮𝐛𝐬 + 𝟓 𝐆𝐫𝐮𝐩𝐨𝐬 𝐑$ 𝟏𝟗,𝟗𝟎", callback_data: "adquirir_20_00" }],
        [{ text: "🥭𝐂𝐨𝐦𝐛𝐨 𝐒𝐢𝐠𝐢𝐥𝐨𝐬𝐨 + 𝟏𝟎 𝐆𝐫𝐮𝐩𝐨𝐬 𝐑$ 𝟐𝟔,𝟗𝟎", callback_data: "adquirir_25_00" }],
        [{ text: "🍉𝐏𝐚𝐜𝐤 𝐕𝟏𝐫𝐠𝐞𝐧𝐳𝐢𝐧𝐡𝐚𝐬 𝟏𝟓 𝐆𝐫𝐮𝐩𝐨𝐬 𝐑$ 𝟑𝟗,𝟗𝟎", callback_data: "adquirir_30_00" }],
      ],
      us: [
        [{ text: "🍓𝐑𝐞𝐬𝐭𝐫𝐢𝐜𝐭𝐞𝐝 𝐀𝐜𝐜𝐞𝐬𝐬 𝐕𝐢𝐫𝐠𝐢𝐧𝐬 $𝟗.𝟗𝟎", callback_data: "adquirir_10_00" }],
        [{ text: "🍒𝐒𝐞𝐜𝐫𝐞𝐭 𝐖𝐞𝐞𝐤 𝐕𝐢𝐫𝐠𝐢𝐧𝐬 $𝟏𝟑.𝟗𝟎 (𝟓𝟎% 𝐎𝐅𝐅)", callback_data: "adquirir_15_00" }],
        [{ text: "🍑𝐋𝐢𝐟𝐞𝐭𝐢𝐦𝐞 𝐒𝐮𝐛𝐬 + 𝟓 𝐆𝐫𝐨𝐮𝐩𝐬 $𝟏𝟗.𝟗𝟎", callback_data: "adquirir_20_00" }],
        [{ text: "🥭𝐑𝐞𝐬𝐞𝐫𝐯𝐞𝐝 𝐂𝐨𝐦𝐛𝐨 + 𝟏𝟎 𝐆𝐫𝐨𝐮𝐩𝐬 $𝟐𝟔.𝟗𝟎", callback_data: "adquirir_25_00" }],
        [{ text: "🍉𝐏𝐚𝐜𝐤 𝐒𝐞𝐜𝐫𝐞𝐭 𝐕𝐢𝐫𝐠𝐢𝐧𝐬 𝟏𝟓 𝐆𝐫𝐨𝐮𝐩𝐬 $𝟑𝟗.𝟗𝟎", callback_data: "adquirir_30_00" }],
      ],
      es: [
        [{ text: "🍓𝐀𝐜𝐜𝐞𝐬𝐨 𝐑𝐞𝐬𝐭𝐫𝐢𝐜𝐭𝐨 𝐕𝐢𝐫𝐠𝐞𝐧𝐜𝐢𝐭𝐚𝐬 𝟗,𝟗𝟎€", callback_data: "adquirir_10_00" }],
        [{ text: "🍒𝐒𝐞𝐦𝐚𝐧𝐚 𝐒𝐞𝐜𝐫𝐞𝐭𝐚 𝐕𝐢𝐫𝐠𝐞𝐧𝐜𝐢𝐭𝐚𝐬 𝟏𝟑,𝟗𝟎€ (𝟓𝟎% 𝐎𝐅𝐅)", callback_data: "adquirir_15_00" }],
        [{ text: "🍑𝐕𝐢𝐭𝐚𝐥𝐢𝐜𝐢𝐨 𝐒𝐮𝐛𝐬 + 𝟓 𝐆𝐫𝐮𝐩𝐨𝐬 𝟏𝟗,𝟗𝟎€", callback_data: "adquirir_20_00" }],
        [{ text: "🥭𝐂𝐨𝐦𝐛𝐨 𝐑𝐞𝐬𝐞𝐫𝐯𝐚𝐝𝐨 + 𝟏𝟎 𝐆𝐫𝐮𝐩𝐨𝐬 𝟐𝟔,𝟗𝟎€", callback_data: "adquirir_25_00" }],
        [{ text: "🍉𝐏𝐚𝐪𝐮𝐞𝐭𝐞 𝐒𝐞𝐜𝐫𝐞𝐭𝐨 𝐕𝐢𝐫𝐠𝐞𝐧𝐜𝐢𝐭𝐚𝐬 𝟏𝟓 𝐆𝐫𝐮𝐩𝐨𝐬 𝟑𝟗,𝟗𝟎€", callback_data: "adquirir_30_00" }],
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
  