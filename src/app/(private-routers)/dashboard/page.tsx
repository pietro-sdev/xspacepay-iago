'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, BotIcon, Activity, PauseCircle, DollarSign, Trash2, PenIcon } from 'lucide-react';
import Link from 'next/link';

interface Bot {
  id: string;
  name: string;
  username: string;
  token: string;
  profilePhoto: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function Page() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(false);

  const [totalBots, setTotalBots] = useState(0);
  const [activeBots, setActiveBots] = useState(0);
  const [inactiveBots, setInactiveBots] = useState(0);

  const totalSales = 23500; 

  useEffect(() => {
    fetchBots();
  }, []);

  async function fetchBots() {
    setLoading(true);
    try {
      
      const response = await fetch('/api/bots/GET/get');
      if (!response.ok) {
        throw new Error('Erro ao obter bots');
      }
      const data = await response.json();

      if (data.success) {
        setBots(data.bots);

        // 
        setTotalBots(data.bots.length);

        const activeCount = data.bots.filter((bot: Bot) => bot.status === 'active').length;
        setActiveBots(activeCount);
        setInactiveBots(data.bots.length - activeCount);
      }
    } catch (error) {
      console.error('Erro ao carregar lista de bots:', error);
      
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(botId: string) {
   
    const confirmar = confirm('Tem certeza que deseja excluir este bot?');
    if (!confirmar) return;

    try {
      
      const response = await fetch(`/api/bots/DELETE/${botId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Erro ao excluir bot');
      }
      fetchBots();
    } catch (error) {
      console.error('Erro ao excluir bot:', error);
      alert('Não foi possível excluir o bot.');
    }
  }

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Painel Administrativo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>Total de Bots</CardTitle>
              <BotIcon className='h-4 w-4 text-muted-foreground' />
            </div>
          </CardHeader>
          <CardContent className="-mt-3">
            <p className="text-4xl font-bold">
              {loading ? '...' : totalBots}
            </p>
            <p className="text-sm text-muted-foreground">Cadastrados no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>Bots Ativos</CardTitle>
              <Activity className='h-4 w-4 text-muted-foreground' />
            </div>
          </CardHeader>
          <CardContent className="-mt-3">
            <p className="text-4xl font-bold">
              {loading ? '...' : activeBots}
            </p>
            <p className="text-sm text-muted-foreground">Operando atualmente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>Bots Inativos</CardTitle>
              <PauseCircle className='h-4 w-4 text-muted-foreground' />
            </div>
          </CardHeader>
          <CardContent className="-mt-3">
            <p className="text-4xl font-bold">
              {loading ? '...' : inactiveBots}
            </p>
            <p className="text-sm text-muted-foreground">Pausados ou desativados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>Total de Vendas</CardTitle>
              <DollarSign className='h-4 w-4 text-muted-foreground'/>
            </div>
          </CardHeader>
          <CardContent className="-mt-3">
            <p className="text-4xl font-bold">
              {`R$ ${totalSales.toLocaleString('pt-BR')}`}
            </p>
            <p className="text-sm text-muted-foreground">Geradas pelo sistema</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Lista de Bots</h2>
          
          <Link href="/bots/criar">
            <Button className="font-semibold">
              <PlusCircle className="mr-2" />
              Adicionar Bot
            </Button>
          </Link>
        </div>

        {loading && <p>Carregando bots...</p>}

        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">ID do Bot</TableHead>
              <TableHead className="font-semibold">Data de Criação</TableHead>
              <TableHead className="font-semibold">Nome</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Total de Vendas</TableHead>
              <TableHead className="font-semibold">Excluir</TableHead>
              <TableHead className="font-semibold">Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bots.map((bot) => (
              <TableRow key={bot.id}>
                <TableCell className="font-semibold">{bot.id}</TableCell>
                <TableCell className="font-semibold">
                  {new Date(bot.createdAt).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="font-semibold">{bot.name}</TableCell>
                <TableCell className="font-semibold">
                  {bot.status === 'active' ? (
                    <span className="text-green-600 font-semibold">Ativo</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Inativo</span>
                  )}
                </TableCell>
                <TableCell className="font-semibold">R$ 0</TableCell>
                <TableCell className="font-semibold">
                  <Button
                    size="icon"
                    className="text-red-700 bg-red-300 hover:bg-red-500"
                    onClick={() => handleDelete(bot.id)}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
                <TableCell className="font-semibold">
                  <Button size={'icon'} className="text-blue-700 bg-blue-300 hover:bg-blue-500">
                    <PenIcon/>
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {bots.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Nenhum bot cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
