const API_URL = 'http://localhost:3000/api';
let token = localStorage.getItem('token');

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('Tentando login com:', { email }); // Debug

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        console.log('Status da resposta:', response.status); // Debug

        const data = await response.json();
        console.log('Resposta do servidor:', data); // Debug
        
        if (response.ok) {
            token = data.token;
            localStorage.setItem('token', token);
            showQuizSection();
            loadQuizzes();
        } else {
            console.error('Erro na resposta:', data); // Debug
            alert(data.message || 'Erro ao fazer login');
        }
    } catch (error) {
        console.error('Erro completo:', error);
        alert('Erro ao fazer login. Verifique o console para mais detalhes.');
    }
});

// Carregar Quizzes
async function loadQuizzes() {
    try {
        const response = await fetch(`${API_URL}/quiz`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token');
                location.reload();
                return;
            }
            throw new Error('Erro ao carregar quizzes');
        }

        const quizzes = await response.json();
        displayQuizzes(quizzes);
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar quizzes');
    }
}

// Exibir lista de quizzes
function displayQuizzes(quizzes) {
    const quizList = document.getElementById('quizList');
    quizList.innerHTML = quizzes.map(quiz => `
        <div class="quiz-card">
            <h3>${quiz.titulo}</h3>
            <p>Tipo: ${quiz.tipo}</p>
            <button onclick="startQuiz(${quiz.id})">Iniciar Quiz</button>
        </div>
    `).join('');
}

// Iniciar quiz específico
async function startQuiz(quizId) {
    try {
        const response = await fetch(`${API_URL}/quiz/${quizId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Erro ao carregar quiz');

        const quiz = await response.json();
        displayQuizQuestion(quiz);
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao iniciar quiz');
    }
}

// Exibir pergunta do quiz
function displayQuizQuestion(quiz) {
    document.getElementById('quizList').classList.add('hidden');
    const activeQuiz = document.getElementById('activeQuiz');
    activeQuiz.classList.remove('hidden');

    document.getElementById('quizTitle').textContent = quiz.titulo;
    
    if (quiz.perguntas && quiz.perguntas.length > 0) {
        const pergunta = quiz.perguntas[0];
        document.getElementById('questionText').textContent = pergunta.texto;
        
        const optionsContainer = document.getElementById('options');
        optionsContainer.innerHTML = pergunta.opcoes.map((option, index) => `
            <div class="option" onclick="selectOption(this)" data-id="${option.id}">
                ${option.texto}
            </div>
        `).join('');
    }
}

// Selecionar opção
function selectOption(optionElement) {
    // Remove seleção anterior
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    // Adiciona seleção à opção clicada
    optionElement.classList.add('selected');
}

// Voltar para lista de quizzes
function showQuizList() {
    document.getElementById('activeQuiz').classList.add('hidden');
    document.getElementById('quizList').classList.remove('hidden');
}

// Mostrar seção de quizzes
function showQuizSection() {
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('quizSection').classList.remove('hidden');
}

// Verificar se já está logado ao carregar a página
if (token) {
    showQuizSection();
    loadQuizzes();
}