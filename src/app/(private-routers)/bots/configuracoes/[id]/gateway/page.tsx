'use client';

import { useState } from 'react';
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
  const [stripePublishableKey, setStripePublishableKey] = useState('');
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [paypalClientId, setPaypalClientId] = useState('');
  const [paypalSecret, setPaypalSecret] = useState('');

  async function handleSavePix() {
    alert(`Salvando Pix (PushinPay). Token: ${pixToken}`);
  }
  async function handleSaveStripe() {
    alert(`Salvando Stripe. PubKey: ${stripePublishableKey}, SecretKey: ${stripeSecretKey}`);
  }
  async function handleSavePaypal() {
    alert(`Salvando PayPal. ClientId: ${paypalClientId}, Secret: ${paypalSecret}`);
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Gateway de Pagamento</h1>

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
                <Label>Publishable Key</Label>
                <Input
                  placeholder="pk_live_..."
                  value={stripePublishableKey}
                  onChange={(e) => setStripePublishableKey(e.target.value)}
                />
              </div>
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
