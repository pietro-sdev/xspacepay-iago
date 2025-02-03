'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

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
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [about, setAbout] = useState('');

  useEffect(() => {
    if (!botId) return;
    fetchBot(botId);
  }, [botId]);

  useEffect(() => {
    if (!profilePhoto) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(profilePhoto);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [profilePhoto]);

  async function fetchBot(id: string) {
    setLoading(true);
    try {
      const response = await fetch(`/api/bots/GET_BY_ID/${id}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar dados do bot');
      }
      const data = await response.json();
      setBot(data.bot || null);
      setName(data.bot.name || '');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProfilePhoto() {
    if (!profilePhoto || !botId) {
      setErrorMsg('Por favor, selecione uma foto e certifique-se de que o bot está carregado.');
      return;
    }

    setUploading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const reader = new FileReader();
    reader.readAsDataURL(profilePhoto);
    reader.onloadend = async () => {
      try {
        const response = await fetch('/api/bots/UPDATE_PROFILE/updateProfilePicture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            botId,
            image: reader.result?.toString().split(',')[1],
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao atualizar foto de perfil.');
        }

        const data = await response.json();
        setSuccessMsg(data.message || 'Foto de perfil atualizada com sucesso!');
      } catch (error: any) {
        setErrorMsg(error.message || 'Erro ao atualizar foto de perfil.');
      } finally {
        setUploading(false);
      }
    };
  }

  async function handleSaveDetails() {
    if (!botId) return;

    setUploading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch('/api/bots/UPDATE_INFO/updateDetails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botId,
          name: name.trim() || undefined,
          description: description.trim() || undefined,
          about: about.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar os detalhes do bot.');
      }

      const data = await response.json();
      setSuccessMsg(data.message || 'Detalhes atualizados com sucesso!');
    } catch (error: any) {
      setErrorMsg(error.message || 'Erro ao salvar os detalhes do bot.');
    } finally {
      setUploading(false);
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
          Configurações Básicas do Bot: {bot.name} ({bot.username})
        </h1>
        <Link href={`/bots/configuracoes/${botId}/avancadas`}>
        <div className='mt-3'>
          <Button>Fluxo Avançado do Bot</Button>
        </div>
      </Link>
      </div>

      <Card className='py-3'>
        <CardContent>
          <div>
            <Label>Foto de Perfil</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setProfilePhoto(e.target.files[0]);
                }
              }}
            />

            {previewUrl && (
              <div className="mt-4">
                <img
                  src={previewUrl}
                  alt="Preview da foto de perfil"
                  className="h-24 w-24 rounded-full object-cover"
                />
              </div>
            )}
            <Button className='mt-3 mb-3' onClick={handleSaveProfilePhoto} disabled={uploading}>
              {uploading ? 'Salvando...' : 'Salvar Foto de Perfil'}
            </Button>
          </div>

          <div className="mt-6">
            <Label>Editar Nome do Bot</Label>
            <Input
              placeholder='Digite o novo nome do bot'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className='mt-3'>
            <Label>Editar Descrição do Bot</Label>
            <Textarea
              placeholder='Digite a nova descrição do bot'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className='mt-3'>
            <Label>Editar "Sobre" do Bot</Label>
            <Textarea
              placeholder='Digite o novo sobre do bot'
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveDetails} disabled={uploading}>
            {uploading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
