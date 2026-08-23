export type TipoAtivo = "Ação" | "FII" | "Renda Fixa" | "BDR" | "Desconhecido"

export type AtivoComTipo = Ativo & {
    tipo:TipoAtivo
}

export type Ativo = {
    ticker: string
    quantidade: number 
    preco: number 
    precoMedio: number
}