'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Trash, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type StepType =
  | 'initial-message'
  | 'text'
  | 'image'
  | 'video'
  | 'button'
  | 'payment'
  | 'post-payment';

type ActionType = 'url' | 'callback';

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
  filePreview?: string;
  buttons: ButtonAction[];
  paymentProvider?: 'pix' | 'stripe' | 'paypal';
  price?: number;
  planName?: string;
}

export default function BotFlowPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id; // Extrai o parâmetro 'id'

  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      fetchFlow(id as string);
    } else {
      setLoading(false); // Se não houver ID, pare o carregamento
    }
  }, [id]);

  const fetchFlow = async (botId: string) => {
    try {
      const response = await axios.get(`/api/bots/FLOW/${botId}/flow`); // Usar crases
      // Garantir que cada passo tenha buttons inicializado como array
      const fetchedSteps: Step[] = (response.data.steps || []).map((step: any) => ({
        ...step,
        buttons: step.buttons || []
      }));
      setSteps(fetchedSteps);
    } catch (error) {
      console.error('Erro ao buscar fluxo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStep = () => {
    const newStep: Step = {
      id: Date.now().toString(),
      type: 'text',
      message: '',
      buttons: [], // Inicializa como array vazio
    };
    setSteps([...steps, newStep]);
  };

  const handleRemoveStep = (stepId: string) => {
    setSteps(steps.filter((step) => step.id !== stepId));
  };

  const handleStepChange = (
    stepId: string,
    field: keyof Step,
    value: any
  ) => {
    setSteps(
      steps.map((step) =>
        step.id === stepId ? { ...step, [field]: value } : step
      )
    );
  };

  const handleAddButton = (stepId: string) => {
    setSteps(
      steps.map((step) =>
        step.id === stepId
          ? {
              ...step,
              buttons: [
                ...step.buttons,
                { text: '', action: '', actionType: 'callback' },
              ],
            }
          : step
      )
    );
  };

  const handleRemoveButton = (stepId: string, index: number) => {
    setSteps(
      steps.map((step) =>
        step.id === stepId
          ? {
              ...step,
              buttons: step.buttons.filter((_, i) => i !== index),
            }
          : step
      )
    );
  };

  const handleButtonChange = (
    stepId: string,
    index: number,
    field: keyof ButtonAction,
    value: string
  ) => {
    setSteps(
      steps.map((step) =>
        step.id === stepId
          ? {
              ...step,
              buttons: step.buttons.map((btn, i) =>
                i === index ? { ...btn, [field]: value } : btn
              ),
            }
          : step
      )
    );
  };

  const handleFileChange = (
    stepId: string,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleStepChange(stepId, 'filePreview', reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      handleStepChange(stepId, 'filePreview', '');
    }
    handleStepChange(stepId, 'file', file);
  };

  const handleSaveFlow = async () => {
    if (!id) {
      alert('ID do bot não encontrado.');
      return;
    }
    setSaving(true);
    try {
      // Preparar os dados para envio
      const payload = {
        steps: steps.map((step) => ({
          id: step.id,
          type: step.type,
          message: step.message || null,
          fileData: step.file ? step.file.name : null, // Ajustar conforme necessidade
          buttons: step.buttons || [],
          paymentProvider: step.paymentProvider || null,
          price: step.price || null,
          planName: step.planName || null,
        })),
      };

      // Enviar os dados como JSON
      await axios.post(`/api/bots/FLOW/${id}/flow`, payload, { // Usar crases e caminho correto
        headers: {
          'Content-Type': 'application/json',
        },
      });

      alert('Fluxo salvo com sucesso!');
    } catch (error: any) {
      console.error('Erro ao salvar fluxo:', error);
      // Tente exibir uma mensagem de erro mais informativa, se disponível
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Erro: ${error.response.data.message}`);
      } else {
        alert('Erro ao salvar fluxo.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="p-6">Carregando fluxo...</p>;
  }

  if (!id) {
    return <p className="p-6 text-red-500">ID do bot não fornecido nos parâmetros de busca.</p>;
  }

  // Definir quais tipos de passos permitem botões
  const stepsWithButtons: StepType[] = [
    'initial-message',
    'text',
    'image',
    'video',
    'button',
    'payment',
    'post-payment'
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Configurar Fluxo de Mensagens</h1>
      {steps.map((step, index) => (
        <div key={step.id} className="border p-4 rounded-md shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Passo {index + 1}: {step.type.replace('-', ' ')}
            </h2>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleRemoveStep(step.id)}
            >
              <Trash size={16} />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Tipo de Mensagem */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Tipo de Mensagem
              </label>
              <Select
                value={step.type}
                onValueChange={(value: StepType) => handleStepChange(step.id, 'type', value)}
              >
                <SelectTrigger className="w-full">
                  <span>{step.type || 'Selecione o tipo de mensagem'}</span>
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

            {/* Mensagem */}
            {(step.type === 'initial-message' ||
              step.type === 'text' ||
              step.type === 'post-payment') && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Mensagem
                </label>
                <Textarea
                  value={step.message || ''}
                  onChange={(e) =>
                    handleStepChange(step.id, 'message', e.target.value)
                  }
                  placeholder="Digite a mensagem..."
                />
              </div>
            )}

            {/* Mensagem com Imagem */}
            {step.type === 'image' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Upload de Imagem
                  </label>
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
                    value={step.message || ''}
                    onChange={(e) =>
                      handleStepChange(step.id, 'message', e.target.value)
                    }
                    placeholder="Digite a mensagem que acompanhará a imagem..."
                  />
                </div>
              </>
            )}

            {/* Mensagem com Vídeo */}
            {step.type === 'video' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Upload de Vídeo
                  </label>
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
                  <label className="block text-sm font-medium mb-1">
                    Mensagem do Vídeo
                  </label>
                  <Textarea
                    value={step.message || ''}
                    onChange={(e) =>
                      handleStepChange(step.id, 'message', e.target.value)
                    }
                    placeholder="Digite a mensagem que acompanhará o vídeo..."
                  />
                </div>
              </>
            )}

            {/* Mensagem com Botões */}
            {stepsWithButtons.includes(step.type) && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Botões
                </label>
                {step.buttons.map((button, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <Input
                      placeholder="Texto do Botão"
                      value={button.text}
                      onChange={(e) =>
                        handleButtonChange(
                          step.id,
                          idx,
                          'text',
                          e.target.value
                        )
                      }
                      required
                    />
                    <Input
                      placeholder={
                        button.actionType === 'url'
                          ? 'URL do Botão'
                          : 'Comando ou ação'
                      }
                      value={button.action}
                      onChange={(e) =>
                        handleButtonChange(
                          step.id,
                          idx,
                          'action',
                          e.target.value
                        )
                      }
                      required
                    />
                    <Select
                      value={button.actionType}
                      onValueChange={(value: ActionType) =>
                        handleButtonChange(step.id, idx, 'actionType', value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <span>{button.actionType || 'Selecione o tipo de ação'}</span>
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

                {/* Limite de Botões */}
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
            {step.type === 'payment' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Provedor de Pagamento
                  </label>
                  <Select
                    value={step.paymentProvider || ''}
                    onValueChange={(value: 'pix' | 'stripe' | 'paypal') =>
                      handleStepChange(step.id, 'paymentProvider', value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <span>{step.paymentProvider || 'Selecione o provedor de pagamento'}</span>
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
                    value={step.planName || ''}
                    onChange={(e) =>
                      handleStepChange(step.id, 'planName', e.target.value)
                    }
                    placeholder="Ex: Plano Mensal VIP"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Valor (R$)
                  </label>
                  <Input
                    type="number"
                    value={step.price || ''}
                    onChange={(e) =>
                      handleStepChange(step.id, 'price', parseFloat(e.target.value))
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
        {saving ? 'Salvando...' : 'Salvar Fluxo'}
      </Button>
    </div>
  );
}
