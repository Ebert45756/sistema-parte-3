let avisos =
    JSON.parse(localStorage.getItem("avisos")) || [];


// ELEMENTOS

const form =
    document.getElementById("formAviso");

const lista =
    document.getElementById("listaAvisos");

const pesquisa =
    document.getElementById("pesquisa");

const filtroPrioridade =
    document.getElementById("filtroPrioridade");


// DATA ATUAL

document.getElementById("data").value =
    new Date()
        .toISOString()
        .split("T")[0];


// ADICIONAR AVISO

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const titulo =
        document.getElementById("titulo").value;

    const descricao =
        document.getElementById("descricao").value;

    const prioridade =
        document.getElementById("prioridade").value;

    const data =
        document.getElementById("data").value;


    const novoAviso = {

        id: Date.now(),

        titulo: titulo,

        descricao: descricao,

        prioridade: prioridade,

        data: data

    };


    avisos.unshift(novoAviso);

    salvarAvisos();

    mostrarAvisos();


    form.reset();


    document.getElementById("data").value =
        new Date()
            .toISOString()
            .split("T")[0];

});


// SALVAR

function salvarAvisos() {

    localStorage.setItem(
        "avisos",
        JSON.stringify(avisos)
    );

}


// EXCLUIR

function excluirAviso(id) {

    if (
        confirm(
            "Deseja realmente excluir este aviso?"
        )
    ) {

        avisos =
            avisos.filter(
                aviso => aviso.id !== id
            );

        salvarAvisos();

        mostrarAvisos();

    }

}


// FORMATAR DATA

function formatarData(data) {

    if (!data) {
        return "";
    }

    const partes =
        data.split("-");

    return `
        ${partes[2]}/${partes[1]}/${partes[0]}
    `;
}


// MOSTRAR AVISOS

function mostrarAvisos() {

    const termo =
        pesquisa.value.toLowerCase();

    const filtro =
        filtroPrioridade.value;


    const avisosFiltrados =
        avisos.filter(aviso => {

            const correspondePesquisa =

                aviso.titulo
                    .toLowerCase()
                    .includes(termo)

                ||

                aviso.descricao
                    .toLowerCase()
                    .includes(termo);


            const correspondePrioridade =

                filtro === "todos"

                ||

                aviso.prioridade === filtro;


            return (
                correspondePesquisa &&
                correspondePrioridade
            );

        });


    lista.innerHTML = "";


    if (
        avisosFiltrados.length === 0
    ) {

        lista.innerHTML = `
            <div class="sem-avisos">

                <p>
                    📭 Nenhum aviso encontrado.
                </p>

            </div>
        `;

        return;
    }


    avisosFiltrados.forEach(aviso => {

        const elemento =
            document.createElement("div");


        elemento.className =
            `aviso ${aviso.prioridade}`;


        const nomePrioridade = {

            baixa: "Baixa",

            media: "Média",

            alta: "Alta"

        };


        elemento.innerHTML = `

            <h3>
                ${escapeHTML(aviso.titulo)}
            </h3>

            <p>
                ${escapeHTML(aviso.descricao)}
            </p>

            <div class="informacoes">

                <span
                    class="badge ${aviso.prioridade}"
                >
                    ${nomePrioridade[aviso.prioridade]}
                </span>


                <span class="data">
                    📅 ${formatarData(aviso.data)}
                </span>


                <button
                    class="btn-excluir"
                    onclick="excluirAviso(${aviso.id})"
                >
                    Excluir
                </button>

            </div>

        `;


        lista.appendChild(elemento);

    });

}


// PROTEÇÃO CONTRA HTML

function escapeHTML(texto) {

    const div =
        document.createElement("div");

    div.textContent = texto;

    return div.innerHTML;

}


// PESQUISA

pesquisa.addEventListener(
    "input",
    mostrarAvisos
);


// FILTRO

filtroPrioridade.addEventListener(
    "change",
    mostrarAvisos
);


// CARREGAR

mostrarAvisos();
