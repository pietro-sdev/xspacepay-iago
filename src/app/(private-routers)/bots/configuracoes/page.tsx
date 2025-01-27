'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayIcon } from 'lucide-react';

interface Bot {
  id: string;
  name: string;
  username: string;
  status: string;
  createdAt: string;
  token: string;
}

export default function ConfiguracoesBotsPage() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(false);
  const [botStatuses, setBotStatuses] = useState<Record<string, boolean>>({}); // Armazena o status de execução dos bots

  useEffect(() => {
    fetchBots();
  }, []);

  async function fetchBots() {
    setLoading(true);
    try {
      const response = await fetch('/api/bots/GET/get');
      if (!response.ok) {
        throw new Error('Erro ao carregar bots');
      }
      const data = await response.json();
      if (data.success) {
        setBots(data.bots);

        // Inicializa o status de execução dos bots como "false"
        const statuses: Record<string, boolean> = {};
        data.bots.forEach((bot: Bot) => {
          statuses[bot.id] = false;
        });
        setBotStatuses(statuses);
      }
    } catch (error) {
      console.error('Erro ao buscar bots:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleBot(botId: string) {
    const isRunning = botStatuses[botId];

    if (isRunning) {
      // Parar o bot
      try {
        const response = await fetch('/api/bots/STOP/stopBot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ botId }),
        });

        if (response.ok) {
          alert('Bot parado com sucesso!');
          setBotStatuses((prev) => ({ ...prev, [botId]: false }));
        } else {
          alert('Erro ao parar o bot.');
        }
      } catch (error) {
        console.error('Erro ao parar o bot:', error);
        alert('Erro ao parar o bot.');
      }
    } else {
      // Iniciar o bot
      try {
        const response = await fetch('/api/bots/START/startBot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ botId }),
        });

        if (response.ok) {
          alert('Bot iniciado com sucesso!');
          setBotStatuses((prev) => ({ ...prev, [botId]: true }));
        } else {
          alert('Erro ao iniciar o bot.');
        }
      } catch (error) {
        console.error('Erro ao iniciar o bot:', error);
        alert('Erro ao iniciar o bot.');
      }
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Configurações de Bots</h1>
        {/* Botão para criar novo bot */}
        <Link href="/bots/criar">
          <Button>
            Adicionar Bot
          </Button>
        </Link>
      </div>

      {loading && <p>Carregando lista de bots...</p>}

      {!loading && bots.length === 0 && (
        <p className="text-muted-foreground">Nenhum bot encontrado.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {bots.map((bot) => (
          <Card key={bot.id}>
            <CardHeader>
              <CardTitle className="font-semibold">{bot.name}</CardTitle>
              <CardDescription className="font-semibold">{bot.username}</CardDescription>
            </CardHeader>
            <CardContent className="-mt-3">
              <p className="text-sm text-muted-foreground font-semibold">
                Criado em: {new Date(bot.createdAt).toLocaleDateString('pt-BR')}
              </p>

              <p className="text-sm mt-2 font-semibold">
                Status:{' '}
                {bot.status === 'active' ? (
                  <span className="text-green-600 font-semibold">Ativo</span>
                ) : (
                  <span className="text-red-600 font-semibold">Inativo</span>
                )}
              </p>
            </CardContent>
            <CardFooter>
              <div className="flex gap-10">
                <Link href={`/bots/configuracoes/${bot.id}`}>
                  <Button variant="outline" className="hover:text-white">
                    Entrar
                  </Button>
                </Link>
                <Button
                  className={
                    botStatuses[bot.id]
                      ? 'bg-yellow-600 hover:bg-red-600'
                      : 'bg-green-600 hover:bg-green-800'
                  }
                  onClick={() => toggleBot(bot.id)}
                >
                  {botStatuses[bot.id] ? 'Rodando' : 'Iniciar'}
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
