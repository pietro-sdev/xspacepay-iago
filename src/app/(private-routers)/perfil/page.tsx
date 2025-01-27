'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const [userId, setUserId] = useState('');
  const [profilePicture, setProfilePicture] = useState(
    'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?20200418092106'
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('profilePicture', file);

      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))
          ?.split('=')[1];

        if (!token) {
          alert('Token não encontrado. Faça login novamente.');
          return;
        }

        const response = await fetch('/api/usuario/UPDATE_PROFILE_PICTURE/updatePicture', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'x-user-id': userId,
          },
          body: formData,
        });

        if (!response.ok) {
          const { error } = await response.json();
          alert(error || 'Erro ao atualizar a foto de perfil.');
          return;
        }

        const { profilePicture } = await response.json();
        setProfilePicture(profilePicture); // Atualiza a foto no estado
        alert('Foto de perfil atualizada com sucesso!');
      } catch (error) {
        console.error('Erro ao atualizar a foto de perfil:', error);
        alert('Erro ao atualizar a foto de perfil.');
      }
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))
          ?.split('=')[1];
  
        if (!token) {
          setError('Token não encontrado.');
          setLoading(false);
          return;
        }
  
        const response = await fetch('/api/usuario/GET_BY_ME/get', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!response.ok) {
          const { error } = await response.json();
          setError(error || 'Erro ao buscar os dados do usuário.');
          setLoading(false);
          return;
        }
  
        const { user } = await response.json();
  
        // Define o estado com os valores retornados pela API
        setUserId(user.id || '');
        setProfilePicture(
          user.profilePicture || // Use a foto retornada pela API, se disponível
          'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?20200418092106' // URL padrão
        );
        setName(user.name || '');
        setEmail(user.email || '');
      } catch (error) {
        setError('Erro inesperado ao buscar os dados do usuário.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, []);
  

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    alert('Perfil salvo com sucesso!');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Configurar Perfil</h1>
        {userId && (
          <Link href={`/perfil/${userId}/gateway`}>
            <Button className="font-semibold">Configurar Gateway de Pagamento</Button>
          </Link>
        )}
      </div>

      {/* Foto de perfil */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={
              profilePicture ||
              'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?20200418092106'
            }
            alt="Foto de perfil"
            className="w-24 h-24 rounded-full object-cover border border-gray-300"
          />
        </div>
        <div>
          <Label className="block font-semibold mb-1">Trocar foto de perfil</Label>
          <Input type="file" accept="image/*" onChange={handleProfilePictureChange} />
        </div>
      </div>

      {/* Formulário de dados do perfil */}
      <div className="space-y-4">
        <div>
          <Label className="block font-semibold mb-2">Nome Completo</Label>
          <Input type="text" value={name} disabled />
        </div>

        <div>
          <Label className="block font-semibold mb-2">E-mail</Label>
          <Input type="email" value={email} disabled />
        </div>

        <div className="relative">
          <Label className="block font-semibold mb-2">Nova Senha</Label>
          <div className="flex items-center">
            <Input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Digite sua nova senha"
              className="pr-10"
            />
            <button
              type="button"
              className="absolute right-2"
              onClick={() => setShowNewPassword((prev) => !prev)}
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="relative">
          <Label className="block font-semibold mb-2">Confirmar Nova Senha</Label>
          <div className="flex items-center">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua nova senha"
              className="pr-10"
            />
            <button
              type="button"
              className="absolute right-2"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Botão para salvar alterações */}
      <div className="flex gap-3">
        <Button onClick={handleSubmit}>Salvar Alterações</Button>
      </div>
    </div>
  );
}
