import type { Ativo, AtivoComTipo } from './tipos'
import { descobrirTipo } from './api'

export async function classificarAtivos(carteira: Ativo[]): Promise<AtivoComTipo[]> {
  return Promise.all(
    carteira.map(async (ativo) => {
      try {
        return { ...ativo, tipo: await descobrirTipo(ativo.ticker) }
      }
      catch {
        throw new Error(`Erro ao classificar o ativo ${ativo.ticker}`)
      }
    })
  )
}