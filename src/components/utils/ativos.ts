import type { Ativo, AtivoComTipo } from './tipos'
import { descobrirTipo } from './api'

export async function classificarAtivos(
  ativos: Ativo[]
): Promise<AtivoComTipo[]> {

  const resultados = await Promise.all(
    ativos.map(async (a) => {

      try {

        const tipo = await descobrirTipo(a.ticker)

        return {
          ...a,
          tipo
        }

      } catch (e) {

        console.error(
          `Erro ao classificar o ativo ${a.ticker}:`,
          e
        )

        return null
      }
    })
  )

  return resultados.filter(
    (a): a is AtivoComTipo => a !== null
  )
}