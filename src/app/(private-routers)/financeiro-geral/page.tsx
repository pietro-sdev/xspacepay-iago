'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, Banknote, DollarSign, ShoppingBag } from 'lucide-react';

// Importações do shadcn/ui para Chart:
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

// Importações do Recharts:
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
} from 'recharts';

const chartData = [
  { mes: 'Janeiro', receita: 30000, despesas: 15000 },
  { mes: 'Fevereiro', receita: 32000, despesas: 18000 },
  { mes: 'Março', receita: 28000, despesas: 13000 },
  { mes: 'Abril', receita: 40000, despesas: 20000 },
  { mes: 'Maio', receita: 38000, despesas: 17000 },
  { mes: 'Junho', receita: 42000, despesas: 23000 },
];

// Config para mapear rótulos e cores (shadcn/ui)
const chartConfig = {
  receita: {
    label: 'Receita',
    color: 'hsl(var(--chart-1))',
  },
  despesas: {
    label: 'Despesas',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export default function Page() {
  // Exemplo de métricas (você pode buscar via fetch)
  const totalReceita = 300_000; // Ex.: R$ 300.000 de receita total
  const numTransacoes = 120;    // Ex.: 120 transações no mês
  const ticketMedio = 350;      // Ex.: R$ 350 por transação
  const receitaMes = 42_000;    // Ex.: R$ 42.000 de receita neste mês

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Financeiro Geral</h1>

      {/* 4 Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Receita Geral */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Geral</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              R$ {totalReceita.toLocaleString('pt-BR')}
            </div>
            <p className="text-sm text-muted-foreground">Valor acumulado</p>
          </CardContent>
        </Card>

        {/* Card 2: Transações no Mês */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transações no Mês</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{numTransacoes}</div>
            <p className="text-sm text-muted-foreground">Pagamentos realizados</p>
          </CardContent>
        </Card>

        {/* Card 3: Ticket Médio */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              R$ {ticketMedio.toLocaleString('pt-BR')}
            </div>
            <p className="text-sm text-muted-foreground">Valor por venda</p>
          </CardContent>
        </Card>

        {/* Card 4: Receita do Mês */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita do Mês</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              R$ {receitaMes.toLocaleString('pt-BR')}
            </div>
            <p className="text-sm text-muted-foreground">
              Faturado neste mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico comparando Receita vs. Despesas */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução Financeira</CardTitle>
          <CardDescription>Receita vs. Despesas (Mensal)</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Altura mínima p/ gráfico responsivo */}
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="mes"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                // Exibe "Jan", "Fev", etc. se quiser truncar
                tickFormatter={(value: string) => value.slice(0, 3)} 
              />

              {/* Tooltip custom (shadcn/ui) */}
              <ChartTooltip content={<ChartTooltipContent />} />

              {/* Legend (shadcn/ui) */}
              <ChartLegend content={<ChartLegendContent />} />

              {/* Barras definidas no chartConfig */}
              <Bar dataKey="receita" fill="var(--color-receita)" radius={4} />
              <Bar dataKey="despesas" fill="var(--color-despesas)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
