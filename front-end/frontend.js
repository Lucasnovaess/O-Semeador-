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


            document.querySelector('#editar-texto').addEventListener('click', () => {
                const textosEditaveis = Array.from(document.querySelectorAll('.titulo, .paragrafo, .sub-titulo'));
                textosEditaveis.forEach(texto => {
                    texto.contentEditable = texto.isContentEditable ? false : true; // Alterna entre editável e não editável
                });
            });
        }
        catch (error) {
            //daqui a pouco fazemos o tratamento de coisas ruins, ou seja, especificamos o fluxo alternativo de execução
        }
    }
    else {
        exibirAlerta('.alert-modal-login', 'Preencha todos os campos', ['show',
            'alert-danger'], ['d-none', 'alert-success'], 2000)
    }
}


const buscarTextos = async () => {
    const cadastroEndpoint = '/textos-puxar'
    const URLCompleta = `${protocolo}${baseURL}${cadastroEndpoint}`
    try {
        const response = await axios.get(URLCompleta);
        const textos = response.data;

        textos.forEach((texto, index) => {
            const row = document.querySelector(`#texto-principal-${index + 1}`); // Supondo que você tenha rows com IDs como row1, row2, etc.
            row.setAttribute('data-id', texto._id);
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
        });
    } catch (error) {
        console.error('Erro ao buscar textos:', error);
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
                                <button class="btn btn-primary d-none btn-adicionar-imagem" data-bs-toggle="modal" data-bs-target="#parceiroModal">Parceiro Imagem</button>
                                <button class="btn btn-danger d-none btn-remover-imagem" onclick="removerParceiro('${parceiro._id}')">Parceiro Imagem</button>
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
const parceiroIndex = 3;
function adicionarParceiroporArquivo() {
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
        const novaParceiroDiv = document.createElement('div');
        novoParceiroDiv.className = 'parceiro';

        novoParceiroDiv.innerHTML = `
            <img src="${imagemURL}" class="d-block w-100" alt="Imagem ${parceiroIndex + 1}">
            <button class="btn btn-primary d-none btn-adicionar-parceiro" data-bs-toggle="modal" data-bs-target="#parceiroModal"">Adicionar Parceiro</button>
            <button class="btn btn-danger d-none btn-remover-parceiro" onclick="removerParceiro()">Remover Parceiro</button>
        `;

        carouselInner.appendChild(novoParceiroDiv);
        parceiroIndex++;

        // Enviar a nova imagem para o banco de dados
        try {
            await fetch('http://localhost:3000/parceiros-adicionar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ src: imagemURL })
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

const salvarAlteracoes = async () => {
    const atualizarEndpoint = '/textos-atualizar'
    const URLCompleta = `${protocolo}${baseURL}${atualizarEndpoint}`
    try {
        const textos = Array.from(document.querySelectorAll('.row')).map((row) => {
            const tituloElement = row.querySelector('.titulo');
            const subtituloElement = row.querySelector('.sub-titulo');
            const paragrafoElement = row.querySelector('.paragrafo');
            const id = row.getAttribute('data-id');

            return {
                id,
                titulo: tituloElement ? tituloElement.innerText : '',
                subtitulo: subtituloElement ? subtituloElement.innerText : '',
                conteudo: paragrafoElement ? paragrafoElement.innerText : '',
            };
        });

        await Promise.all(textos.map(texto =>
            axios.put(URLCompleta, texto) // Agora o id vai no corpo da requisição
        ));

        console.log('Textos atualizados com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar textos:', error);
    }
};

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