import { useState, useEffect } from "react"
import { buscarCarteira } from "./utils/api"
import { DialogExibeErro } from "./ui/DialogExibeErro"
import type { AtivoComTipo } from "./utils/tipos"

export function Carteira() {
  const [erro, setErro] = useState<string | null>(null)
  const [carteira, setCarteira] = useState<AtivoComTipo[]>([])

  useEffect(() => {
    buscarCarteira().then(setCarteira).catch((e) => setErro(e.message))
  }, [])

  return (
    <div>
      {erro && (
        <DialogExibeErro
          tipo="erro"
          mensagem={erro}
          onClose={() => setErro(null)}
        />
      )}

      <h2>Minha Carteira</h2>
      <ul>
        {carteira.map((ativo) => (
          <li key={ativo.ticker}>
            {ativo.ticker} - {ativo.tipo} - R$ {ativo.preco}
          </li>
        ))}
      </ul>
    </div>
  )
}
