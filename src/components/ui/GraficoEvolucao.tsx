import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import type { AtivoComTipo } from '../utils/tipos'

const real = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

export function GraficoEvolucao({ carteira }: { carteira: AtivoComTipo[] }) {
    // Valor da carteira atual
    const atual = carteira.reduce((soma, a) => soma + a.quantidade * a.preco, 0)

    // Simulacao de 12 meses
    const meses = ["jul", "ago", "set", "out", "nov", "dez", "jan", "fev", "mar", "abr", "mai", "jun"]
    const dados = meses.map((mes, i) => ({
        mes,
        valor: Math.round(atual * (0.75 + i * 0.023)),
    }))

    return (
        <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={dados}>
                <defs>
                    <linearGradient id="corPatrimonio" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#CBA35A" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#CBA35A" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="mes" stroke="#7688A0" fontSize={11} />
                <YAxis stroke="#7688A0" fontSize={11} width={40} />
                <Tooltip formatter={(value) => real.format(value as number)} />
                <Area type="monotone" dataKey="valor" stroke="#CBA35A" strokeWidth={2} fill="url(#corPatrimonio)" />
            </AreaChart>
        </ResponsiveContainer>
    )
}