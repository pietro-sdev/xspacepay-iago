"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// IMPORTANTE: importar todos do shadcn:
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function AutoCheckPage() {
  const [channelId, setChannelId] = useState("");
  const [intervalValue, setIntervalValue] = useState(30);
  const [intervalUnit, setIntervalUnit] = useState<"minutes" | "hours" | "days">("minutes");

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSaveConfig() {
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const response = await fetch("/api/auto-check/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelId,
          intervalValue,
          intervalUnit,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Erro ao salvar configuração.");
      }

      const data = await response.json();
      setSuccessMsg(data.message || "Configuração salva com sucesso!");
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Configurar Checagem Automática</h1>

      {errorMsg && <p className="text-red-500">{errorMsg}</p>}
      {successMsg && <p className="text-green-500">{successMsg}</p>}

      <div className="space-y-4">
        <div>
          <Label>ID do Canal</Label>
          <Input
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
            placeholder="-1001234567890"
          />
        </div>

        <div>
          <Label>Intervalo</Label>
          <Input
            type="number"
            value={intervalValue}
            onChange={(e) => setIntervalValue(parseInt(e.target.value, 10))}
            placeholder="ex: 30"
          />
        </div>

        <div>
          <Label>Unidade</Label>
          {/* AQUI substituímos pelo Select do shadcn */}
          <Select
            value={intervalUnit}
            onValueChange={(value) => setIntervalUnit(value as "minutes" | "hours" | "days")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione a unidade" />
            </SelectTrigger>
            <SelectContent className="cursor-pointer">
              <SelectItem className="cursor-pointer" value="minutes">Minutos</SelectItem>
              <SelectItem className="cursor-pointer" value="hours">Horas</SelectItem>
              <SelectItem className="cursor-pointer" value="days">Dias</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSaveConfig} disabled={loading}>
          {loading ? "Salvando..." : "Salvar Configuração"}
        </Button>
      </div>
    </div>
  );
}
