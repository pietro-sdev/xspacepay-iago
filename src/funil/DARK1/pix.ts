import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const PUSHINPAY_TOKEN = process.env.PUSHINPAY_TOKEN ?? "";
const PUSHINPAY_URL = "https://api.pushinpay.com.br/api/pix/cashIn";
const PUSHINPAY_STATUS_URL = "https://api.pushinpay.com.br/api/transactions";

interface PaymentResponse {
  qr_code: string;
  id: string;
}

export async function gerarPix(valor: number, descricao: string): Promise<PaymentResponse | null> {
  try {
    const response = await axios.post(
      PUSHINPAY_URL,
      { value: valor * 100, description: descricao },
      {
        headers: {
          Authorization: `Bearer ${PUSHINPAY_TOKEN.trim()}`,
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      }
    );

    if (response.status === 200 || response.status === 201) {
      return {
        qr_code: response.data.qr_code,
        id: response.data.id
      };
    } else {
      console.error("Erro ao gerar pagamento PIX:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Erro na API PushinPay:", error);
    return null;
  }
}

export async function verificarStatusPix(pagamentoId: string): Promise<string | null> {
  try {
    const response = await axios.get(`${PUSHINPAY_STATUS_URL}/${pagamentoId}`, {
      headers: {
        Authorization: `Bearer ${PUSHINPAY_TOKEN.trim()}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    });

    if (response.status === 200) {
      return response.data.status; // Ex: "confirmed", "paid", etc.
    } else {
      return null;
    }
  } catch (error) {
    console.error("Erro ao verificar pagamento:", error);
    return null;
  }
}
