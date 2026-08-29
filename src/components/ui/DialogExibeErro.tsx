type DialogExibeErroProps = {
    tipo: "erro" | "sucesso"
    mensagem: string
    onClose: () => void 
}

export function DialogExibeErro({ tipo, mensagem, onClose}: DialogExibeErroProps) {
    return (
        <div className={`dialog ${tipo}`}>
            <p>{mensagem}</p>
            <button onClick={onClose}>Fechar</button>
        </div>
    )
}