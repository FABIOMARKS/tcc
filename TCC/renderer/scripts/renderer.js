let currentPage = 1;
const totalPages = 3;

document.getElementById('nextBtn').addEventListener('click', function () {
    if (currentPage < totalPages) {
        document.getElementById(`page${currentPage}`).classList.add('hidden');
        currentPage++;
        document.getElementById(`page${currentPage}`).classList.remove('hidden');
    }
    updateButtons();
});

document.getElementById('prevBtn').addEventListener('click', function () {
    if (currentPage > 1) {
        document.getElementById(`page${currentPage}`).classList.add('hidden');
        currentPage--;
        document.getElementById(`page${currentPage}`).classList.remove('hidden');
    }
    updateButtons();
});

function updateButtons() {
    const navButtons = document.getElementById('navigationButtons');

    if (currentPage === 1) {
        document.getElementById('prevBtn').classList.add('hidden');
        navButtons.classList.remove('justify-between');
        navButtons.classList.add('justify-end');  // Alinha o botão à direita
    } else {
        document.getElementById('prevBtn').classList.remove('hidden');
        navButtons.classList.remove('justify-end');
        navButtons.classList.add('justify-between');  // Distribui os botões
    }

    if (currentPage === totalPages) {
        document.getElementById('nextBtn').classList.add('hidden');
        document.getElementById('submitBtn').classList.remove('hidden');
    } else {
        document.getElementById('nextBtn').classList.remove('hidden');
        document.getElementById('submitBtn').classList.add('hidden');
    }
}

function toggleOutroInput() {
    var unidadeSelect = document.getElementById('unidade');
    var outroInputDiv = document.getElementById('outroInputDiv');

    if (unidadeSelect.value === 'outro') {
        // Mostrar o campo "Outro" quando a opção "Outro" for selecionada
        outroInputDiv.classList.remove('hidden');
    } else {
        // Esconder o campo "Outro" caso outra opção seja selecionada
        outroInputDiv.classList.add('hidden');
    }
}

function gerarCamposCargos() {
    const numParticipantesInput = document.getElementById('numeroParticipantes');
    const numParticipantesValue = parseInt(numParticipantesInput.value);
    const error = document.getElementById('error-msg');
    const cargoParticipantesDiv = document.getElementById('cargoParticipantesDiv');

    // Limpa os campos antigos
    cargoParticipantesDiv.innerHTML = '';

    if (numParticipantesValue >= 11) {
        numParticipantesInput.classList.add("border", "border-red-500", "rounded", "focus:outline-none", "focus:shadow-outline");
        error.classList.remove('hidden'); // Mostra a mensagem de erro
        cargoParticipantesDiv.innerHTML = ''; // Limpa os campos de preços, se houver
    } else {
        numParticipantesInput.classList.remove("border-red-500");
        error.classList.add('hidden'); // Esconde a mensagem de erro

        // Gera campos de preço baseados no número de participantes
        for (let i = 1; i <= numParticipantesValue; i++) {
            // Cria o elemento div que vai conter o select e o input opcional
            const div = document.createElement('div');
            div.classList.add('relative', 'mt-3');

            // Cria o label para o select
            const label = document.createElement('label');
            label.innerHTML = `Classificação do Cargo/Emprego/Função ${i}`;
            label.classList.add('block', 'text-gray-700', 'text-sm', 'font-bold', 'mb-2');

            // Cria o campo select
            const select = document.createElement('select');
            select.classList.add('w-full', 'rounded-lg', 'border-2', 'border-gray-400', 'p-4', 'text-sm', 'shadow-sm');

            // Cria as opções do select
            const opcoes = ['CCE-17; CCE-16; CCE-15; CCE-14; CCE-13 e equivalentes', 'Demais cargos, empregos e funções', 'Outro'];

            // Adiciona uma opção padrão "Selecione o cargo"
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.text = 'Selecione o Cargo/Emprego/Função';
            defaultOption.disabled = true;
            defaultOption.selected = true;
            select.appendChild(defaultOption);

            opcoes.forEach(opcao => {
                const option = document.createElement('option');
                option.value = opcao;
                option.text = opcao;
                select.appendChild(option);
            });

            // Adiciona evento para criar um campo de input se "Outro" for selecionado
            select.addEventListener('change', function () {
                let outroInput = div.querySelector('.outro-input');
                if (select.value === 'Outro' && !outroInput) {
                    outroInput = document.createElement('input');
                    outroInput.type = 'text';
                    outroInput.placeholder = 'Especifique o cargo';
                    outroInput.classList.add('outro-input', 'w-full', 'rounded-lg', 'border-2', 'border-gray-400', 'p-4', 'mt-2', 'text-sm', 'shadow-sm');
                    div.appendChild(outroInput);
                } else if (select.value !== 'Outro' && outroInput) {
                    outroInput.remove();
                }
            });

            // Adiciona o label e o select à div
            div.appendChild(label);
            div.appendChild(select);

            // Adiciona a div ao contêiner
            cargoParticipantesDiv.appendChild(div);
        }
    }
}

