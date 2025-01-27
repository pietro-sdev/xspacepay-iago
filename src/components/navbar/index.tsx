'use client';

import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu, LogOut, User, Wallet, Users, Home, Bot, ArrowRightCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Logo } from "../logo";
import Link from "next/link";

export default function Navbar() {
  const [userName, setUserName] = useState<string>('Usuário'); // Estado para armazenar o nome do usuário
  const [profilePicture, setProfilePicture] = useState<string>('https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?20200418092106');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))
          ?.split('=')[1];

        if (!token) return;

        const response = await fetch('/api/usuario/GET_BY_ME/get', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          console.error('Erro ao buscar os dados do usuário.');
          return;
        }

        const { user } = await response.json();

        setUserName(user.name || 'Usuário');
        setProfilePicture(
          user.profilePicture || 
          'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?20200418092106'
        );
      } catch (error) {
        console.error('Erro ao buscar os dados do usuário:', error);
      }
    };

    fetchUser();
  }, []);

  const handleProfilePictureUpdate = async (file: File) => {
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
          'x-user-id': 'userId', // Ajuste conforme necessário para passar o ID
        },
        body: formData,
      });

      if (!response.ok) {
        const { error } = await response.json();
        alert(error || 'Erro ao atualizar a foto de perfil.');
        return;
      }

      const { profilePicture: updatedPicture } = await response.json();
      setProfilePicture(updatedPicture); // Atualiza a foto no estado
    } catch (error) {
      console.error('Erro ao atualizar a foto de perfil:', error);
      alert('Erro ao atualizar a foto de perfil.');
    }
  };

  return (
    <nav className="flex items-center justify-between bg-white border p-3 sm:w-full font-semibold">
      <div className="flex items-center gap-4 font-semibold">
        {/* Logo */}
        <Logo size={150} />

        {/* Navigation Links */}
        <ul className="hidden sm:flex items-center gap-2 font-semibold">
          <li>
            <Link href="/dashboard">
              <Button variant="ghost" size="default" className="font-semibold hover:text-white transition">
                <Home className="w-4 h-4 font-semibold" />
                Dashboard
              </Button>
            </Link>
          </li>
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="default" className="font-semibold hover:text-white transition">
                  <Bot className="w-4 h-4 font-semibold" />
                  Bots <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white text-black shadow-md rounded-md">
                <Link href="/bots/configuracoes">
                  <DropdownMenuItem className="hover:bg-gray-100 transition cursor-pointer font-semibold">
                    Configurações de Bots
                  </DropdownMenuItem>
                </Link>
                <Link href="/bots/criar">
                  <DropdownMenuItem className="hover:bg-gray-100 transition cursor-pointer font-semibold">
                    Criar Bot
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="default" className="font-semibold hover:text-white transition">
                  <Users className="w-4 h-4 font-semibold" />
                  Usuários <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white text-black shadow-md rounded-md">
                <Link href="/usuarios/lista">
                  <DropdownMenuItem className="hover:bg-gray-100 transition cursor-pointer font-semibold">
                    Lista de Usuários
                  </DropdownMenuItem>
                </Link>
                <Link href="/usuarios/criar">
                  <DropdownMenuItem className="hover:bg-gray-100 transition cursor-pointer font-semibold">
                    Criar Usuário
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
          <li>
            <Link href="/financeiro-geral">
              <Button variant="ghost" size="default" className="font-semibold hover:text-white transition">
                <Wallet className="w-4 h-4 font-semibold" />
                Financeiro Geral
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/redirecionamento">
              <Button variant="ghost" size="default" className="font-semibold hover:text-white transition">
                <ArrowRightCircle className="w-4 h-4 font-semibold" />
                Redirecionamento
              </Button>
            </Link>
          </li>
        </ul>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger>
            <Menu className="sm:hidden w-6 h-6 cursor-pointer" />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-1 border rounded-lg hover:bg-gray-100 transition">
              <Avatar className="w-6 h-6">
                <AvatarImage src={profilePicture} alt={userName} />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="hidden sm:block font-semibold text-sm">{userName}</span>
              <ChevronDown className="hidden sm:block w-4 h-4 text-gray-600" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="cursor-pointer">
            <Link href="/perfil">
              <DropdownMenuItem className="cursor-pointer font-semibold">
                <User className="w-4 h-4 mr-2 font-semibold" />
                Perfil
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="cursor-pointer font-semibold">
              <LogOut className="w-4 h-4 mr-2 font-semibold" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
