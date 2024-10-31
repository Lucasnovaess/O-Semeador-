const protocolo = 'http://'
const baseURL = 'localhost:3000'

let edicaoAtivada = false

async function cadastrarUsuario() {
    let usuarioCadastroInput = document.querySelector('#usuarioCadastroInput')
    let passwordCadastroInput = document.querySelector('#passwordCadastroInput')
    let usuarioCadastro = usuarioCadastroInput.value
    let passwordCadastro = passwordCadastroInput.value
    if (usuarioCadastro && passwordCadastro) {
        try {
            const cadastroEndpoint = '/signup'
            const URLCompleta = `${protocolo}${baseURL}${cadastroEndpoint}`
            await axios.post(URLCompleta, {
                login: usuarioCadastro, password:
                    passwordCadastro
            })
            usuarioCadastroInput.value = ""
            passwordCadastroInput.value = ""
            exibirAlerta('.alert-modal-cadastro', "Usuário cadastrado com sucesso!",
                ['show', 'alert-success'], ['d-none', 'alert-danger'], 2000)
            ocultarModal('#modalLogin', 2000)

        }
        catch (error) {
            exibirAlerta('.alert-modal-cadastro', "Erro ao cadastrar usuário", ['show',
                'alert-danger'], ['d-none', 'alert-success'], 2000)
            ocultarModal('#modalLogin', 2000)

        }
    }
    else {
        exibirAlerta('.alert-modal-cadastro', 'Preencha todos os campos', ['show',
            'alert-danger'], ['d-none', 'alert-success'], 2000)
    }
}

const fazerLogin = async () => {
    let usuarioLoginInput = document.querySelector('#usuarioLoginInput')
    let passwordLoginInput = document.querySelector('#passwordLoginInput')
    let usuarioLogin = usuarioLoginInput.value
    let passwordLogin = passwordLoginInput.value
    if (usuarioLogin && passwordLogin) {
        try {
            const loginEndpoint = '/login'
            const URLCompleta = `${protocolo}${baseURL}${loginEndpoint}`
            //já já vamos fazer algo com a resposta (pegar o token)
            const response = await axios.post(
                URLCompleta,
                { login: usuarioLogin, password: passwordLogin }
            )
            console.log(response.data)
            usuarioLoginInput.value = ""
            passwordLoginInput.value = ""
            exibirAlerta('.alert-modal-login', "Login efetuado com sucesso!",
                ['show', 'alert-success'], ['d-none', 'alert-danger'], 2000)
            ocultarModal('#modalLogin', 2000)
            const cadastrarButton =
                document.querySelector('#cadastroButton')
            cadastrarButton.disabled = false
            const salvar = document.querySelector('#salvar-alteracoes');
            document.querySelectorAll('.btn-adicionar-imagem, .btn-remover-imagem').forEach(botao => {
                botao.classList.remove('d-none');
            })
            const editarTexto = document.querySelector('#editar-texto');
            editarTexto.classList.remove('d-none');
            salvar.classList.remove('d-none');
            document.getElementById('botoesEdicao').classList.remove('d-none');
            const botoesAtualizar = document.querySelectorAll(".btn-atualizar");
            botoesAtualizar.forEach(botao => botao.classList.remove("d-none"));


            document.querySelector('#editar-texto').addEventListener('click', () => {
                const textosEditaveis = Array.from(document.querySelectorAll('.titulo, .paragrafo, .sub-titulo'));
                textosEditaveis.forEach(texto => {
                    texto.contentEditable = texto.isContentEditable ? false : true; // Alterna entre editável e não editável
                });
            });
        }
        catch (error) {
        }
    }
    else {
        exibirAlerta('.alert-modal-login', 'Preencha todos os campos', ['show',
            'alert-danger'], ['d-none', 'alert-success'], 2000)
    }
}


