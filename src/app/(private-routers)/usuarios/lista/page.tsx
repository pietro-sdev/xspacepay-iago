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

interface User {
  id: string;
  name: string;
  email: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
  profilePicture?: string | null;
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

      fetchUsers();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      alert('Não foi possível excluir o usuário.');
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Painel Administrativo de Usuários</h1>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">

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
              <TableHead className="font-semibold">Nome</TableHead>
              <TableHead className="font-semibold">E-mail</TableHead>
              <TableHead className="font-semibold">Excluir</TableHead>
              <TableHead className="font-semibold">Editar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-semibold">{user.id}</TableCell>
                <TableCell className="font-semibold">
                  {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="font-semibold">{user.name}</TableCell>
                <TableCell className="font-semibold">{user.email}</TableCell>
                <TableCell className="font-semibold">
                  <Button
                    size="icon"
                    className="text-red-700 bg-red-300 hover:bg-red-500"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
                <TableCell className="font-semibold">
                  <Button
                    size="icon"
                    className="text-blue-700 bg-blue-300 hover:bg-blue-500"
                  >
                    <PenIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}

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