function formatarMoeda(campo) {
    var valor = campo.value;

    // Remove qualquer caractere que não seja número ou vírgula
    valor = valor.replace(/\D/g, "");

    // Adiciona a vírgula para os centavos
    valor = (valor / 100).toFixed(2) + '';
    valor = valor.replace(".", ",");

    // Adiciona os pontos para os milhares
    valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Atualiza o campo com o valor formatado
    campo.value = `R$${valor}`;
}

async function carregarCidadesEstados() {
    try {
        // Carrega os estados e municípios da API do IBGE
        const municipiosResponse = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios');

        const municipios = await municipiosResponse.json();

        return municipios;
    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
    }
}

async function popularDatalist() {
    const municipios = await carregarCidadesEstados();
    const datalist = document.getElementById('cidadeEstadoOptions');

    // Adiciona municípios ao datalist
    municipios.forEach(municipio => {
        const option = document.createElement('option');
        option.value = municipio.nome + " - " + municipio.microrregiao.mesorregiao.UF.sigla;
        datalist.appendChild(option);
    });
}

// Função para criar os balões de cidades/municípios
function criarBalao(cidadeNome) {
    const selectedCitiesDiv = document.getElementById('selectedCities');

    // Cria o elemento de balão (div) para a cidade
    const balaoDiv = document.createElement('div');
    balaoDiv.classList.add('bg-green-500', 'text-white', 'px-3', 'py-1', 'rounded-full', 'flex', 'items-center', 'space-x-2');

    // Adiciona o nome da cidade ao balão
    const nomeSpan = document.createElement('span');
    nomeSpan.textContent = cidadeNome;

    // Cria o botão "X" para remover o balão
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'x';
    removeBtn.classList.add('ml-2', 'text-white', 'hover:text-red-400', 'cursor-pointer');
    removeBtn.onclick = function() {
        selectedCitiesDiv.removeChild(balaoDiv); // Remove o balão ao clicar no "X"
    };

    // Adiciona o nome e o botão de remover ao balão
    balaoDiv.appendChild(nomeSpan);
    balaoDiv.appendChild(removeBtn);

    // Adiciona o balão à div de cidades selecionadas
    selectedCitiesDiv.appendChild(balaoDiv);
}

// Evento para capturar quando o usuário pressiona "Enter"
document.getElementById('cidadeEstadoInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Evita o comportamento padrão de enviar o formulário

        const cidadeNome = event.target.value;
        if (cidadeNome) {
            criarBalao(cidadeNome); // Cria um balão para a cidade
            event.target.value = ''; // Limpa o campo de input
        }
    }
});


// Chama a função para popular o datalist ao carregar a página
popularDatalist();

// Inicializar estado dos botões
updateButtons();

const { ipcRenderer } = require('electron');
const ExcelJS = require('exceljs');

document.getElementById('submitBtn').addEventListener('click', async (event) => {
    event.preventDefault(); // Evita que o formulário seja enviado

    // Coletar dados do formulário
    const unidade = document.getElementById('unidade').value;
    const missao = document.querySelector('input[placeholder="Especifique a missão"]').value;
    const objetivo = document.querySelector('textarea[placeholder="Detalhe o objetivo"]').value;
    const cidadeEstado = document.getElementById('cidadeEstadoInput').value;
    const inicioMissao = document.querySelector('input[type="date"][placeholder="Início da Missão"]').value;
    const terminoMissao = document.querySelector('input[type="date"][placeholder="Término da Missão"]').value;
    const numeroParticipantes = document.getElementById('numeroParticipantes').value;
    const numeroDiarias = document.querySelector('input[placeholder="Número de Diárias"]').value;

    // Criar uma nova planilha Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Diárias & Passagens');

    // Adicionar cabeçalhos
    worksheet.columns = [
        { header: 'Unidade', key: 'unidade' },
        { header: 'Missão', key: 'missao' },
        { header: 'Objetivo', key: 'objetivo' },
        { header: 'Cidade/Estado', key: 'cidade_estado' },
        { header: 'Início da Missão', key: 'inicio_missao' },
        { header: 'Término da Missão', key: 'termino_missao' },
        { header: 'Número de Participantes', key: 'numero_participantes' },
        { header: 'Número de Diárias', key: 'numero_diarias' }
    ];

    // Adicionar dados
    worksheet.addRow({
        unidade,
        missao,
        objetivo,
        cidade_estado: cidadeEstado,
        inicio_missao: inicioMissao,
        termino_missao: terminoMissao,
        numero_participantes: numeroParticipantes,
        numero_diarias: numeroDiarias
    });

    // Salvar a planilha
    const filePath = 'diarias_passagens.xlsx'; // Você pode usar um diálogo para escolher o local
    await workbook.xlsx.writeFile(filePath);
    console.log('Planilha salva com sucesso em: ' + filePath);
});
