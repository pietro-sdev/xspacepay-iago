import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const STRIPE_API_KEY = process.env.STRIPE_SECRET_KEY!;
const STRIPE_API_URL = "https://api.stripe.com/v1/checkout/sessions";

// Função para criar um link de pagamento Stripe
export async function criarPagamentoStripe(valor: number, descricao: string): Promise<string | null> {
  try {
    const response = await axios.post(
      STRIPE_API_URL,
      new URLSearchParams({
        cancel_url: "https://example.com/cancel",
        success_url: "https://example.com/success",
        "line_items[0][price_data][currency]": "USD",
        "line_items[0][price_data][product_data][name]": descricao,
        "line_items[0][price_data][unit_amount]": (valor * 100).toString(),
        "line_items[0][quantity]": "1",
        mode: "payment",
      }),
      {
        headers: {
          Authorization: `Bearer ${STRIPE_API_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.url || null;
  } catch (error) {
    console.error("Erro ao criar pagamento Stripe:", error);
    return null;
  }
}
