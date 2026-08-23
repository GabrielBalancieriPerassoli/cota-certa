import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { AtivoComTipo } from '../utils/tipos'

const CORES: Record<string, string> = {
  FII: "#0f766e",
  "Ação": "#1e3a8a",
  "Renda Fixa": "#c9a227",
}

export function GraficoComposicao({ carteira }: { carteira: AtivoComTipo[] }) {
  const porTipo = carteira.reduce<Record<string, number>>((acc, ativo) => {
    const tipo = ativo.tipo
    const valor = ativo.quantidade * ativo.preco
    acc[tipo] = (acc[tipo] ?? 0) + valor
    return acc
  }, {})

  const dados = Object.entries(porTipo).map(([tipo, valor]) => ({ tipo, valor }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={dados} dataKey="valor" nameKey="tipo" innerRadius={60} outerRadius={100}>
          {dados.map((entry) => (
            <Cell key={entry.tipo} fill={CORES[entry.tipo] ?? "#999"} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}