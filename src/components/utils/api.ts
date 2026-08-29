import type { Ativo, AtivoComTipo } from './tipos'
import { classificarAtivos } from './ativos'

async function buscarAtivo(ticker: string): Promise<Ativo> {
    const token = import.meta.env.VITE_BRAPI_API_TOKEN ?? ""
    const resposta = await fetch(`https://brapi.dev/api/quote/${ticker}?token=${token}`) 
    const dados = await resposta.json()
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