'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

export default function ProfilePage() {
  const [profilePicture, setProfilePicture] = useState(
    'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?20200418092106'
  ); // Foto de perfil padrão
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const url = URL.createObjectURL(file); // Gera uma URL temporária para exibir a imagem
      setProfilePicture(url);
      // Aqui você pode adicionar a lógica para fazer upload da imagem ao servidor
    }
  };

  const handleSubmit = () => {
    // Adicione a lógica de salvamento de perfil aqui
    if (newPassword !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    alert('Perfil salvo com sucesso!');
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Perfil</h1>

      {/* Foto de perfil */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={profilePicture}
            alt="Foto de perfil"
            className="w-24 h-24 rounded-full object-cover border border-gray-300"
          />
        </div>
        <div>
          <Label className="block font-semibold mb-1">Trocar foto de perfil</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className="mt-1"
          />
        </div>
      </div>

      {/* Formulário de dados do perfil */}
      <div className="space-y-4">
        <div>
          <Label className="block font-semibold mb-2">Nome Completo</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome completo"
          />
        </div>

        <div>
          <Label className="block font-semibold mb-2">E-mail</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
          />
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
      <div>
        <Button onClick={handleSubmit}>Salvar Alterações</Button>
      </div>
    </div>
  );
}
