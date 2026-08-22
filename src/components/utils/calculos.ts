import type { Ativo } from './tipos'

export function calcularPatrimonio(carteira: Ativo[]): number {
    return carteira.reduce((soma, ativo) => soma + ativo.quantidade * ativo.preco, 0)
}

export function calcularInvestido(carteira: Ativo[]): number {
    return carteira.reduce((soma, ativo) => soma + ativo.quantidade * ativo.precoMedio, 0)
}