export type TipoAtivo = "Ação" | "FII" | "ETF" | "Renda Fixa" | "BDR" | "Desconhecido"

export type AtivoComTipo = Ativo & {
    tipo:TipoAtivo
}

export type Ativo = {
    ticker: string
    quantidade: number 
    preco: number 
    precoMedio: number
}

export type ResultadoCarteira = {
  carteira: AtivoComTipo[]
  ativosNaoEncontrados: string[]
}