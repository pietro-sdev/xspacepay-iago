'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

export default function Page() {
  const [nameUser, setNameUser] = useState('');
  const [emailUser, setEmailUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // estado para controlar exibição da senha
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const handleCreateUser = async () => {
    // Validação simples
    if (!nameUser || !emailUser || !password) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha nome, email e senha do usuário.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Chame seu endpoint de criação de usuário
      const response = await fetch('/api/usuario/CREATE/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameUser,
          email: emailUser,
          password,
          profilePicture: null,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar o usuário.');
      }

      await response.json();

      toast({
        title: 'Sucesso',
        description: 'Usuário criado com sucesso!',
        variant: 'success',
      });

      // Limpar campos
      setNameUser('');
      setEmailUser('');
      setPassword('');
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao criar o usuário.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Criar Novo Usuário</h1>

      <Card>
        <CardHeader>
          <CardTitle>Preencha as Informações do Usuário</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Nome do Usuário */}
          <div>
            <Label className="block text-sm font-medium text-gray-700">Nome do Usuário</Label>
            <Input
              value={nameUser}
              onChange={(e) => setNameUser(e.target.value)}
              placeholder="Digite o nome do usuário"
            />
          </div>

          {/* E-mail do Usuário */}
          <div>
            <Label className="block text-sm font-medium text-gray-700">E-mail do Usuário</Label>
            <Input
              type="email"
              value={emailUser}
              onChange={(e) => setEmailUser(e.target.value)}
              placeholder="Digite o e-mail do usuário"
            />
          </div>

          {/* Senha do Usuário + Ícone de Mostrar/Esconder */}
          <div>
            <Label className="block text-sm font-medium text-gray-700">Senha do Usuário</Label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha do usuário"
                className="pr-10" // espaço para o botão do olho
              />
              {/* Botão para togglar a visualização da senha */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Botão para criar usuário */}
          <Button onClick={handleCreateUser} disabled={loading}>
            {loading ? 'Criando...' : 'Criar Usuário'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
