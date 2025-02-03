'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, ArrowLeft, TrendingUp, BotIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Avatar } from '@/components/ui/avatar';

// Interface do Bot
interface Bot {
  id: string;
  name: string;
  username: string;
  createdAt: string;
}

// Interface do faturamento
interface RevenueData {
  day: string;
  amount: number;
}

export default function BotRevenue() {
  // Pegamos o ID do bot da URL
  const params = useParams();
  const botId = params?.id || '1'; // Garante que o ID seja capturado

  const [bot, setBot] = useState<Bot | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Dados fictícios de faturamento (últimos 30 dias)
  const fakeRevenueData = Array.from({ length: 30 }, (_, i) => ({
    day: `${i + 1}/01`,
    amount: Math.floor(Math.random() * 5000) + 1000, // Valores entre 1000 e 6000
  }));

  // Cálculo de faturamento
  const totalRevenue = fakeRevenueData.reduce((acc, curr) => acc + curr.amount, 0);
  const todayRevenue = fakeRevenueData[fakeRevenueData.length - 1].amount;
  const currentDay = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  // Função para buscar o bot pelo ID
  useEffect(() => {
    async function fetchBotDetails() {
      try {
        const response = await fetch(`/api/bots/GET_BY_ID/${botId}`);
        if (!response.ok) {
          throw new Error('Erro ao obter bot');
        }

        const data = await response.json();
        if (data.success) {
          setBot(data.bot);
        } else {
          throw new Error('Bot não encontrado');
        }
      } catch (error) {
        console.error('Erro ao carregar bot:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBotDetails();
  }, [botId]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Detalhes do Bot</h1>
        <Link href="/dashboard">
          <Button className="font-semibold">
            <ArrowLeft className="mr-2" />
            Voltar para Dashboard
          </Button>
        </Link>
      </div>

      {loading ? (
        <p>Carregando detalhes do bot...</p>
      ) : bot ? (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                  <BotIcon className="h-8 w-8 text-white" />
                </Avatar>
              <div>
                <CardTitle>{bot.name} (@{bot.username})</CardTitle>
                <p className='font-semibold'>Data de Criação: {new Date(bot.createdAt).toLocaleDateString('pt-BR')}</p>
                <p className='font-semibold'>ID do Bot: {bot.id}</p>
              </div>
            </div>
          </CardHeader>
        </Card>
      ) : (
        <p>Bot não encontrado.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>Faturamento de Hoje</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="-mt-3">
            <p className="text-2xl font-bold">
              {`R$ ${todayRevenue.toLocaleString('pt-BR')}`}
            </p>
            <p className="text-sm text-muted-foreground">{currentDay}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>Faturamento Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="-mt-3">
            <p className="text-2xl font-bold">
              {`R$ ${totalRevenue.toLocaleString('pt-BR')}`}
            </p>
            <p className="text-sm text-muted-foreground">Total acumulado</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Faturamento dos Últimos 30 Dias</CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={fakeRevenueData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`} />
              <Area type="monotone" dataKey="amount" stroke="#4ade80" fillOpacity={1} fill="url(#colorAmount)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Faturamento</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="border">
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Data</TableHead>
                <TableHead className="font-semibold">Valor (R$)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fakeRevenueData.map((rev, index) => (
                <TableRow key={index}>
                  <TableCell className="font-semibold">{rev.day}</TableCell>
                  <TableCell className="font-semibold">
                    R$ {rev.amount.toLocaleString('pt-BR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
