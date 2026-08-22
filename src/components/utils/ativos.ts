function descobrirTipo(ticker: string): string {
  if (ticker.endsWith("11")) {
    return "FII"
  } else if (ticker.endsWith("3") || (ticker.endsWith("4"))) {
    return "Ação"
  } else {
    return "Renda Fixa"
  }
}

export default descobrirTipo