const buscarTextos = async () => {
    const cadastroEndpoint = '/textos-puxar';
    const URLCompleta = `${protocolo}${baseURL}${cadastroEndpoint}`;
    try {
        const response = await axios.get(URLCompleta);
        const textos = response.data;

        textos.forEach((texto) => {
            // Seleciona a row usando o idTexto
            const row = document.querySelector(`[data-id='${texto.idTexto}']`); // Seleciona a linha com o data-id correspondente

            if (row) {
                const tituloElement = row.querySelector('.titulo');
                const subtituloElement = row.querySelector('.sub-titulo');
                const paragrafoElement = row.querySelector('.paragrafo');

                if (tituloElement) {
                    tituloElement.innerText = texto.titulo;
                }

                if (subtituloElement) {
                    subtituloElement.innerText = texto.subtitulo;
                }

                if (paragrafoElement) {
                    paragrafoElement.innerText = texto.conteudo;
                }
            } else {
                console.warn(`Row com idTexto ${texto.idTexto} não encontrada.`);
            }
        });
    } catch (error) {
        console.error('Erro ao buscar textos:', error);
    }
};

const salvarAlteracoes = async () => {
    const atualizarEndpoint = '/textos-atualizar';
    const URLCompleta = `${protocolo}${baseURL}${atualizarEndpoint}`;
    try {
        const textos = Array.from(document.querySelectorAll('.row')).map((row) => {
            const tituloElement = row.querySelector('.titulo');
            const subtituloElement = row.querySelector('.sub-titulo');
            const paragrafoElement = row.querySelector('.paragrafo');
            const idTexto = row.getAttribute('data-id'); // Renomeia para idTexto

            return {
                idTexto, // Usa idTexto no corpo da requisição
                titulo: tituloElement && tituloElement.innerText.trim() !== '' ? tituloElement.innerText : '', // Verifica se o título não está vazio
                subtitulo: subtituloElement && subtituloElement.innerText.trim() !== '' ? subtituloElement.innerText : '', // Verifica se o subtítulo não está vazio
                conteudo: paragrafoElement && paragrafoElement.innerText.trim() !== '' ? paragrafoElement.innerText : '', // Verifica se o conteúdo não está vazio
            };
        });

        await Promise.all(textos.map(texto =>
            axios.put(URLCompleta, texto) // Envia o texto com idTexto
        ));

        console.log('Textos atualizados com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar textos:', error);
    }
};
async function carregarImagens() {
    const puxarImagemEndpoint = '/imagens-puxar'
    const URLCompleta = `${protocolo}${baseURL}${puxarImagemEndpoint}`
    try {

        const response = await axios.get(URLCompleta);
        const imagens = response.data;
        const carouselInner = document.querySelector('.imagens');
        carouselInner.innerHTML = '';

        imagens.forEach((imagem, index) => {
            const isActive = index === 0 ? 'active' : '';
            const carouselItem = `
                        <div class="carousel-item ${isActive} imagem" data-id="${imagem._id}">
                            <img src="${imagem.src}" class="img d-block w-100" alt="Imagem">
                            <div class="btn-container">
                                <button class="btn btn-primary d-none btn-adicionar-imagem" data-bs-toggle="modal" data-bs-target="#imagemModal">Adicionar Imagem</button>
                                <button class="btn btn-danger d-none btn-remover-imagem" onclick="removerImagem('${imagem._id}')">Remover Imagem</button>
                            </div>
                        </div>`;
            carouselInner.innerHTML += carouselItem;
            console.log(imagem._id)
        });
    }

    catch {
        (error => console.error('Erro ao carregar imagens:', error));
    }
}


let imagemIndex = 4; // Índice inicial para novas imagens



function adicionarImagemPorArquivo() {
    const fileInput = document.getElementById('imagemFile');
    const file = fileInput.files[0];

    if (!file) {
        alert('Por favor, selecione uma imagem.');
        return;
    }

    const reader = new FileReader();
    reader.onload = async function (e) {
        const imagemURL = e.target.result;

        const carouselInner = document.querySelector('.imagens');
        const novaImagemDiv = document.createElement('div');
        novaImagemDiv.className = 'carousel-item imagem';

        novaImagemDiv.innerHTML = `
            <img src="${imagemURL}" class="d-block w-100" alt="Imagem ${imagemIndex + 1}">
            <button class="btn btn-primary d-none btn-adicionar-imagem" onclick="adicionarImagemPorArquivo()">Adicionar Imagem</button>
            <button class="btn btn-danger d-none btn-remover-imagem" onclick="removerImagem()">Remover Imagem</button>
        `;

        carouselInner.appendChild(novaImagemDiv);
        imagemIndex++;

        // Enviar a nova imagem para o banco de dados
        try {
            await fetch('http://localhost:3000/imagens-adicionar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ src: imagemURL })
            });
        } catch (error) {
            alert('arquivo muito pesado');
            console.error('Erro ao salvar a imagem no banco de dados:', error);
        }

        // Limpa o input e fecha o modal
        fileInput.value = '';
        const modal = bootstrap.Modal.getInstance(document.getElementById('imagemModal'));
        modal.hide();
    };

    reader.readAsDataURL(file);
}

