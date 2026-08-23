
import type { AtivoComTipo } from '../utils/tipos'
import './Ativo.css'

type AtivoProps = AtivoComTipo

function Ativo(props: AtivoProps) {
  const real = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
  const valorTotal = props.quantidade * props.preco
  const rentabilidade = (props.preco - props.precoMedio) / props.precoMedio * 100

  return (
    <div className="card-ativo">
      <h3>{props.ticker}</h3>
      <p>Quantidade: {props.quantidade}</p>
      <p>{props.quantidade} cotas · {real.format(props.preco)}</p>
      <p>Total: {real.format(valorTotal)}</p>
      <p>Tipo: {props.tipo}</p>
      <p style={ { color: rentabilidade >= 0 ? "green" : "red" } }>
        Rentabilidade: {rentabilidade.toFixed(2)}%
      </p>
    </div>
  )

}

export default Ativo