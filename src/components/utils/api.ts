import type { Ativo, AtivoComTipo, TipoAtivo } from './tipos'
import { classificarAtivos } from './ativos'

const token = import.meta.env.VITE_BRAPI_API_TOKEN ?? ""

export async function descobrirTipo(ticker: string): Promise<TipoAtivo> {
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

async function buscarAtivo(ticker: string): Promise<Ativo> {
    const resposta = await fetch(`https://brapi.dev/api/quote/${ticker}?token=${token}`) 
    
    if (!resposta.ok) {
        throw new Error(`Erro ao buscar ativo ${ticker}: ${resposta.status}`)
    }

    const dados = await resposta.json()

    if (!dados.results || dados.results.length === 0) {
        throw new Error(`Ativo ${ticker} não encontrado`)
    }

    const item = dados.results[0]

    return {
        ticker: item.symbol,
        quantidade: 100,
        preco: item.regularMarketPrice,
        precoMedio: item.regularMarketPrice * 0.95, 
    }
}

export async function buscarCarteira(): Promise<AtivoComTipo[]> {

    try {

        const tickers = ["MXRF11", "HGLG11", "GARE11", "ITUB4", "BBSE3", "IVVB11", "AAPL34", "BOVA11"]

        // Etapa 1: busca os dados de mercado de cada ticker
        const ativos = await Promise.all(tickers.map((t) => buscarAtivo(t)))

        // Etapa 2: classifica (adiciona o tipo) via API
        return await classificarAtivos(ativos)
        
    } catch (erro) {
        console.error("Erro ao buscar carteira:", erro)
        return []   
    }

}