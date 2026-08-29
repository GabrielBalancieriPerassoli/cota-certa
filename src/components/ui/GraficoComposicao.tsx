import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { AtivoComTipo } from '../utils/tipos'

const CORES: Record<string, string> = {
  FII: "#0f766e",
  "Ação": "#1e3a8a",
  "Renda Fixa": "#c9a227",
  ETF: "#7c3aed",
  BDR: "#b91c1c",
}

const real = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

export function GraficoComposicao({ carteira }: { carteira: AtivoComTipo[] }) {
  const porTipo = carteira.reduce<Record<string, number>>((acc, ativo) => {
    const tipo = ativo.tipo
    const valor = ativo.quantidade * ativo.preco
    acc[tipo] = (acc[tipo] ?? 0) + valor
    return acc
  }, {})

  // adiciona a cor diretamente em cada item de dados
  const dados = Object.entries(porTipo).map(([tipo, valor]) => ({
    tipo,
    valor,
    fill: CORES[tipo] ?? "#999"
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={dados}
          dataKey="valor"
          nameKey="tipo"
          innerRadius={60}
          outerRadius={100}
        />
        <Tooltip formatter={(value) => real.format(value as number)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
