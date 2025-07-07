const axios = require('axios');

const BASE_URL = 'http://localhost:3333/api';

// Dados de teste
const testQuiz = {
    titulo: "Quiz sobre Meio Ambiente - Teste",
    tipo: "kahoot",
    pontos: 100,
    atividade_id: 1,
    perguntas: [
        {
            texto: "Qual é a principal causa do aquecimento global?",
            opcoes: [
                { texto: "Desmatamento", correta: false },
                { texto: "Emissão de gases do efeito estufa", correta: true },
                { texto: "Poluição da água", correta: false },
                { texto: "Lixo urbano", correta: false }
            ]
        },
        {
            texto: "O que é reciclagem?",
            opcoes: [
                { texto: "Processo de transformação de materiais", correta: true },
                { texto: "Queima de lixo", correta: false },
                { texto: "Enterro de resíduos", correta: false }
            ]
        }
    ]
};

// Função para fazer login
async function login(email, password) {
    try {
        const response = await axios.post(`${BASE_URL}/login`, {
            email,
            password
        });
        return response.data.token;
    } catch (error) {
        console.error('Erro no login:', error.response?.data || error.message);
        return null;
    }
}

// Função para testar criação de quiz
async function testCreateQuiz(token) {
    try {
        const response = await axios.post(`${BASE_URL}/quiz`, testQuiz, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('✅ Quiz criado com sucesso:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Erro ao criar quiz:', error.response?.data || error.message);
        return null;
    }
}

// Função para testar listagem de quizzes
async function testListQuizzes() {
    try {
        const response = await axios.get(`${BASE_URL}/quiz`);
        console.log('✅ Quizzes listados com sucesso:', response.data.length, 'quizzes encontrados');
        return response.data;
    } catch (error) {
        console.error('❌ Erro ao listar quizzes:', error.response?.data || error.message);
        return null;
    }
}

// Função para testar busca de quiz por ID
async function testGetQuizById(quizId) {
    try {
        const response = await axios.get(`${BASE_URL}/quiz/${quizId}`);
        console.log('✅ Quiz encontrado:', response.data.titulo);
        console.log('   Perguntas:', response.data.perguntas?.length || 0);
        return response.data;
    } catch (error) {
        console.error('❌ Erro ao buscar quiz:', error.response?.data || error.message);
        return null;
    }
}

// Função para testar submissão de resposta
async function testSubmitResponse(token, quizId, questionId, optionId) {
    try {
        const response = await axios.post(`${BASE_URL}/quiz/response`, {
            quizId,
            questionId,
            optionId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('✅ Resposta submetida com sucesso:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Erro ao submeter resposta:', error.response?.data || error.message);
        return null;
    }
}

// Função para testar resultados do quiz
async function testGetQuizResults(token, quizId) {
    try {
        const response = await axios.get(`${BASE_URL}/quiz/${quizId}/results`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('✅ Resultados obtidos:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Erro ao obter resultados:', error.response?.data || error.message);
        return null;
    }
}

// Função para testar estatísticas do quiz
async function testGetQuizStatistics(token, quizId) {
    try {
        const response = await axios.get(`${BASE_URL}/quiz/${quizId}/statistics`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('✅ Estatísticas obtidas:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Erro ao obter estatísticas:', error.response?.data || error.message);
        return null;
    }
}

// Função principal de teste
async function runTests() {
    console.log('🧪 Iniciando testes do sistema de quiz...\n');

    // Login como professor
    console.log('1. Fazendo login como professor...');
    const professorToken = await login('professor@teste.com', '123456');
    if (!professorToken) {
        console.error('❌ Falha no login do professor. Testes cancelados.');
        return;
    }
    console.log('✅ Login do professor realizado com sucesso\n');

    // Criar quiz
    console.log('2. Criando quiz...');
    const createdQuiz = await testCreateQuiz(professorToken);
    if (!createdQuiz) {
        console.error('❌ Falha na criação do quiz. Testes cancelados.');
        return;
    }
    console.log('');

    // Listar quizzes
    console.log('3. Listando quizzes...');
    await testListQuizzes();
    console.log('');

    // Buscar quiz por ID
    console.log('4. Buscando quiz por ID...');
    const fullQuiz = await testGetQuizById(createdQuiz.id);
    if (!fullQuiz) {
        console.error('❌ Falha ao buscar quiz. Testes cancelados.');
        return;
    }
    console.log('');

    // Login como aluno
    console.log('5. Fazendo login como aluno...');
    const studentToken = await login('aluno@teste.com', '123456');
    if (!studentToken) {
        console.error('❌ Falha no login do aluno. Continuando com testes do professor...');
    } else {
        console.log('✅ Login do aluno realizado com sucesso\n');

        // Submeter respostas
        if (fullQuiz.perguntas && fullQuiz.perguntas.length > 0) {
            console.log('6. Submetendo respostas...');
            
            // Responder primeira pergunta
            const firstQuestion = fullQuiz.perguntas[0];
            const firstCorrectOption = firstQuestion.opcoes?.find(o => o.correta);
            if (firstCorrectOption) {
                await testSubmitResponse(studentToken, createdQuiz.id, firstQuestion.id, firstCorrectOption.id);
            }

            // Responder segunda pergunta
            if (fullQuiz.perguntas.length > 1) {
                const secondQuestion = fullQuiz.perguntas[1];
                const secondCorrectOption = secondQuestion.opcoes?.find(o => o.correta);
                if (secondCorrectOption) {
                    await testSubmitResponse(studentToken, createdQuiz.id, secondQuestion.id, secondCorrectOption.id);
                }
            }
            console.log('');

            // Obter resultados
            console.log('7. Obtendo resultados do aluno...');
            await testGetQuizResults(studentToken, createdQuiz.id);
            console.log('');
        }
    }

    // Obter estatísticas (professor)
    console.log('8. Obtendo estatísticas do quiz...');
    await testGetQuizStatistics(professorToken, createdQuiz.id);
    console.log('');

    console.log('🎉 Testes finalizados!');
}

// Executar testes
runTests().catch(console.error); 