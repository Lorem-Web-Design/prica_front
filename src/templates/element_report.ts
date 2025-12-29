import EstinorteLogo from "../assets/images/logo.png";

export default function ElementReport(
  receiverData: { name: string; id: string; position: string },
  deliverData: { name: string; id: string; position: string },
  equipmentData: { name: string; serial: string }
) {
    
  if (receiverData.name.trim() === "") {
    receiverData.name =
      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp";
  }
  if (receiverData.id.trim() === "") {
    receiverData.id =
      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp";
  }
  if (receiverData.position.trim() === "") {
    receiverData.position =
      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp";
  }

  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  const monthsInfo = {1: "Enero", 2: "Febrero", 3: "Marzo", 4: "Abril", 5: "Mayo", 6: "Junio", 7: "Julio", 8: "Agosto", 9: "Septiembre", 10: "Octubre", 11: "Noviembre", 12: "Diciembre"}
  return `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- CSS only -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style type="text/css">
        .primary_theme {
            background-color: #B6F0C6;
            color: #00210F;
        }

        .header_container {
            display: flex;
            border: solid 1px black;

        }

        .estinorte_logo {
            border-right: solid black 1px;
        }

        .header_title {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
        }

        .txt-justify {
            text-align: justify !important;
        }

        .signature{
            margin: 0;
        }
    </style>
    <title>Reporte</title>
</head>

<body>
    <div class="container">
        <div class="header_container">
            <div class="estinorte_logo px-2 py-2">
                <img src=${EstinorteLogo} alt="">
            </div>
            <div class="header_title px-2 py-2">
                ACTA DE ENTREGA DE EQUIPOS
            </div>
        </div>
        <br>
        <!-- Body-->
        <p class="txt-justify">En la ciudad de Santa Marta a los ${day} días del mes de ${monthsInfo[month]} de ${year} se hace entrega a
            ${receiverData.name}, identificado
            con el número de cédula ${receiverData.id}, quien se desempeña como ${receiverData.position}, el equipo se relaciona a
            continuación.</p>
        <br>
        <div class="row justify-content-center">
            <div class="col-auto">
                <table class="table table-bordered">
                    <thead class="primary_theme">
                        <tr>
                            <td>NOMBRE</td>
                            <td>SERIAL</td>
                            <td>DESCRIPCIÓN</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${equipmentData.name}</td>
                            <td>${equipmentData.serial}</td>
                            <td>DESCRIPCIÓN</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <br>
        <p class="txt-justify">Al momento de recibir el elemento aquí especificado se realizaron las pruebas de
            funcionamiento y se encontró en
            buen estado físico y de funcionamiento</p>
        <p class="txt-justify">Certifico que los elementos detallados en el presente documento me han sido entregados
            para mi cuidado y
            custordia con el propósito de cumplir con las tareas y asignaciones propias de mi cargo. Me comprometo a
            usar
            correctamente los recursos y solo para los fines establecidos.</p>
        <p class="txt-justify">Se firma a continuacion para dejar constancia</p>
            <br>
            <br>
        <div class="row">
            <div class="col">
                <p>Recibe el equipo</p>

                <br>
                <br>
                <br>
                <br>
                <p class="signature">${receiverData.name}</p>
                <p class="signature">${receiverData.position}</p>
                <p class="signature">C.C. ${receiverData.id}</p>
            </div>
            <div class="col">
                <p>Entrega el equipo</p>

                <br>
                <br>
                <br>
                <br>
                <p class="signature">${deliverData.name}</p>
                <p class="signature">${deliverData.position}</p>
                <p class="signature">C.C. ${deliverData.id}</p>
            </div>
        </div>
        </p>
    </div>
</body>

</html>
`;
}