function removerImagem(idImagem) {
    const carouselItem = document.querySelector(`.imagem[data-id='${idImagem}']`);

    if (carouselItem) {
        // Fazer a requisição para remover a imagem no back-end
        fetch(`http://localhost:3000/imagens-remover/${idImagem}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao remover a imagem');
                }
                return response.json();
            })
            .then(() => {
                const parent = carouselItem.parentElement;
                parent.removeChild(carouselItem);
                imagemIndex--;

                // Se a imagem removida for a ativa, tornar a próxima ativa
                if (carouselItem.classList.contains('active')) {
                    const nextItem = parent.querySelector('.imagem');
                    if (nextItem) {
                        nextItem.classList.add('active');
                    }
                }
            })
            .catch(error => {
                console.error(error);
            });
    } else {
        console.error("Imagem não encontrada ou já removida");
    }
}

async function carregarParceiros() {
    const puxarImagemEndpoint = '/parceiros-puxar'
    const URLCompleta = `${protocolo}${baseURL}${puxarImagemEndpoint}`
    try {

        const response = await axios.get(URLCompleta);
        const parceiros = response.data;
        const carouselInner = document.querySelector('.parceiros');
        carouselInner.innerHTML = ''; // Limpa o conteúdo existente

        parceiros.forEach((parceiro, index) => {
            const isActive = index === 0 ? 'active' : '';
            const carouselItem = `
                        <div class="carousel-item ${isActive} parceiro" data-id="${parceiro._id}">
                            <img src="${parceiro.src}" class="d-block w-100">
                            <div class="btn-container">
                                <button class="btn btn-primary d-none btn-adicionar-imagem" data-bs-toggle="modal" data-bs-target="#parceiroModal">Adicionar parceiro/button>
                                <button class="btn btn-danger d-none btn-remover-imagem" onclick="removerParceiro('${parceiro._id}')">Remover Parceiro</button>
                            </div>
                        </div>`;
            carouselInner.innerHTML += carouselItem;
            console.log(parceiro._id)
        });
    }

    catch {
        (error => console.error('Erro ao carregar imagens:', error));
    }
}

function adicionarParceiroPorArquivo() {
    const fileInput = document.getElementById('parceiroFile');
    const file = fileInput.files[0];

    if (!file) {
        alert('Por favor, selecione uma imagem.');
        return;
    }

    const reader = new FileReader();
    reader.onload = async function (e) {
        const parceiroURL = e.target.result;

        const carouselInner = document.querySelector('.parceiros');
        const novoParceiroDiv = document.createElement('div');
        novoParceiroDiv.className = 'parceiro';
        novoParceiroDiv.className = 'carousel-item'; 

        novoParceiroDiv.innerHTML = `
            <img src="${parceiroURL}" class="d-block w-100"">
            <div class="btn-container">
                <button class="btn btn-primary d-none btn-adicionar-parceiro" data-bs-toggle="modal" data-bs-target="#parceiroModal"">Adicionar Parceiro</button>
                <button class="btn btn-danger d-none btn-remover-parceiro" onclick="removerParceiro()">Remover Parceiro</button>
            </div>
        `;

        carouselInner.appendChild(novoParceiroDiv);

        // Enviar a nova imagem para o banco de dados
        try {
            await fetch('http://localhost:3000/parceiros-adicionar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ src: parceiroURL })
            });
        } catch (error) {
            console.error('Erro ao salvar a imagem no banco de dados:', error);
        }

        // Limpa o input e fecha o modal
        fileInput.value = '';
        const modal = bootstrap.Modal.getInstance(document.getElementById('parceiroModal'));
        modal.hide();
    };

    reader.readAsDataURL(file);
}

async function carregarImagensEstaticas() {
    const response = await fetch('http://localhost:3000/imagem-estatica-puxar');
    const imagens = await response.json();
    imagens.forEach(imagem => {
        const div = document.getElementById(imagem.divId);
        if (div) {
            div.innerHTML = `
            <img src="${imagem.src}" class="img-fluid" alt="${imagem.divId}">
            <input type="file" id="uploadImagem${imagem.divId}" class="d-none" accept="image/*" onchange="atualizarImagemEstatica('${imagem.divId}')">
            <button id="btnAtualizarImagem${imagem.divId}" class="btn btn-atualizar btn-primary mt-2 d-none" onclick="document.getElementById('uploadImagem${imagem.divId}').click()">Atualizar Imagem</button>`;
        }
    });
}

async function atualizarImagemEstatica(divId) {
    const fileInput = document.getElementById(`uploadImagem${divId}`);
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function (e) {
        const src = e.target.result;

        await fetch('http://localhost:3000/imagem-estatica-atualizar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ divId, src })
        });

        document.getElementById(divId).querySelector('img').src = src;
    };
    reader.readAsDataURL(file);
}


function removerParceiro(idParceiro) {
    const carouselItem = document.querySelector(`.parceiro[data-id='${idParceiro}']`);

    if (carouselItem) {
        // Fazer a requisição para remover a imagem no back-end
        fetch(`http://localhost:3000/parceiros-remover/${idParceiro}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao remover a imagem');
                }
                return response.json();
            })
            .then(() => {
                const parent = carouselItem.parentElement;
                parent.removeChild(carouselItem);

                // Se a imagem removida for a ativa, tornar a próxima ativa
                if (carouselItem.classList.contains('active')) {
                    const nextItem = parent.querySelector('.parceiro');
                    if (nextItem) {
                        nextItem.classList.add('active');
                    }
                }
            })
            .catch(error => {
                console.error(error);
            });
    } else {
        console.error("Parceiro não encontrado ou já removida");
    }
}


