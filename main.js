
function getIpcaCdi() {
  return fetch("http://localhost:3000/indicadores")
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      this.ipca = data.filter((indicadores) => indicadores.nome == "ipca");
      this.cdi = data.filter((indicadores) => indicadores.nome == "cdi");

      document.getElementById("ipca").value = this.ipca[0].valor + '%';
      document.getElementById("cdi").value = this.cdi[0].valor + '%';
    });
}
getIpcaCdi();


// Validação de campos vazios
function validation(e){
  e.preventDefault();

  let inputFields = [...document.getElementsByTagName("input")];
  console.log(inputFields);
  const emptyFieldNames = [];

  for (var i = 0; i < inputFields.length; i++) {
    if (inputFields[i].value === "") {
      emptyFieldNames.push(inputFields[i].getAttribute("name"));
    }
  }
  if (emptyFieldNames.length > 0) {
    document.querySelector(".alert").innerHTML =
      "Por favor, preencha os campos a seguir: <br>" + emptyFieldNames.join(" , ");
  }else{
    getResultado();
  }
}


// Resultado da simulação
function getResultado(e) {
  document.getElementById("result-container").style.display = "flex";

  return fetch("http://localhost:3000/simulacoes")
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {

      var selectBruto = document.querySelector('input[name="select"]:checked').id == "option-bruto";
      var selectLiquido = document.querySelector('input[name="select"]:checked').id == "option-liquido";
      var selectPre = document.querySelector('input[name="select2"]:checked').id == "option-pre";
      var selectPos = document.querySelector('input[name="select2"]:checked').id == "option-pos";
      var selectFixado = document.querySelector('input[name="select2"]:checked').id == "option-fixado";

      function setarAlturaGrafico(){
        valorAlturaAporte = this.resultInformations[0].graficoValores.comAporte;
        valorAlturaSemAporte = this.resultInformations[0].graficoValores.semAporte;

        // barras com aporte
        arr = [...document.getElementsByClassName("mes")];

        //grafico
        var grafico = document.getElementById('grafico');

        //limpa a area de gráfico quando clicar em simular novamente
        grafico.innerHTML=''

        for (const property in valorAlturaAporte) {
          var alturaConvertida = (valorAlturaAporte[property] * 100) / 2049;
          var divMes = document.createElement('div')
          divMes.style.height = alturaConvertida + "%";
          divMes.className = 'mes'
          grafico.append(divMes);

          var semAporte = document.createElement('div')
          var alturaConvertidaSemAporte = (valorAlturaSemAporte[property] * 100) / 2049;
          var altura = ((alturaConvertidaSemAporte / alturaConvertida) * divMes.offsetHeight);
          semAporte.className = 'black'
          semAporte.style.height = altura + "px";
          divMes.append(semAporte);
        }
      }

      if(selectBruto && selectPre){
        this.resultInformations = data.filter(
          (simulacoes) =>
            simulacoes.tipoIndexacao == "pre" &&
            simulacoes.tipoRendimento == "bruto"
        );

        setarAlturaGrafico();
        preencher();
      }
      
      else if (selectBruto && selectPos) {
        this.resultInformations = data.filter(
          (simulacoes) =>
            simulacoes.tipoIndexacao == "pos" &&
            simulacoes.tipoRendimento == "bruto"
        );
        setarAlturaGrafico();
        preencher();
      }
      
      else if (selectBruto && selectFixado) {
        this.resultInformations = data.filter(
          (simulacoes) =>
            simulacoes.tipoIndexacao == "ipca" &&
            simulacoes.tipoRendimento == "bruto"
        );
        setarAlturaGrafico();
        preencher();
      }
      
      else if (selectLiquido && selectPre) {
        this.resultInformations = data.filter(
          (simulacoes) =>
            simulacoes.tipoIndexacao == "pre" &&
            simulacoes.tipoRendimento == "liquido"
        );
        setarAlturaGrafico();
        preencher();
      }
      
      else if (selectLiquido && selectPos) {
        this.resultInformations = data.filter(
          (simulacoes) =>
            simulacoes.tipoIndexacao == "pos" &&
            simulacoes.tipoRendimento == "liquido"
        );
        setarAlturaGrafico();
        preencher();
      }
      
      else if (selectLiquido && selectFixado) {
        this.resultInformations = data.filter(
          (simulacoes) =>
            simulacoes.tipoIndexacao == "ipca" &&
            simulacoes.tipoRendimento == "liquido"
        );
        setarAlturaGrafico();
        preencher();
      }

      function preencher(){
        document.getElementById("valorFinalBruto").innerHTML = 'R$ ' + this.resultInformations[0].valorFinalBruto;
        document.getElementById("aliquotaIr").innerHTML = this.resultInformations[0].aliquotaIR + '%';
        document.getElementById("valorPagoIr").innerHTML = 'R$ ' + this.resultInformations[0].valorPagoIR;
        document.getElementById("totalInvestido").innerHTML = 'R$ ' + this.resultInformations[0].valorTotalInvestido;
        document.getElementById("valorFinalLiquido").innerHTML = 'R$ ' + this.resultInformations[0].valorFinalLiquido;
        document.getElementById("ganhoLiquido").innerHTML = "R$ " + this.resultInformations[0].ganhoLiquido;
      }
    });
}