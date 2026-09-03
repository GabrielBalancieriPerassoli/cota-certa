
import Ativo from './components/ui/Ativo'
import { useState, useEffect } from 'react'
import { calcularPatrimonio, calcularInvestido } from './components/utils/calculos'
import CarteiraPorTipo from './components/ui/CarteiraPorTipo'
import { GraficoComposicao } from './components/ui/GraficoComposicao'
import { GraficoEvolucao } from './components/ui/GraficoEvolucao'
import type { AtivoComTipo, TipoAtivo } from './components/utils/tipos'
import { buscarCarteira, buscaDolar } from './components/utils/api'
import { DialogExibeErro } from './components/ui/DialogExibeErro'
import './App.css'

function App() {
  const [dolar, setDolar] = useState("")
  const [tela, setTela] = useState("dashboard")
  const [filtro] = useState<"Todos" | TipoAtivo>("Todos")
  const [carteira, setCarteira] = useState<AtivoComTipo[]>([])
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await buscaDolar()
        setDolar(dados.USDBRL.bid)
      } catch (e: unknown) {
        if (e instanceof Error) {
          setErro(e.message)
        } else {
          setErro(String(e))
        }
      }
    }
    carregar()
  }, [])

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await buscarCarteira()
        setCarteira(dados)
      } catch (e: unknown) {
        if (e instanceof Error) {
          setErro(e.message)
        } else {
          setErro(String(e))
        }
      }
    }
    carregar()
  }, [])

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
      {erro && (
        <DialogExibeErro
            tipo="erro"
            mensagem={erro}
            onClose={() => setErro(null)}
          />
      )}
      <div className="app">
        <aside className="sidebar">
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
        </aside>
        <main className="conteudo">
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
                <div className="cards">
                  <div className="card">
                    <span className="card-label">Patrimônio</span>
                    <span className="card-valor">{real.format(patrimonioTotal)}</span>
                  </div>

                  <div className="card">
                    <span className="card-label">Total investido</span>
                    <span className="card-valor">{real.format(totalInvestido)}</span>
                  </div>

                  <div className="card">
                    <span className="card-label">Lucro</span>
                    <span className="card-valor" style={{ color: lucro >= 0 ? "#5CB88A" : "#DB7A56" }}>
                      {real.format(lucro)}
                    </span>
                  </div>

                  <div className="card">
                    <span className="card-label">Rentabilidade</span>
                    <span className="card-valor" style={{ color: rentabilidade  >= 0 ? "#5CB88A" : "#DB7A56" }}>
                      {rentabilidade.toFixed(2)}%
                    </span>
                  </div>

                  <p>{fiis} FIIs, {acoes} Ações, {rendaFixa} Renda Fixa</p>
                </div>

                <div className="cards">
                  <div className="card">
                    <GraficoComposicao carteira={carteira} />
                  </div>

                  <div className="card">
                    <GraficoEvolucao carteira={carteira} />
                  </div>
                </div>
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
        </main>
      </div>
    </>
  )
}

export default App
