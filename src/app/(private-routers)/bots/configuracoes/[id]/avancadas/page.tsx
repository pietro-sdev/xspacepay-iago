// front-end.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

type StepType = 'text' | 'image' | 'video' | 'button' | 'payment' | 'post-payment' | 'initial-message';

type ActionType = 'url' | 'callback';

interface ButtonAction {
  text: string;
  action: string;
  actionType: ActionType;
}

interface BotStep {
  id: string;
  type: StepType;
  message?: string;
  imageFile?: File | null;
  videoFile?: File | null;
  buttons?: ButtonAction[]; // Suporte para múltiplos botões
  paymentProvider?: 'pix' | 'stripe' | 'paypal';
  requiresAction?: boolean;
}

interface Bot {
  id: string;
  name: string;
  username: string;
  status: string;
}

export default function AdvancedBotConfigPage() {
  const params = useParams();

  let botId: string | undefined;
  if (params?.id) {
    botId = Array.isArray(params.id) ? params.id[0] : params.id;
  }

  const [bot, setBot] = useState<Bot | null>(null);
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<BotStep[]>([]);
  const [selectedType, setSelectedType] = useState<StepType>('text');
  const [flowLanguage, setFlowLanguage] = useState<'pt' | 'en' | 'es'>('pt');

  const languages = [
    { label: 'Português (Brasil)', code: 'pt' },
    { label: 'English (USA)', code: 'en' },
    { label: 'Español (Espanha)', code: 'es' },
  ];

  useEffect(() => {
    if (!botId) return;
    fetchBot(botId);
    fetchFlow(botId);
  }, [botId]);

  async function fetchBot(id: string) {
    setLoading(true);
    try {
      const response = await fetch(`/api/bots/GET_BY_ID/${id}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar dados do bot');
      }
      const data = await response.json();
      setBot(data.bot || null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchFlow(botId: string) {
    try {
      const response = await fetch(`/api/bots/FLOWS/GET/getFlow?botId=${botId}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar o fluxo do bot');
      }
      const data = await response.json();
      if (data.success && data.flow.steps) {
        setSteps(typeof data.flow.steps === 'string' ? JSON.parse(data.flow.steps) : data.flow.steps);
        setFlowLanguage(data.flow.language || 'pt'); // Definir o idioma do fluxo se disponível
      }
    } catch (error) {
      console.error('Erro ao carregar fluxo:', error);
    }
  }

  function handleAddStep() {
    const newStep: BotStep = {
      id: Date.now().toString(),
      type: selectedType,
      requiresAction: selectedType === 'button' || selectedType === 'payment',
      buttons: selectedType === 'button' ? [] : undefined,
    };
    setSteps((prev) => [...prev, newStep]);
  }

  function handleChangeStep(id: string, updatedFields: Partial<BotStep>) {
    setSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, ...updatedFields } : step))
    );
  }

  function handleRemoveStep(id: string) {
    setSteps((prev) => prev.filter((step) => step.id !== id));
  }

  function handleAddButton(stepId: string) {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId
          ? {
              ...step,
              buttons: [...(step.buttons || []), { text: '', action: '', actionType: 'callback' }],
            }
          : step
      )
    );
  }

  function handleRemoveButton(stepId: string, buttonIndex: number) {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId
          ? {
              ...step,
              buttons: step.buttons?.filter((_, index) => index !== buttonIndex),
            }
          : step
      )
    );
  }

  function handleButtonChange(
    stepId: string,
    buttonIndex: number,
    field: 'text' | 'action' | 'actionType',
    value: string
  ) {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId
          ? {
              ...step,
              buttons: step.buttons?.map((button, index) =>
                index === buttonIndex ? { ...button, [field]: value } : button
              ),
            }
          : step
      )
    );
  }

  async function handleSaveFlow() {
    if (!botId) {
      alert('Bot ID inválido.');
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('botId', botId);
      formData.append('language', flowLanguage); // Adicionar idioma
      formData.append('steps', JSON.stringify(steps));
  
      steps.forEach((step) => {
        if (step.imageFile) {
          formData.append(`imageFile_${step.id}`, step.imageFile);
        }
        if (step.videoFile) {
          formData.append(`videoFile_${step.id}`, step.videoFile);
        }
      });
  
      const response = await fetch(`/api/bots/UPDATE_FLOW/saveFlow`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Erro ao salvar o fluxo de mensagens');
      }
  
      const data = await response.json();
      alert('Fluxo salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar fluxo:', error);
      alert('Erro ao salvar o fluxo. Por favor, tente novamente.');
    }
  }
  

  if (!botId) {
    return <p className="p-6">Bot não encontrado (sem ID).</p>;
  }

  if (loading) {
    return <p className="p-6">Carregando dados do bot...</p>;
  }

  if (!bot) {
    return <p className="p-6">Bot não encontrado (objeto nulo).</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className='flex justify-between'>
        <h1 className="text-2xl font-bold">
          Configurar Fluxo Avançado do Bot: {bot.name} ({bot.username})
        </h1>
        <Link href={`/bots/configuracoes/${botId}/gateway`}>
          <Button className='font-semibold'>Configurar Gateway de Pagamento</Button>
        </Link>
      </div>

      {/* Seletor de Idioma do Fluxo */}
      <div className="flex items-center gap-2">
        <Label>Idioma do Fluxo:</Label>
        <select
          value={flowLanguage}
          onChange={(e) => setFlowLanguage(e.target.value as 'pt' | 'en' | 'es')}
          className="border rounded px-2 py-1"
        >
          <option value="pt">Português (Brasil)</option>
          <option value="en">English (USA)</option>
          <option value="es">Español (Espanha)</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <Label>Tipo de Ação:</Label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as StepType)}
          className="border rounded px-2 py-1"
        >
          <option value="text">Mensagem de Texto</option>
          <option value="image">Mensagem com Imagem</option>
          <option value="video">Mensagem com Vídeo</option>
          <option value="button">Mensagem com Botão</option>
          <option value="payment">Gerar Cobrança (Pix/Stripe/PayPal)</option>
          <option value="post-payment">Mensagem pós-pagamento</option>
          <option value="initial-message">Mensagem Inicial</option>
        </select>
        <Button onClick={handleAddStep}>Adicionar Passo</Button>
      </div>

      <div className="space-y-4">
        {steps.map((step) => (
          <Card key={step.id}>
            <CardHeader className="flex justify-between">
              <CardTitle>{`Passo: ${step.type}`}</CardTitle>
              <Button variant="destructive" onClick={() => handleRemoveStep(step.id)}>
                Remover
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              {step.type === 'text' && (
                <div>
                  <Label>Mensagem de Texto</Label>
                  <Textarea
                    value={step.message || ''}
                    onChange={(e) =>
                      handleChangeStep(step.id, { message: e.target.value })
                    }
                  />
                </div>
              )}

              {step.type === 'button' && (
                <div>
                  <Label>Botões</Label>
                  <div className="space-y-2">
                    {step.buttons?.map((button, index) => (
                      <div key={index} className="flex flex-col md:flex-row items-center gap-2">
                        <Input
                          value={button.text}
                          onChange={(e) =>
                            handleButtonChange(step.id, index, 'text', e.target.value)
                          }
                          placeholder="Texto do Botão"
                        />
                        <select
                          value={button.actionType}
                          onChange={(e) =>
                            handleButtonChange(step.id, index, 'actionType', e.target.value as ActionType)
                          }
                          className="border rounded px-2 py-1"
                        >
                          <option value="callback">Ação Interna</option>
                          <option value="url">URL Externa</option>
                        </select>
                        <Input
                          value={button.action}
                          onChange={(e) =>
                            handleButtonChange(step.id, index, 'action', e.target.value)
                          }
                          placeholder={
                            button.actionType === 'url'
                              ? 'URL do Botão'
                              : 'Comando ou ação'
                          }
                        />
                        <Button
                          variant="destructive"
                          onClick={() => handleRemoveButton(step.id, index)}
                        >
                          Remover
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button className='mt-2' onClick={() => handleAddButton(step.id)}>Adicionar Botão</Button>
                </div>
              )}

              {(step.type === 'image' || step.type === 'video') && (
                <div>
                  <Label>{step.type === 'image' ? 'Imagem' : 'Vídeo'}</Label>
                  <Input
                    type="file"
                    accept={step.type === 'image' ? 'image/*' : 'video/*'}
                    onChange={(e) =>
                      handleChangeStep(step.id, { [step.type === 'image' ? 'imageFile' : 'videoFile']: e.target.files?.[0] || null })
                    }
                  />
                  {step.type === 'image' && step.imageFile && <p>Arquivo selecionado: {step.imageFile.name}</p>}
                  {step.type === 'video' && step.videoFile && <p>Arquivo selecionado: {step.videoFile.name}</p>}
                  
                  {/* Adicionando Textarea para mensagem associada */}
                  <Label>Mensagem {step.type === 'image' ? 'da Imagem' : 'do Vídeo'}</Label>
                  <Textarea
                    value={step.message || ''}
                    onChange={(e) =>
                      handleChangeStep(step.id, { message: e.target.value })
                    }
                    placeholder={`Digite a mensagem que acompanhará a ${step.type === 'image' ? 'imagem' : 'vídeo'}...`}
                  />
                </div>
              )}

              {step.type === 'payment' && (
                <div className="space-y-2">
                  <Label>Gateway</Label>
                  <select
                    value={step.paymentProvider || ''}
                    onChange={(e) =>
                      handleChangeStep(step.id, {
                        paymentProvider: e.target.value as 'pix' | 'stripe' | 'paypal',
                      })
                    }
                    className="border rounded px-2 py-1 w-full"
                  >
                    <option value="">Escolha o gateway</option>
                    <option value="pix">Pix (PushinPay)</option>
                    <option value="stripe">Stripe</option>
                    <option value="paypal">PayPal</option>
                  </select>
                  <Label>Mensagem de Cobrança</Label>
                  <Textarea
                    placeholder="Descreva o pagamento..."
                    value={step.message || ''}
                    onChange={(e) =>
                      handleChangeStep(step.id, { message: e.target.value })
                    }
                  />
                </div>
              )}

              {step.type === 'post-payment' && (
                <div>
                  <Label>Mensagem Pós-Pagamento</Label>
                  <Textarea
                    placeholder="Digite a mensagem pós-pagamento que o bot enviará..."
                    value={step.message || ''}
                    onChange={(e) =>
                      handleChangeStep(step.id, { message: e.target.value })
                    }
                  />
                </div>
              )}

              {step.type === 'initial-message' && (
                <div>
                  <Label>Mensagem Inicial</Label>
                  <Textarea
                    placeholder="Digite a mensagem inicial que o bot enviará..."
                    value={step.message || ''}
                    onChange={(e) =>
                      handleChangeStep(step.id, { message: e.target.value })
                    }
                  />
                </div>
              )}

              {step.requiresAction && (
                <p className="text-sm text-muted-foreground">⚠️ Este passo exige uma ação do cliente para continuar.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <div>
        <Button onClick={handleSaveFlow}>Salvar Fluxo Completo</Button>
      </div>
    </div>
  );
}
