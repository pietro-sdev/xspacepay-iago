'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function GatewayPage() {
  const [pixToken, setPixToken] = useState('');
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [paypalClientId, setPaypalClientId] = useState('');
  const [paypalSecret, setPaypalSecret] = useState('');

  useEffect(() => {
    // Carregar as configurações existentes ao montar o componente
    fetchUserGateways();
  }, []);

  async function fetchUserGateways() {
    try {
      const token = getTokenFromCookie();
      if (!token) {
        alert('Token não encontrado. Faça login novamente.');
        return;
      }

      const response = await fetch('/api/paymentGateway', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const { error } = await response.json();
        alert(error || 'Erro ao buscar configurações de gateways.');
        return;
      }

      const { gateways } = await response.json();

      // Preencher os campos com os dados existentes
      gateways.forEach((gateway: any) => {
        switch (gateway.type) {
          case 'pix':
            setPixToken(gateway.apiKey);
            break;
          case 'stripe':
            setStripeSecretKey(gateway.secretKey || '');
            break;
          case 'paypal':
            setPaypalClientId(gateway.apiKey);
            setPaypalSecret(gateway.secretKey || '');
            break;
          default:
            break;
        }
      });
    } catch (error) {
      console.error('Erro ao buscar gateways:', error);
      alert('Erro ao buscar configurações de gateways.');
    }
  }

  async function handleSavePix() {
    try {
      const token = getTokenFromCookie();
      if (!token) {
        alert('Token não encontrado. Faça login novamente.');
        return;
      }

      const response = await fetch('/api/paymentGateway', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 'pix',
          apiKey: pixToken,
          // Pix pode não precisar de secretKey, dependendo da API
        }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        alert(error || 'Erro ao salvar configuração Pix.');
        return;
      }

      alert('Configuração Pix salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar Pix:', error);
      alert('Erro ao salvar configuração Pix.');
    }
  }

  async function handleSaveStripe() {
    try {
      const token = getTokenFromCookie();
      if (!token) {
        alert('Token não encontrado. Faça login novamente.');
        return;
      }

      const response = await fetch('/api/paymentGateway', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 'stripe',
          secretKey: stripeSecretKey,
        }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        alert(error || 'Erro ao salvar configuração Stripe.');
        return;
      }

      alert('Configuração Stripe salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar Stripe:', error);
      alert('Erro ao salvar configuração Stripe.');
    }
  }

  async function handleSavePaypal() {
    try {
      const token = getTokenFromCookie();
      if (!token) {
        alert('Token não encontrado. Faça login novamente.');
        return;
      }

      const response = await fetch('/api/paymentGateway', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 'paypal',
          apiKey: paypalClientId,
          secretKey: paypalSecret,
        }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        alert(error || 'Erro ao salvar configuração PayPal.');
        return;
      }

      alert('Configuração PayPal salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar PayPal:', error);
      alert('Erro ao salvar configuração PayPal.');
    }
  }

  // Função auxiliar para obter o token do cookie
  function getTokenFromCookie() {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];
    return token || null;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Configurações de Gateway de Pagamento</h1>

      <Tabs defaultValue="pix" className="space-y-4">
        <TabsList>
          {/* Tab Pix com imagem à direita */}
          <TabsTrigger value="pix">
            <div className="flex items-center gap-2 font-semibold">
              <Image
                src="/images/pix-logo.svg"
                alt="Pix logo"
                width={20}
                height={20}
              />
              <span>Pix</span>
            </div>
          </TabsTrigger>

          {/* Tab Stripe com imagem à direita */}
          <TabsTrigger value="stripe">
            <div className="flex items-center gap-2 font-semibold">
              <Image
                src="/images/stripe-logo.jpeg"
                alt="Stripe logo"
                width={20}
                height={20}
              />
              <span>Stripe</span>
            </div>
          </TabsTrigger>

          {/* Tab PayPal com imagem à direita */}
          <TabsTrigger value="paypal">
            <div className="flex items-center gap-2 font-semibold">
              <Image
                src="/images/paypal-logo.png"
                alt="PayPal logo"
                width={20}
                height={20}
              />
              <span>PayPal</span>
            </div>
          </TabsTrigger>
        </TabsList>

        {/* Conteúdo da Tab Pix */}
        <TabsContent value="pix">
          <Card>
            <CardHeader>
              <CardTitle>Configurar Pix (PushinPay)</CardTitle>
              <CardDescription>Integração via Token da PushinPay</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Token</Label>
                <Input
                  placeholder="Seu token da PushinPay"
                  value={pixToken}
                  onChange={(e) => setPixToken(e.target.value)}
                />
              </div>
              <Button onClick={handleSavePix}>Salvar Configuração Pix</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conteúdo da Tab Stripe */}
        <TabsContent value="stripe">
          <Card>
            <CardHeader>
              <CardTitle>Configurar Stripe</CardTitle>
              <CardDescription>Chaves para integração com a API do Stripe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Secret Key</Label>
                <Input
                  placeholder="sk_live_..."
                  type="password"
                  value={stripeSecretKey}
                  onChange={(e) => setStripeSecretKey(e.target.value)}
                />
              </div>
              <Button onClick={handleSaveStripe}>Salvar Configuração Stripe</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conteúdo da Tab PayPal */}
        <TabsContent value="paypal">
          <Card>
            <CardHeader>
              <CardTitle>Configurar PayPal</CardTitle>
              <CardDescription>Credenciais para integração com PayPal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Client ID</Label>
                <Input
                  placeholder="AX8Y..."
                  value={paypalClientId}
                  onChange={(e) => setPaypalClientId(e.target.value)}
                />
              </div>
              <div>
                <Label>Secret</Label>
                <Input
                  type="password"
                  placeholder="XXXXXX..."
                  value={paypalSecret}
                  onChange={(e) => setPaypalSecret(e.target.value)}
                />
              </div>
              <Button onClick={handleSavePaypal}>Salvar Configuração PayPal</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
