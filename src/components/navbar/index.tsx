'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu, LogOut, Briefcase, Calculator, User, BarChart, Wallet, Users, Home, Bot, PlusCircle, List, Settings2Icon, ListFilter, ArrowRight, ArrowRightCircle } from "lucide-react";
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
  return (
    <nav className="flex items-center justify-between bg-white border p-3 sm:w-full font-semibold">
      <div className="flex items-center gap-4 font-semibold">
        {/* Dropdown Menu */}
        <Logo size={150}/>
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
                  Bots <ChevronDown/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white text-black shadow-md rounded-md">

                <Link href="/bots/configuracoes">
                  <DropdownMenuItem className="hover:bg-gray-100 transition cursor-pointer font-semibold">
                    <Settings2Icon/> Configurações de Bots
                  </DropdownMenuItem>
                </Link>

                <Link href="/bots/criar">
                  <DropdownMenuItem className="hover:bg-gray-100 transition cursor-pointer font-semibold">
                    <PlusCircle/> Criar Bot
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
                  Usuários <ChevronDown/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white text-black shadow-md rounded-md">

                <Link href="/usuarios/lista">
                  <DropdownMenuItem className="hover:bg-gray-100 transition cursor-pointer font-semibold">
                    <ListFilter/> Lista de Usuários
                  </DropdownMenuItem>
                </Link>

                <Link href="/usuarios/criar">
                  <DropdownMenuItem className="hover:bg-gray-100 transition cursor-pointer font-semibold">
                    <PlusCircle/> Criar Usuário
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
            <ul className="mt-4 flex flex-col gap-4 text-sm font-medium text-sidebar-primary-foreground">
              <li>
                <Button variant="ghost" className="hover:text-black transition">
                  <Briefcase className="w-4 h-4" />
                  Busca de Empresas
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="hover:text-black transition">
                  <Calculator className="w-4 h-4 " />
                  Calculadora de Frete
                </Button>
              </li>
            </ul>
          </SheetContent>
        </Sheet>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-1 border rounded-lg hover:bg-gray-100 transition">
              <Avatar className="w-6 h-6">
                <AvatarImage src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?20200418092106" alt="Alicia Koch" />
                <AvatarFallback>AK</AvatarFallback>
              </Avatar>
              <span className="hidden sm:block font-semibold text-sm">Alicia Koch</span>
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
