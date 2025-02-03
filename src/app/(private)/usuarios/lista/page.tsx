'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Users2Icon,
  PlusIcon,
  PlusCircle,
  Trash2,
  PenIcon,
} from 'lucide-react';
import Link from 'next/link';

// IMPORTANTE: importe o Avatar, AvatarImage, AvatarFallback
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface User {
  id: string;
  name: string;
  email: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
  profilePicture?: string | null;  // Campo que contém a URL ou Base64 da foto
}

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Contadores para estatísticas
  const [totalUsers, setTotalUsers] = useState(0);
  const [newUsers, setNewUsers] = useState(0); 

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      // Faz GET na rota /api/usuario/GET/get
      const response = await fetch('/api/usuario/GET/get');
      if (!response.ok) {
        throw new Error('Erro ao obter usuários');
      }
      const data = await response.json();

      if (data.success) {
        const fetchedUsers = data.users as User[];
        setUsers(fetchedUsers);

        setTotalUsers(fetchedUsers.length);

        // Aqui, só como exemplo, você pode definir quantos foram criados
        // recentemente. Se quiser fazer uma lógica real, substitua esse valor.
        setNewUsers(5);
      }
    } catch (error) {
      console.error('Erro ao carregar lista de usuários:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteUser(userId: string) {
    const confirmar = confirm('Tem certeza que deseja excluir este usuário?');
    if (!confirmar) return;

    try {
      const response = await fetch(`/api/usuario/DELETE/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Erro ao excluir usuário');
      }

      fetchUsers(); // Recarrega a lista após excluir
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      alert('Não foi possível excluir o usuário.');
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Painel Administrativo de Usuários</h1>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card: Total de Usuários */}
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>Total de Usuários</CardTitle>
              <Users2Icon />
            </div>
          </CardHeader>
          <CardContent className="-mt-3">
            <p className="text-4xl font-bold">{loading ? '...' : totalUsers}</p>
            <p className="text-sm text-muted-foreground">Cadastrados no sistema</p>
          </CardContent>
        </Card>

        {/* Card: Novos Cadastros */}
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>Novos Cadastros</CardTitle>
              <PlusIcon />
            </div>
          </CardHeader>
          <CardContent className="-mt-3">
            <p className="text-4xl font-bold">{newUsers}</p>
            <p className="text-sm text-muted-foreground">Nos últimos 30 dias</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Lista de Usuários</h2>
          <Link href="/usuarios/criar">
            <Button className="font-semibold">
              <PlusCircle className="mr-2" />
              Adicionar Usuário
            </Button>
          </Link>
        </div>

        {loading && <p>Carregando usuários...</p>}

        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">ID do Usuário</TableHead>
              <TableHead className="font-semibold">Data de Criação</TableHead>
              <TableHead className="font-semibold">Foto de Perfil</TableHead>
              <TableHead className="font-semibold">Nome</TableHead>
              <TableHead className="font-semibold">E-mail</TableHead>
              <TableHead className="font-semibold">Excluir</TableHead>
              <TableHead className="font-semibold">Editar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                {/* ID */}
                <TableCell className="font-semibold">{user.id}</TableCell>

                {/* Data de Criação */}
                <TableCell className="font-semibold">
                  {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </TableCell>

                {/* Foto de Perfil (Avatar) */}
                <TableCell className="font-semibold">
                  <Avatar>
                    {/* Se user.profilePicture estiver preenchido, exibe. Caso contrário, pode exibir alguma imagem placeholder. */}
                    <AvatarImage
                      src={user.profilePicture || '/images/placeholder.png'}
                      alt={`Foto de ${user.name}`}
                    />
                    <AvatarFallback>
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>

                {/* Nome */}
                <TableCell className="font-semibold">{user.name}</TableCell>

                {/* E-mail */}
                <TableCell className="font-semibold">{user.email}</TableCell>

                {/* Botão Excluir */}
                <TableCell className="font-semibold">
                  <Button
                    size="icon"
                    className="text-red-700 bg-red-300 hover:bg-red-500"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>

                {/* Botão Editar */}
                <TableCell className="font-semibold">
                  <Button
                    size="icon"
                    className="text-blue-700 bg-blue-300 hover:bg-blue-500"
                    // Você pode colocar um onClick ou Link para /usuarios/editar/[user.id], etc.
                  >
                    <PenIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {/* Caso não haja usuários e não esteja carregando */}
            {users.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Nenhum usuário cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
