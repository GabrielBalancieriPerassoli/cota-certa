import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts"
import type { AtivoComTipo } from '../utils/tipos'
import './GraficoComposicao.css'

const CORES: Record<string, string> = {
  FII: "#CBA35A",        // dourado (brass)
  "Ação": "#5CB88A",     // verde
  "Renda Fixa": "#7688A0", // slate
  BDR: "#DB7A56",        // coral
  ETF: "#8E7CF0",        // roxo
  Desconhecido: "#4A5A72",
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

  const total = dados.reduce((soma, item) => soma + item.valor, 0)

  return (
    <div className="composicao">
      <div className="composicao-grafico">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={dados} dataKey="valor" nameKey="tipo" innerRadius={55} outerRadius={90} />
            <Tooltip formatter={(value) => real.format(value as number)} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="composicao-legenda">
        {dados.map((item) => (
          <div className="linha" key={item.tipo}>
            <span className="cor" style={{ background: item.fill }}></span>
            <span className="nome">{item.tipo}</span>
            <span className="pct">{(item.valor / total * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
