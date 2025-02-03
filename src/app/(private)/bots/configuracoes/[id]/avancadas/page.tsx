"use client";

import { useState, useEffect, useCallback, ChangeEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Trash, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// ------------------------- TIPOS -------------------------
type StepType =
  | "initial-message"
  | "text"
  | "image"
  | "video"
  | "button"
  | "payment"
  | "post-payment";

type ActionType = "url" | "callback";

interface ButtonAction {
  text: string;
  action: string;
  actionType: ActionType;
}

interface Step {
  id: string;
  type: StepType;
  message?: string;
  file?: File | null;
  fileData?: string | null; // Base64
  filePreview?: string;     // apenas para mostrar no front
  buttons: ButtonAction[];
  paymentProvider?: "pix" | "stripe" | "paypal";
  price?: number;
  planName?: string;
}

// ------------------------- COMPONENTE -------------------------
export default function BotFlowPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  // Estado do fluxo
  const [steps, setSteps] = useState<Step[]>([]);
  // Para controlar se o fluxo já foi carregado do back-end
  const [flowLoaded, setFlowLoaded] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // ------------------------------------------------------------
  // useEffect: buscar o fluxo somente 1x quando tiver `id`
  // ------------------------------------------------------------
  useEffect(() => {
    if (id && !flowLoaded) {
      console.log("[useEffect] Iniciando fetchFlow, botId:", id);
      fetchFlow(id as string);
    }
  }, [id, flowLoaded]);

  // ------------------------------------------------------------
  // Função para buscar fluxo
  // ------------------------------------------------------------
  const fetchFlow = async (botId: string) => {
    try {
      const response = await axios.get(`/api/bots/FLOW/${botId}/flow`);
      // Garante que buttons seja array
      const fetchedSteps: Step[] = (response.data.steps || []).map((step: any) => ({
        ...step,
        buttons: step.buttons || [],
      }));
      console.log("[fetchFlow] Fluxo recebido do backend:", fetchedSteps);

      // Seta no estado local
      setSteps(fetchedSteps);
    } catch (error) {
      console.error("[fetchFlow] Erro ao buscar fluxo:", error);
    } finally {
      // Marca que carregou
      setFlowLoaded(true);
      setLoading(false);
    }
  };

  // ------------------------------------------------------------
  // Adicionar / Remover steps
  // ------------------------------------------------------------
  const handleAddStep = () => {
    console.log("[handleAddStep] Adicionando step...");
    const newStep: Step = {
      id: Date.now().toString(),
      type: "text",
      message: "",
      buttons: [],
    };
    setSteps((prev) => [...prev, newStep]);
  };

  const handleRemoveStep = (stepId: string) => {
    console.log("[handleRemoveStep] Removendo passo ID:", stepId);
    setSteps((prev) => prev.filter((s) => s.id !== stepId));
  };

  // ------------------------------------------------------------
  // Mudar campos do Step
  // ------------------------------------------------------------
  const handleStepChange = (stepId: string, field: keyof Step, value: any) => {
    console.log(`[handleStepChange] Step ${stepId}, campo '${field}', valor:`, value);

    setSteps((prevSteps) =>
      prevSteps.map((step) => {
        if (step.id === stepId) {
          return { ...step, [field]: value };
        }
        return step;
      })
    );
  };

  // ------------------------------------------------------------
  // Botões (Add, remove, update)
  // ------------------------------------------------------------
  const handleAddButton = (stepId: string) => {
    console.log("[handleAddButton] Adicionando botão ao Step:", stepId);
    setSteps((prev) =>
      prev.map((step) => {
        if (step.id === stepId) {
          return {
            ...step,
            buttons: [
              ...step.buttons,
              { text: "", action: "", actionType: "callback" },
            ],
          };
        }
        return step;
      })
    );
  };

  const handleRemoveButton = (stepId: string, index: number) => {
    console.log("[handleRemoveButton] Removendo botão index:", index, "no Step:", stepId);
    setSteps((prev) =>
      prev.map((step) => {
        if (step.id === stepId) {
          return {
            ...step,
            buttons: step.buttons.filter((_, i) => i !== index),
          };
        }
        return step;
      })
    );
  };

  const handleButtonChange = (
    stepId: string,
    index: number,
    field: keyof ButtonAction,
    value: string
  ) => {
    console.log(
      `[handleButtonChange] Step ${stepId}, Botão ${index}, campo '${field}' =>`,
      value
    );
    setSteps((prev) =>
      prev.map((step) => {
        if (step.id === stepId) {
          const newButtons = step.buttons.map((btn, i) =>
            i === index ? { ...btn, [field]: value } : btn
          );
          return { ...step, buttons: newButtons };
        }
        return step;
      })
    );
  };

  // ------------------------------------------------------------
  // Ao selecionar arquivo (imagem / vídeo)
  // ------------------------------------------------------------
  const handleFileChange = (stepId: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    console.log("[handleFileChange] Step:", stepId, "Arquivo selecionado:", file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result as string;
        console.log("[handleFileChange] Base64 gerado, length:", base64Data.length);
        // Salva no step
        handleStepChange(stepId, "fileData", base64Data);
        handleStepChange(stepId, "filePreview", base64Data);
      };
      reader.readAsDataURL(file);
    } else {
      // Se não selecionar nada, limpamos
      console.log("[handleFileChange] Nenhum arquivo selecionado, limpando fileData/preview");
      handleStepChange(stepId, "fileData", null);
      handleStepChange(stepId, "filePreview", null);
    }

    // Sempre atualizar a referência do arquivo
    handleStepChange(stepId, "file", file);
  };

  // ------------------------------------------------------------
  // Salvar fluxo
  // ------------------------------------------------------------
  const handleSaveFlow = async () => {
    if (!id) {
      alert("ID do bot não encontrado.");
      return;
    }
    setSaving(true);

    try {
      console.log("[handleSaveFlow] Steps (estado atual):", steps);
      const payload = {
        steps: steps.map((step) => ({
          id: step.id,
          type: step.type,
          message: step.message || null,
          fileData: step.fileData || null,
          buttons: step.buttons || [],
          paymentProvider: step.paymentProvider || null,
          price: step.price || null,
          planName: step.planName || null,
        })),
      };
      console.log("[handleSaveFlow] Payload final para POST:", payload);

      await axios.post(`/api/bots/FLOW/${id}/flow`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Fluxo salvo com sucesso!");
    } catch (error) {
      console.error("[handleSaveFlow] Erro ao salvar fluxo:", error);
      alert("Erro ao salvar fluxo.");
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
  if (loading) {
    return <p className="p-6">Carregando fluxo...</p>;
  }

  if (!id) {
    return (
      <p className="p-6 text-red-500">ID do bot não fornecido nos parâmetros de busca.</p>
    );
  }

  // Define quais steps podem ter botões
  const stepsWithButtons: StepType[] = [
    "initial-message",
    "text",
    "image",
    "video",
    "button",
    "payment",
    "post-payment",
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Configurar Fluxo de Mensagens</h1>

      {steps.map((step, index) => (
        <div key={step.id} className="border p-4 rounded-md shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Passo {index + 1}: {step.type.replace("-", " ")}
            </h2>
            <Button variant="destructive" size="icon" onClick={() => handleRemoveStep(step.id)}>
              <Trash size={16} />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Tipo de Mensagem */}
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Mensagem</label>
              <Select
                value={step.type}
                onValueChange={(value: StepType) =>
                  handleStepChange(step.id, "type", value)
                }
              >
                <SelectTrigger className="w-full">
                  <span>{step.type || "Selecione o tipo de mensagem"}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="initial-message">Mensagem Inicial</SelectItem>
                  <SelectItem value="text">Mensagem de Texto</SelectItem>
                  <SelectItem value="image">Mensagem com Imagem</SelectItem>
                  <SelectItem value="video">Mensagem com Vídeo</SelectItem>
                  <SelectItem value="button">Mensagem com Botões</SelectItem>
                  <SelectItem value="payment">Enviar Cobrança</SelectItem>
                  <SelectItem value="post-payment">Mensagem Pós-Pagamento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mensagem (texto) */}
            {(step.type === "initial-message" ||
              step.type === "text" ||
              step.type === "post-payment") && (
              <div>
                <label className="block text-sm font-medium mb-1">Mensagem</label>
                <Textarea
                  value={step.message || ""}
                  onChange={(e) => handleStepChange(step.id, "message", e.target.value)}
                  placeholder="Digite a mensagem..."
                />
              </div>
            )}

            {/* Mensagem com Imagem */}
            {step.type === "image" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Upload de Imagem</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(step.id, e)}
                  />
                  {step.filePreview && (
                    <img
                      src={step.filePreview}
                      alt="Preview"
                      className="mt-2 w-32 h-32 object-cover"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Mensagem da Imagem
                  </label>
                  <Textarea
                    value={step.message || ""}
                    onChange={(e) => handleStepChange(step.id, "message", e.target.value)}
                    placeholder="Digite a mensagem que acompanhará a imagem..."
                  />
                </div>
              </>
            )}

            {/* Mensagem com Vídeo */}
            {step.type === "video" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Upload de Vídeo</label>
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileChange(step.id, e)}
                  />
                  {step.filePreview && (
                    <video
                      src={step.filePreview}
                      controls
                      className="mt-2 w-64 h-64 object-cover"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mensagem do Vídeo</label>
                  <Textarea
                    value={step.message || ""}
                    onChange={(e) => handleStepChange(step.id, "message", e.target.value)}
                    placeholder="Digite a mensagem que acompanhará o vídeo..."
                  />
                </div>
              </>
            )}

            {/* Mensagem com Botões */}
            {stepsWithButtons.includes(step.type) && (
              <div>
                <label className="block text-sm font-medium mb-1">Botões</label>
                {step.buttons.map((button, idx) => (
                  <div key={idx} className="flex items-center space-x-2 mb-2">
                    <Input
                      placeholder="Texto do Botão"
                      value={button.text}
                      onChange={(e) =>
                        handleButtonChange(step.id, idx, "text", e.target.value)
                      }
                      required
                    />
                    <Input
                      placeholder={
                        button.actionType === "url" ? "URL do Botão" : "Comando ou ação"
                      }
                      value={button.action}
                      onChange={(e) =>
                        handleButtonChange(step.id, idx, "action", e.target.value)
                      }
                      required
                    />
                    <Select
                      value={button.actionType}
                      onValueChange={(value: ActionType) =>
                        handleButtonChange(step.id, idx, "actionType", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <span>{button.actionType || "Selecione o tipo de ação"}</span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="callback">Ação Interna</SelectItem>
                        <SelectItem value="url">URL Externa</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="destructive"
                      onClick={() => handleRemoveButton(step.id, idx)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                ))}

                {step.buttons.length >= 4 && (
                  <p className="text-sm text-red-500">
                    Você atingiu o limite máximo de 4 botões.
                  </p>
                )}

                <Button
                  onClick={() => handleAddButton(step.id)}
                  variant="outline"
                  disabled={step.buttons.length >= 4}
                  className="flex items-center"
                >
                  <Plus size={16} className="mr-2" /> Adicionar Botão
                </Button>
              </div>
            )}

            {/* Enviar Cobrança */}
            {step.type === "payment" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Provedor de Pagamento
                  </label>
                  <Select
                    value={step.paymentProvider || ""}
                    onValueChange={(value: "pix" | "stripe" | "paypal") =>
                      handleStepChange(step.id, "paymentProvider", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <span>{step.paymentProvider || "Selecione o provedor de pagamento"}</span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pix">Pix</SelectItem>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nome do Plano
                  </label>
                  <Input
                    value={step.planName || ""}
                    onChange={(e) =>
                      handleStepChange(step.id, "planName", e.target.value)
                    }
                    placeholder="Ex: Plano Mensal VIP"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Valor (R$)</label>
                  <Input
                    type="number"
                    value={step.price || ""}
                    onChange={(e) =>
                      handleStepChange(step.id, "price", parseFloat(e.target.value))
                    }
                    placeholder="Digite o valor do plano..."
                  />
                </div>
              </>
            )}
          </div>
        </div>
      ))}

      <Button onClick={handleAddStep} variant="outline" className="flex items-center">
        <Plus size={16} className="mr-2" /> Adicionar Passo
      </Button>

      <Button onClick={handleSaveFlow} disabled={saving} className="mt-4">
        {saving ? "Salvando..." : "Salvar Fluxo"}
      </Button>
    </div>
  );
}
