'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

export default function Page() {
  const [botName, setBotName] = useState('');
  const [botUsername, setBotUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  const { toast } = useToast();

  const handleCreateBot = async () => {
    if (!botName || !botUsername) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha o nome e username do bot.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/bots/CREATE/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botName,
          botUsername,
          profilePhoto: null,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar o bot.');
      }

      const data = await response.json();
      setToken(data.bot.token);

      toast({
        title: 'Sucesso',
        description: 'Bot criado com sucesso!',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao criar o bot.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Título da Página */}
      <h1 className="text-2xl font-bold">Criar Novo Bot</h1>

      {/* Formulário para criação do bot */}
      <Card>
        <CardHeader>
          <CardTitle>Preencha as Informações do Bot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Nome do Bot */}
          <div>
            <Label className="block text-sm font-medium text-gray-700">Nome do Bot</Label>
            <Input
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              placeholder="Digite o nome do bot"
            />
          </div>

          {/* Username do Bot */}
          <div>
            <Label className="block text-sm font-medium text-gray-700">Username do Bot</Label>
            <Input
              value={botUsername}
              onChange={(e) => setBotUsername(e.target.value)}
              placeholder="Digite o username do bot (deve terminar com 'bot')"
            />
          </div>

          {/* Botão para Criar o Bot */}
          <Button onClick={handleCreateBot} disabled={loading}>
            {loading ? 'Criando...' : 'Criar Bot'}
          </Button>
        </CardContent>
      </Card>

      {/* Exibir o Token Gerado */}
      {token && (
        <Card>
          <CardHeader>
            <CardTitle>Token do Bot</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Copie e salve o token abaixo. Ele será usado para configurar o bot.
            </p>
            <p className="mt-2 p-2 bg-gray-100 border rounded">{token}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
