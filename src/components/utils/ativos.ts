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
  const papeis : {stock: string, type : string} [] = dados.stocks ?? []
  const ativo = papeis.find((stock) => stock.stock.toUpperCase() === t)
  
  if(!ativo) {
    return "Renda Fixa"
  }

  /*
  A API BRAPI retorna:"Stock -> Acao", "Fund -> FII", "Bdr -> Recibo de acao estrangeira listada no exterior" 
  */

  if(ativo.type === "fund") {
    return "FII"
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

/* function descobrirTipo(ticker: string): string {
  if (ticker.endsWith("11")) {
    return "FII"
  } else if (ticker.endsWith("3") || (ticker.endsWith("4"))) {
    return "Ação"
  } else {
    return "Renda Fixa"
  }
}

export default descobrirTipo
*/