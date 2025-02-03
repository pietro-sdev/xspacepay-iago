import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;
const PAYPAL_API_URL = "https://api-m.paypal.com"; // Produção

// Função para obter o token de acesso do PayPal
async function obterTokenPayPal(): Promise<string | null> {
  try {
    const response = await axios.post(
      `${PAYPAL_API_URL}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        auth: {
          username: PAYPAL_CLIENT_ID,
          password: PAYPAL_CLIENT_SECRET,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Erro ao obter token PayPal:", error);
    return null;
  }
}

// Função para criar um link de pagamento PayPal
// Agora recebe um parâmetro opcional "currency" (padrão "USD")
export async function criarPagamentoPayPal(
  valor: number,
  descricao: string,
  currency: string = "USD"
): Promise<string | null> {
  const token = await obterTokenPayPal();
  if (!token) return null;

  try {
    const response = await axios.post(
      `${PAYPAL_API_URL}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: valor.toFixed(2),
            },
            description: descricao,
          },
        ],
        application_context: {
          return_url: "https://example.com/success",
          cancel_url: "https://example.com/cancel",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const order = response.data;
    const approvalLink = order.links.find((link: any) => link.rel === "approve")?.href;

    return approvalLink || null;
  } catch (error) {
    console.error("Erro ao criar pagamento PayPal:", error);
    return null;
  }
}
