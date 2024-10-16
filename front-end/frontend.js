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
            const adicionarButton = document.querySelector('#adicionar-imagem');
            const removerButton = document.querySelector('#remover-imagem');
            const editarTexto = document.querySelector('#editar-texto');
            adicionarButton.classList.remove('d-none');
            removerButton.classList.remove('d-none');
            editarTexto.classList.remove('d-none');
            salvar.classList.remove('d-none');

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

            const tituloElement = row.querySelector('#titulo');
            const subtituloElement = row.querySelector('#subtitulo');
            const paragrafoElement = row.querySelector('#paragrafo');

            if (tituloElement) {
                tituloElement.setAttribute('data-id', texto._id); // Armazena o ID
                tituloElement.innerText = texto.titulo;
            }

            if (subtituloElement) {
                subtituloElement.innerText = texto.subtitulo || ''; // Se não houver subtítulo, exibe vazio
            }

            if (paragrafoElement) {
                paragrafoElement.innerText = texto.conteudo;
            }
        });
    } catch (error) {
        console.error('Erro ao buscar textos:', error);
    }
};


// Chame a função após o login ou na inicialização da página



//fora de qualquer outra função, pode ser no final, depois de todas
//fora de qualquer outra função, pode ser no final, depois de todas
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
// const salvarAlteracoes = async () => {
//     // if (alternarEdicao() == false) return; // Verifica se a edição está ativada

//     const dadosParaSalvar = []; // Array para armazenar os dados

//     // Percorre todos os textos
//     for (let i = 0; i < textos.length; i++) {
//         const titulo = document.querySelector(`#titulo${i + 1}`).innerText; // Título editado
//         const subtitulo = document.querySelector(`#subtitulo${i + 1}`).innerText; // Subtítulo editado
//         const conteudo = document.querySelector(`#paragrafo${i + 1}`).innerText; // Conteúdo editado

//         // Adiciona os dados ao array
//         dadosParaSalvar.push({ titulo, subtitulo, conteudo });
//     }

//     try {
//         await axios.put('/textos-atualizar', dadosParaSalvar); // Envia os dados para o backend
//         console.log('Textos salvos com sucesso');
//     } catch (error) {
//         console.error('Erro ao salvar textos:', error);
//     } finally {
//         // Desativa a edição
//         textos.forEach(texto => {
//             texto.contentEditable = false; // Desativa a edição
//         });
//         document.querySelector('#salvarAlteracoes').style.display = 'none'; // Esconde o botão de salvar
//         edicaoAtivada = false; // Marca que a edição não está mais ativada
//     }
// };

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