function exibirAlerta(seletor, innerHTML, classesToAdd, classesToRemove,
    timeout) {
    let alert = document.querySelector(seletor)
    alert.innerHTML = innerHTML
    //... é o spread operator
    //quando aplicado a um array, ele "desmembra" o array
    //depois disso, passamos os elementos do array como argumentos para add e remove
    alert.classList.add(...classesToAdd)
    alert.classList.remove(...classesToRemove)
    setTimeout(() => {
        alert.classList.remove('show')
        alert.classList.add('d-none')
    }, timeout)
}

function ocultarModal(seletor, timeout) {
    setTimeout(() => {
        let modal = bootstrap.Modal.getInstance(document.querySelector(seletor))
        modal.hide()
    }, timeout)
}



new window.VLibras.Widget('https://vlibras.gov.br/app');

let isSpeaking = false; // Variável para rastrear o estado da leitura
let utterance; // Variável para armazenar a instância de SpeechSynthesisUtterance

// Função para ler o site inteiro ou parar a leitura
function lerSiteInteiro() {
    const texto = document.body.innerText;

    if (isSpeaking) {
        // Se já estiver falando, para a leitura
        window.speechSynthesis.cancel(); // Para a leitura
        isSpeaking = false; // Atualiza o estado
        document.getElementById('btn-leitura'); // Altera o texto do botão
    } else {
        // Se não estiver falando, inicia a leitura
        utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'pt-BR'; // Define o idioma como português
        utterance.volume = 1; // Volume (0 a 1)
        utterance.rate = 1; // Taxa de fala (0.1 a 10)
        utterance.pitch = 1; // Tonalidade (0 a 2)

        // A cada vez que a leitura parar, atualiza o estado
        utterance.onend = () => {
            isSpeaking = false; // Atualiza o estado
            document.getElementById('btn-leitura'); // Altera o texto do botão
        };

        window.speechSynthesis.speak(utterance); // Inicia a leitura
        isSpeaking = true; // Atualiza o estado
        document.getElementById('btn-leitura'); // Altera o texto do botão
    }
}