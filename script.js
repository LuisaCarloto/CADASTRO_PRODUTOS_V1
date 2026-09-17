class Produto {
    #preco
    #quantidade

    constructor(nome, preco, quantidade) {                                 //MASSSSSS tmb pode ser assim
        // if (nome == "" || preco <= 0 || quantidade <= 0){
        //throw new Error ("Valor invalido!"); }

        if (nome == "") {
            throw new Error("O nome não pode estar em branco!")
        }

        if (preco <= 0) {
            throw new Error("O preço deve ser maior que zero!")
        }

        if (quantidade <= 0) {
            throw new Error("A quantidade deve ser maior que zero!")
        }

        this.nome = nome;
        this.#preco = parseFloat(preco);
        this.#quantidade = parseInt(quantidade);
    }

    get preco() {
        return this.#preco;
    }

    get quantidade() {
        return this.#quantidade
    }

    calcularSubtotal() {
        return this.#preco * this.#quantidade;
    }
}

// ***********************
// FASE 2: GERENCIAMENTO DE ESTADO (Memória)
// ***********************

// Array global que guardará todas as instâncias da classe Produto
const listaDeProdutos = [];

// ***********************
// FASE 3: ESCUTA DE EVENTOS DO DOM
// ***********************

// Selecionamos o formulário do HTML pelo ID
const formProduto = document.getElementById("produto-form");

// Adicionamos um escutador de eventos para quando o formulário for enviado (submit)
formProduto.addEventListener("submit", function (event) {

    // Impede que a página recarregue ao enviar o formulário
    event.preventDefault();

    // 1. Captura os valores digitados nos campos de input do HTML
    const nomeInput = document.getElementById("nome").value;
    const precoInput = document.getElementById("preco").value;
    const quantidadeInput = document.getElementById("quantidade").value;
    try {
        // 2. Cria uma nova instância da classe Produto
        const novoProduto = new Produto(nomeInput, precoInput, quantidadeInput);

        // 3. Adiciona o novo produto no Array em memória
        listaDeProdutos.push(novoProduto);

        // 4. Atualiza e exibe a tabela e o total, depois limpa o formulário
        renderizarTabela();
        atualizarTotalEstoque();
        formProduto.reset();

    } catch (erro) {
        // Se der erro, mostra a mensagem sem travar a aplicação
        alert(erro.message);
    }

});
// ***********************
// FASE 4: RENDERIZAÇÃO DA INTERFACE (DOM)
// ***********************

// Função responsável por desenhar na tela o estado atual do Array listaDeProdutos
function renderizarTabela() {

    // Seleciona o corpo da tabela (tbody)
    const tabelaBody = document.querySelector("#tabela-produtos tbody");

    // Limpa o conteúdo anterior da tabela para evitar duplicações
    tabelaBody.innerHTML = "";

    // Percorre o Array de produtos usando forEach
    listaDeProdutos.forEach((produto, index) => {

        // Cria um elemento <tr> (linha da tabela)
        const linha = document.createElement("tr");

        // Preenche o conteúdo interno da linha com os dados do objeto
        linha.innerHTML = `
            <td>${produto.nome}</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
            <td>${produto.quantidade}</td>
            <td>R$ ${produto.calcularSubtotal().toFixed(2)}</td>
            <td>
                <button class="btn-remover" onclick="removerProduto(${index})">Remover</button>
            </td>
        `;

        // Insere a linha criada dentro do tbody
        tabelaBody.appendChild(linha);
    });
}

// Função responsável por somar os subtotais de todos os produtos
function atualizarTotalEstoque() {

    // O reduce percorre o array e soma o subtotal de cada produto
    const total = listaDeProdutos.reduce((soma, produto) => {
        return soma + produto.calcularSubtotal();
    }, 0);

    // Seleciona o elemento h3 que mostrará o total
    const elementoTotal = document.getElementById("total-estoque");

    // Atualiza o texto do h3 com o total formatado em moeda brasileira
    elementoTotal.textContent = `Total em estoque: R$ ${total.toFixed(2).replace(".", ",")}`;
}

// Função responsável por remover um produto pela posição no array
function removerProduto(index) {

    // Remove 1 produto a partir do índice informado
    listaDeProdutos.splice(index, 1);

    // Atualiza a tabela depois da remoção
    renderizarTabela();

    // Atualiza o total do estoque depois da remoção
    atualizarTotalEstoque();
}

// Seleciona o botão de limpar a tabela pelo ID
const botaoLimpar = document.getElementById("limpar-tabela");

// Adiciona um evento de clique no botão
botaoLimpar.addEventListener("click", function () {

    // Esvazia completamente o array de produtos
    listaDeProdutos.length = 0;

    // Atualiza a tabela, que ficará vazia
    renderizarTabela();

    // Atualiza o total, que voltará para R$ 0,00
    atualizarTotalEstoque();
});
