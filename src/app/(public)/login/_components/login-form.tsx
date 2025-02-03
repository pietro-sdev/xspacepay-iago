"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast"; // Import do useToast

const schema = z.object({
  email: z.string().email({ message: "E-mail inválido." }),
  password: z.string().min(4, { message: "A senha deve ter no mínimo 4 caracteres." }),
});

const LogInForm = () => {
  const router = useRouter();
  const { toast } = useToast(); // Inicialização do useToast
  const [isPending, setIsPending] = React.useState(false);
  const [passwordType, setPasswordType] = React.useState("password");
  // const [errorMessage, setErrorMessage] = React.useState<string | null>(null); // Opcional

  const togglePasswordType = () => {
    setPasswordType((prev) => (prev === "text" ? "password" : "text"));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
  });

  const onSubmit = async (data: any) => {
    // setErrorMessage(null); // Remova se não estiver usando
    setIsPending(true);

    try {
      console.log("Iniciando login com os dados:", data);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      console.log("Resposta da API:", response);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro da API:", errorData);
        
        // Exibir toast de erro
        toast({
          title: "Erro no Login",
          description: errorData.error || "Erro ao realizar login.",
          variant: "destructive",
        });

        setIsPending(false);
        return;
      }

      const { token, userId } = await response.json();
      console.log("Login bem-sucedido, token recebido:", token);

      // Armazenar o token nos cookies
      document.cookie = `token=${token}; path=/;`;

      // Armazenar userId no localStorage
      localStorage.setItem("userId", userId);

      console.log("Redirecionando para /dashboard...");

      // Exibir toast de sucesso
      toast({
        title: "Login bem-sucedido!",
        description: "Você foi redirecionado para o painel.",
        variant: "success",
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Erro inesperado durante o login:", error);
      
      // Exibir toast de erro genérico
      toast({
        title: "Erro",
        description: "Erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full py-10">
      <div className="inline-block">
        <Link href="/dashboard">
          <Logo size={250} />
        </Link>
      </div>
      <div className="2xl:mt-8 mt-6 2xl:text-3xl text-2xl font-bold text-default-900">
        Olá 👋
      </div>
      <div className="2xl:text-lg text-base text-default-600 2xl:mt-2 leading-6">
        Informe suas credenciais para realizar o login.
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 2xl:mt-7">
        <div>
          <Label htmlFor="email" className="mb-2 font-medium text-default-600">
            E-mail{" "}
          </Label>
          <Input
            disabled={isPending}
            {...register("email")}
            type="email"
            id="email"
            className={cn("", {
              "border-destructive": errors.email,
            })}
            placeholder="Digite seu e-mail "
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="mt-3.5">
          <Label
            htmlFor="password"
            className="mb-2 font-medium text-default-600"
          >
            Senha{" "}
          </Label>
          <div className="relative">
            <Input
              disabled={isPending}
              {...register("password")}
              type={passwordType}
              id="password"
              className="peer"
              placeholder="Digite sua senha"
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer"
              onClick={togglePasswordType}
            >
              {passwordType === "password" ? (
                <Eye className="w-5 h-5 text-default-400" />
              ) : (
                <EyeOff className="w-5 h-5 text-default-400" />
              )}
            </div>
          </div>
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <div className="mt-5 mb-8 flex flex-wrap gap-2">
          <div className="flex-1 flex items-center gap-1.5">
            <Checkbox
              className="border-default-300 mt-[1px]"
              id="isRemebered"
            />
            <Label
              htmlFor="isRemebered"
              className="text-sm text-default-600 cursor-pointer whitespace-nowrap"
            >
              Relembrar senha
            </Label>
          </div>
          <Link href="/auth/forgot" className="flex-none text-sm text-primary font-bold">
            Esqueceu sua senha?
          </Link>
        </div>

        {/* Remova esta parte se não estiver utilizando errorMessage */}
        {/* {errorMessage && <p className="text-sm text-red-500 mb-4">{errorMessage}</p>} */}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Carregando..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
};

export default LogInForm;
