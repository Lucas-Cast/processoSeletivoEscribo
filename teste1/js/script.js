const calcularSomatorio = nInteiro => {
    const pResultado = document.getElementById("resultado")
    let somatorio = 0
    if(nInteiro <= 0) return window.alert("Digite um número maior que 0")
    for(let i=0;i<nInteiro;i++){
        if(i%3 == 0 || i%5 == 0){
            somatorio+=i
        }    
    }
    pResultado.innerHTML = `Resultado: ${somatorio}`
}
