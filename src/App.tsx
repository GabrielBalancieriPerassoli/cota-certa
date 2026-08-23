
import Ativo from './components/ui/Ativo'
import { useState, useEffect } from 'react'
import { classificarAtivos } from './components/utils/ativos'
import { calcularPatrimonio, calcularInvestido } from './components/utils/calculos'
import CarteiraPorTipo from './components/ui/CarteiraPorTipo'
import { GraficoComposicao } from './components/ui/GraficoComposicao'
import type { Ativo as AtivoTipo, AtivoComTipo, TipoAtivo } from './components/utils/tipos'

function App() {
  const [dolar, setDolar] = useState("")
  const [tela, setTela] = useState("dashboard")
  const [filtro, setFiltro] = useState<"Todos" | TipoAtivo>("Todos")
  const [carteira, setCarteira] = useState<AtivoComTipo[]>([])

  useEffect(() => {
    buscaDolar()
  }, [])

  async function buscaDolar() {
    const resposta = await fetch("https://economia.awesomeapi.com.br/last/USD-BRL")
    const dados = await resposta.json()
    setDolar(dados.USDBRL.bid)
  }

  useEffect(() => {
    buscarCarteira()
  }, [])

  async function buscarCarteira() {
    // simula a espera de uma busca real (1 segundo)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const dadosRecebidos : AtivoTipo[] = [
      { ticker: "MXRF11", quantidade: 10, preco: 9.85, precoMedio: 9.80 },
      { ticker: "HGLG11", quantidade: 60, preco: 151.00, precoMedio: 158.00 },
      { ticker: "KNCR11", quantidade: 110, preco: 102.30, precoMedio: 99.50 },
      { ticker: "XPML11", quantidade: 90, preco: 107.50, precoMedio: 104.00 },
      { ticker: "BBAS3",  quantidade: 70, preco: 50.5, precoMedio: 50.00 },
      { ticker: "KLBN3",  quantidade: 50, preco: 15.0, precoMedio: 13.50 },
      { ticker: "BOVA11", quantidade: 50, preco: 20.0, precoMedio: 13.50 },
      { ticker: "KLBN11", quantidade: 50, preco: 12.0, precoMedio: 20.50 },
      { ticker: "SANB11", quantidade: 15, preco: 30.0, precoMedio: 20.50 },
    ]

    setCarteira(await classificarAtivos(dadosRecebidos))
  }

  if (carteira.length === 0) {
    return <p>Carregando carteira...</p>
  }

  const real = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

  const patrimonioTotal = calcularPatrimonio(carteira)
  const totalInvestido = calcularInvestido(carteira)

  const lucro = patrimonioTotal - totalInvestido
  const rentabilidade = lucro / totalInvestido * 100

  const carteiraFiltrada = carteira.filter((ativo) => {
    if (filtro === "Todos") return true
    return ativo.tipo === filtro
  })

  const ativos = carteira.reduce((soma) => {
    return soma + 1
  }, 0)

  const fiis = carteira.filter((ativo) => ativo.tipo === "FII").length
  const acoes = carteira.filter((ativo) => ativo.tipo === "Ação").length
  const rendaFixa = carteira.filter((ativo) => ativo.tipo === "Renda Fixa").length

  const maiorPos = carteira.reduce((campeao, ativo) => {
    const valorCampeao = campeao.quantidade * campeao.preco 
    const valorAtivo   = ativo.quantidade * ativo.preco
    if (valorAtivo > valorCampeao) {
      return ativo // campeao
    } else {
      return campeao // mantem campeao
    }
  })

  return (
    <>
      <h1>CotaCerta</h1>
      <nav>
        <button onClick={() => setTela("dashboard")}>Dashboard</button>
        <button onClick={() => setTela("carteira")}>Carteira</button>
        <button onClick={() => setTela("analise")}>Análise</button>
        <button onClick={() => setTela("acoes")}>Ações</button>
        <button onClick={() => setTela("fii")}>FIIs</button>
        <button onClick={() => setTela("rendafixa")}>Renda Fixa</button>
        <button onClick={buscaDolar}>Buscar dólar</button>
        <p>Dólar: {dolar}</p>
      </nav>
      <div>
        <button onClick={() => setFiltro("Todos")}>Todos</button>
        <button onClick={() => setFiltro("FII")}>FIIs</button>
        <button onClick={() => setFiltro("Ação")}>Ação</button>
      </div>

      {tela === "carteira" && (
        <div>
          {carteiraFiltrada.map((ativos) => (
            <Ativo 
              key={ativos.ticker}
              ticker={ativos.ticker}
              quantidade={ativos.quantidade}
              preco={ativos.preco}
              precoMedio={ativos.precoMedio}
              tipo={ativos.tipo}
            />
          ))}
        </div>
      )}

      {tela === "dashboard" && (
        <div>
          <h2>Você tem {ativos}  ativos - Patrimônio: {real.format(patrimonioTotal)}</h2>
          <h3>{fiis} FIIs, {acoes} Ações, {rendaFixa} Renda Fixa</h3>
          <h3 style={{ color: lucro >= 0 ? "green" : "red" }}>Lucro: {real.format(lucro)}</h3>
          <h3 style={{ color: rentabilidade >= 0 ? "green " : "red" }}>Rentabilidade: {rentabilidade.toFixed(2)}</h3>
          <GraficoComposicao carteira={carteira} />
        </div>
      )}

      {tela === "analise" && (
        <div>
          <h2>O total investido: {real.format(totalInvestido)}</h2>
          <h2>A rentabilidade: {rentabilidade.toFixed(2)}</h2>
          <h2>Total ativos: {ativos}</h2>
          <h2>Ativo mais caro: {maiorPos.ticker}</h2>
        </div>
      )}

      {tela === "acoes" && (
          <CarteiraPorTipo
            tipo="Ação"
            carteira={carteira}
          />
      )}

      {tela === "fii" && (
          <CarteiraPorTipo
            tipo="FII"
            carteira={carteira}
          />
      )}

      {tela === "rendafixa" && (
          <CarteiraPorTipo
            tipo="Renda Fixa"
            carteira={carteira}
          />
      )}
    </>
  )
}

export default App
