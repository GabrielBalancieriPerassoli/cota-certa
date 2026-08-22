import Ativo from './Ativo'
import descobrirTipo from '../utils/ativos'
import { calcularInvestido } from '../utils/calculos'
import type { Ativo as AtivoData } from '../utils/tipos'

type CarteiraPorTipoProps = {
    tipo: string
    carteira: AtivoData[]
}

function CarteiraPorTipo(props: CarteiraPorTipoProps) {
    const real = new Intl.NumberFormat("pt-BR", {style: "currency", currency: "BRL"})

    const filtrada = props.carteira.filter((ativo) => {
        return descobrirTipo(ativo.ticker) === props.tipo
    })

    return (
        <div>
            <h2>Carteira de {props.tipo}</h2>
            {filtrada.map((ativo) => (
                <Ativo
                    key={ativo.ticker}
                    ticker={ativo.ticker}
                    quantidade={ativo.quantidade}
                    preco={ativo.preco}
                    precoMedio={ativo.precoMedio}
                />
            ))}
            <h3>Total investido: {real.format(calcularInvestido(filtrada))}</h3>
        </div>
    )
}

export default CarteiraPorTipo