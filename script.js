 <script>
        document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const tarefaInput = document.getElementById('tarefa-input');
    const categoriaSelect = document.getElementById('categoria-select');
    const adicionarTarefaBtn = document.getElementById('adicionar-tarefa');
    const mensagemDiv = document.getElementById('mensagem');
    const contextMenu = document.getElementById('context-menu');
    const listas = {
        pendentes: document.getElementById('lista-tarefas'),
        concluidas: document.getElementById('lista-tarefas-concluidas'),
        importantes: document.getElementById('lista-tarefas-importantes'),
        urgentes: document.getElementById('lista-tarefas-urgentes'),
        hoje: document.getElementById('lista-tarefas-para-hoje'),
        semana: document.getElementById('lista-tarefas-para-semana'),
        mes: document.getElementById('lista-tarefas-para-mes'),
        ano: document.getElementById('lista-tarefas-para-ano')
    };

    let tarefaSelecionada = null;

    // Carregar tarefas do localStorage
    function carregarTarefas() {
        const tarefas = JSON.parse(localStorage.getItem('tarefas')) || {
            pendentes: [], concluidas: [], importantes: [], urgentes: [],
            hoje: [], semana: [], mes: [], ano: []
        };

        Object.keys(tarefas).forEach(categoria => {
            tarefas[categoria].forEach(texto => adicionarTarefaDOM(texto, categoria));
        });
    }

    // Salvar tarefas no localStorage
    function salvarTarefas() {
        const tarefas = {
            pendentes: [], concluidas: [], importantes: [], urgentes: [],
            hoje: [], semana: [], mes: [], ano: []
        };

        Object.keys(listas).forEach(categoria => {
            const itens = listas[categoria].querySelectorAll('li');
            itens.forEach(item => tarefas[categoria].push(item.textContent));
        });

        localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }

    // Mostrar mensagem
    function mostrarMensagem(texto, tipo) {
        mensagemDiv.textContent = texto;
        mensagemDiv.className = `mensagem ${tipo}`;
        mensagemDiv.style.display = 'block';
        setTimeout(() => {
            mensagemDiv.style.display = 'none';
        }, 3000);
    }

    // Adicionar tarefa ao DOM
    function adicionarTarefaDOM(texto, categoria) {
        const li = document.createElement('li');
        li.textContent = texto;
        if (categoria === 'concluidas') li.classList.add('concluida');
        if (categoria === 'importantes') li.classList.add('importante');
        if (categoria === 'urgentes') li.classList.add('urgente');
        listas[categoria].appendChild(li);
        salvarTarefas();
    }

    // Adicionar nova tarefa
    adicionarTarefaBtn.addEventListener('click', () => {
        const texto = tarefaInput.value.trim();
        const categoria = categoriaSelect.value;

        if (texto === '') {
            mostrarMensagem('Por favor, digite uma tarefa!', 'erro');
            return;
        }
        if (texto.length > 100) {
            mostrarMensagem('A tarefa deve ter no máximo 100 caracteres!', 'erro');
            return;
        }

        adicionarTarefaDOM(texto, categoria);
        mostrarMensagem(`Tarefa adicionada em ${categoriaSelect.options[categoriaSelect.selectedIndex].text}!`, 'sucesso');
        tarefaInput.value = '';
        categoriaSelect.value = 'pendentes'; // Resetar para pendentes
    });

    // Permitir adicionar tarefa com Enter
    tarefaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            adicionarTarefaBtn.click();
        }
    });

    // Mostrar menu de contexto
    document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName === 'LI') {
            e.preventDefault();
            tarefaSelecionada = e.target;
            const { clientX: x, clientY: y } = e;
            contextMenu.style.top = `${y}px`;
            contextMenu.style.left = `${x}px`;
            contextMenu.style.display = 'block';
        } else {
            contextMenu.style.display = 'none';
        }
    });

    // Esconder menu de contexto ao clicar fora
    document.addEventListener('click', () => {
        contextMenu.style.display = 'none';
    });

    // Ações do menu de contexto
    contextMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            const acao = e.target.dataset.action;
            const categoriaAtual = Object.keys(listas).find(categoria =>
                listas[categoria].contains(tarefaSelecionada)
            );

            if (acao === 'remover') {
                tarefaSelecionada.remove();
                mostrarMensagem('Tarefa removida com sucesso!', 'sucesso');
            } else {
                tarefaSelecionada.className = '';
                if (acao === 'concluida') tarefaSelecionada.classList.add('concluida');
                if (acao === 'importante') tarefaSelecionada.classList.add('importante');
                if (acao === 'urgente') tarefaSelecionada.classList.add('urgente');
                listas[acao].appendChild(tarefaSelecionada);
                mostrarMensagem(`Tarefa movida para ${acao}!`, 'sucesso');
            }
            salvarTarefas();
            contextMenu.style.display = 'none';
        }
    });

    // Carregar tarefas ao iniciar
    carregarTarefas();
});
    </script>
