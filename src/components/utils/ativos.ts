import type { Ativo, AtivoComTipo, TipoAtivo } from './tipos'

const token = import.meta.env.VITE_BRAPI_API_TOKEN ?? ""
console.log("Token BRAPI:", token)

async function descobrirTipo(ticker: string): Promise<TipoAtivo> {
  const t = ticker.trim().toUpperCase()

  const resposta = await fetch(`https://brapi.dev/api/quote/list?search=${t}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })

  if (!resposta.ok) {
    throw new Error(`Erro ao buscar informações do ativo ${ticker}: ${resposta.statusText}`)
  }

  const dados = await resposta.json()
  const papeis: {
    stock: string
    type: string
    subType: string
  }[] = dados.stocks ?? []
  const ativo = papeis.find((stock) => stock.stock.toUpperCase() === t)
  
  if(!ativo) {
    return "Renda Fixa"
  }

  /*
    A API BRAPI retorna:

    type:
    "stock" -> Ação
    "fund"  -> Fundo
    "bdr"   -> BDR

    subType:
    "fii"   -> FII
    "etf"   -> ETF
    "stock" -> Ação
    "unit"  -> Unit
    "bdr"   -> BDR
  */
 
  if(ativo.subType === "fii") {
    return "FII"
  }

  if (ativo.subType === "etf") {
    return "ETF"
  }

  if(ativo.type === "stock") {
    return "Ação"
  }

  if(ativo.type === "bdr") {
    return "BDR"
  }

  return "Desconhecido"

}

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

export default descobrirTipo