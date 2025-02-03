// pages/redirecionamento/page.tsx

'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface LinkPair {
  oldLink: string;
  newLink: string;
}

export default function Page() {
  const [channel, setChannel] = useState('');
  const [linkPairs, setLinkPairs] = useState<LinkPair[]>([
    { oldLink: '', newLink: '' },
    { oldLink: '', newLink: '' },
    { oldLink: '', newLink: '' },
    { oldLink: '', newLink: '' },
    { oldLink: '', newLink: '' },
  ]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLinkChange = (index: number, field: keyof LinkPair, value: string) => {
    const updatedLinkPairs = [...linkPairs];
    updatedLinkPairs[index][field] = value;
    setLinkPairs(updatedLinkPairs);
  };

  async function handleRedirect() {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      // Validação básica: Verificar se todos os links estão preenchidos
      for (let i = 0; i < linkPairs.length; i++) {
        const { oldLink, newLink } = linkPairs[i];
        if (!oldLink || !newLink) {
          throw new Error(`Por favor, preencha os campos de link ${i + 1}.`);
        }
      }

      const response = await fetch('/api/redirect/EDIT/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel,
          linkPairs,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao processar redirecionamento');
      }

      const data = await response.json();
      setSuccessMsg(data.message || 'Redirecionamento concluído com sucesso!');
    } catch (error: any) {
      setErrorMsg(error.message || 'Ocorreu um erro ao executar o redirecionamento.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Redirecionamento de Links em Canal</h1>

      <Card>
        <CardHeader>
          <CardTitle>Editar Mensagens do Canal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="block mb-1">ID do Canal/Grupo</Label>
            <Input
              placeholder="Ex.: -1002263740422"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Informe o ID numérico do canal (ex.: -1002263740422).
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              OBS: Canais sempre têm o símbolo de menos ( - ) antes do número do ID.
            </p>
          </div>

          {linkPairs.map((pair, index) => (
            <div key={index} className="mt-4">
              <h2 className="text-lg font-semibold">Link {index + 1}</h2>
              <div className="mt-2">
                <Label className="block mb-1">Link Antigo</Label>
                <Input
                  placeholder={`Ex.: https://t.me/PrazerOculto${index + 1}Bot`}
                  value={pair.oldLink}
                  onChange={(e) => handleLinkChange(index, 'oldLink', e.target.value)}
                />
              </div>
              <div className="mt-2">
                <Label className="block mb-1">Novo Link</Label>
                <Input
                  placeholder={`Ex.: https://t.me/DesejosQuentes${index + 1}Bot`}
                  value={pair.newLink}
                  onChange={(e) => handleLinkChange(index, 'newLink', e.target.value)}
                />
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button onClick={handleRedirect} disabled={loading}>
            {loading ? 'Processando...' : 'Redirecionar'}
          </Button>
        </CardFooter>
      </Card>

      {errorMsg && <p className="text-red-600 font-semibold">{errorMsg}</p>}
      {successMsg && <p className="text-green-600 font-semibold">{successMsg}</p>}
    </div>
  );
}
