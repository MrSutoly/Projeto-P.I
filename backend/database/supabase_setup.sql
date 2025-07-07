-- Script para configurar as tabelas no Supabase
-- Baseado no esquema atual do projeto

-- USUÁRIOS
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'aluno' CHECK (role IN ('admin', 'professor', 'aluno')),
    turma_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TURMAS
-- ============================================
CREATE TABLE IF NOT EXISTS turmas (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    codigo VARCHAR(255) UNIQUE NOT NULL,
    professor_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    pontos INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar foreign key para turma_id em usuarios
ALTER TABLE usuarios ADD CONSTRAINT IF NOT EXISTS fk_usuarios_turma 
    FOREIGN KEY (turma_id) REFERENCES turmas(id);

-- MATERIAIS
-- ============================================
CREATE TABLE IF NOT EXISTS materiais (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    semana INTEGER NOT NULL,
    topico VARCHAR(255) NOT NULL,
    data DATE NOT NULL,
    link TEXT NOT NULL,
    tipo VARCHAR(20) NOT NULL DEFAULT 'slide' CHECK (tipo IN ('slide', 'apostila', 'video', 'documento')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ÁLBUNS
-- ============================================
CREATE TABLE IF NOT EXISTS albuns (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    imagemUrl VARCHAR(500) NOT NULL,
    turma VARCHAR(100) NOT NULL,
    data VARCHAR(20) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('foto', 'video', 'documento')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ATIVIDADES
-- ============================================
CREATE TABLE IF NOT EXISTS atividades (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('quiz', 'texto', 'imagem')),
    ordem INTEGER NOT NULL,
    data DATE NOT NULL,
    horario TIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'bloqueada' CHECK (status IN ('bloqueada', 'disponivel', 'concluida')),
    pontos INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- QUIZZES
-- ============================================
CREATE TABLE IF NOT EXISTS quizzes (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('kahoot', 'clicar_objeto')),
    pontos INTEGER NOT NULL DEFAULT 0,
    atividade_id INTEGER REFERENCES atividades(id) ON DELETE SET NULL,
    criado_por INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- QUESTÕES DO QUIZ
-- ============================================
CREATE TABLE IF NOT EXISTS quiz_questions (
    id BIGSERIAL PRIMARY KEY,
    quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    pergunta TEXT NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('multipla_escolha', 'verdadeiro_falso', 'dissertativa')),
    ordem INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- OPÇÕES DAS QUESTÕES
-- ============================================
CREATE TABLE IF NOT EXISTS quiz_options (
    id BIGSERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    opcao TEXT NOT NULL,
    correta BOOLEAN NOT NULL DEFAULT FALSE,
    ordem INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RESPOSTAS DOS USUÁRIOS
-- ============================================
CREATE TABLE IF NOT EXISTS quiz_responses (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    option_id INTEGER REFERENCES quiz_options(id) ON DELETE SET NULL,
    resposta_texto TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SESSÕES DE QUIZ
-- ============================================
CREATE TABLE IF NOT EXISTS quiz_sessions (
    id BIGSERIAL PRIMARY KEY,
    quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    professor_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    turma_id INTEGER NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'aguardando' CHECK (status IN ('aguardando', 'em_andamento', 'finalizado')),
    pergunta_atual INTEGER NOT NULL DEFAULT 0,
    codigo_acesso VARCHAR(255) UNIQUE NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ALUNOS CONECTADOS
-- ============================================
CREATE TABLE IF NOT EXISTS connected_students (
    id BIGSERIAL PRIMARY KEY,
    sessao_id INTEGER NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
    aluno_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'conectado' CHECK (status IN ('conectado', 'desconectado')),
    conectado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RESPOSTAS DOS ALUNOS
-- ============================================
CREATE TABLE IF NOT EXISTS student_answers (
    id BIGSERIAL PRIMARY KEY,
    sessao_id INTEGER NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
    aluno_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    pergunta_id INTEGER NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    resposta_id INTEGER NOT NULL REFERENCES quiz_options(id) ON DELETE CASCADE,
    tempo_resposta INTEGER,
    respondido_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RANKING ALUNOS
-- ============================================
CREATE TABLE IF NOT EXISTS ranking_alunos (
    id BIGSERIAL PRIMARY KEY,
    aluno_id INTEGER NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    turma_id INTEGER NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
    pontuacao_total INTEGER NOT NULL DEFAULT 0,
    quizzes_realizados INTEGER NOT NULL DEFAULT 0,
    media NUMERIC NOT NULL DEFAULT 0.0,
    posicao INTEGER,
    ultima_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RANKING TURMAS
-- ============================================
CREATE TABLE IF NOT EXISTS ranking_turmas (
    id BIGSERIAL PRIMARY KEY,
    turma_id INTEGER NOT NULL UNIQUE REFERENCES turmas(id) ON DELETE CASCADE,
    media_geral NUMERIC NOT NULL DEFAULT 0.0,
    total_quizzes INTEGER NOT NULL DEFAULT 0,
    pontuacao_total INTEGER NOT NULL DEFAULT 0,
    posicao INTEGER,
    ultima_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RECYCLING ENTRIES
-- ============================================
CREATE TABLE IF NOT EXISTS recycling_entries (
    id BIGSERIAL PRIMARY KEY,
    turma_id INTEGER NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
    professor_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    pontos INTEGER NOT NULL DEFAULT 0,
    motivo VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PERGUNTAS (para atividades)
-- ============================================
CREATE TABLE IF NOT EXISTS perguntas (
    id BIGSERIAL PRIMARY KEY,
    atividade_id INTEGER NOT NULL REFERENCES atividades(id) ON DELETE CASCADE,
    texto TEXT NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('multipla_escolha', 'verdadeiro_falso', 'dissertativa')),
    ordem INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- OPÇÕES (para perguntas de atividades)
-- ============================================
CREATE TABLE IF NOT EXISTS opcoes (
    id BIGSERIAL PRIMARY KEY,
    pergunta_id INTEGER NOT NULL REFERENCES perguntas(id) ON DELETE CASCADE,
    texto TEXT NOT NULL,
    correta BOOLEAN NOT NULL DEFAULT FALSE,
    ordem INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_role ON usuarios(role);
CREATE INDEX IF NOT EXISTS idx_usuarios_turma_id ON usuarios(turma_id);

CREATE INDEX IF NOT EXISTS idx_turmas_codigo ON turmas(codigo);
CREATE INDEX IF NOT EXISTS idx_turmas_professor_id ON turmas(professor_id);

CREATE INDEX IF NOT EXISTS idx_materiais_semana ON materiais(semana);
CREATE INDEX IF NOT EXISTS idx_materiais_tipo ON materiais(tipo);
CREATE INDEX IF NOT EXISTS idx_materiais_data ON materiais(data);

CREATE INDEX IF NOT EXISTS idx_albuns_turma ON albuns(turma);
CREATE INDEX IF NOT EXISTS idx_albuns_tipo ON albuns(tipo);

CREATE INDEX IF NOT EXISTS idx_quizzes_atividade_id ON quizzes(atividade_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_criado_por ON quizzes(criado_por);

CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_ordem ON quiz_questions(ordem);

CREATE INDEX IF NOT EXISTS idx_quiz_options_question_id ON quiz_options(question_id);
CREATE INDEX IF NOT EXISTS idx_quiz_options_ordem ON quiz_options(ordem);

CREATE INDEX IF NOT EXISTS idx_quiz_responses_user_quiz ON quiz_responses(user_id, quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_question ON quiz_responses(question_id);

CREATE INDEX IF NOT EXISTS idx_quiz_sessions_professor_id ON quiz_sessions(professor_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_turma_id ON quiz_sessions(turma_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_codigo_acesso ON quiz_sessions(codigo_acesso);

CREATE INDEX IF NOT EXISTS idx_connected_students_sessao_id ON connected_students(sessao_id);
CREATE INDEX IF NOT EXISTS idx_connected_students_aluno_id ON connected_students(aluno_id);

CREATE INDEX IF NOT EXISTS idx_student_answers_sessao_id ON student_answers(sessao_id);
CREATE INDEX IF NOT EXISTS idx_student_answers_aluno_id ON student_answers(aluno_id);

CREATE INDEX IF NOT EXISTS idx_ranking_alunos_turma_id ON ranking_alunos(turma_id);
CREATE INDEX IF NOT EXISTS idx_ranking_alunos_posicao ON ranking_alunos(posicao);

CREATE INDEX IF NOT EXISTS idx_ranking_turmas_posicao ON ranking_turmas(posicao);

CREATE INDEX IF NOT EXISTS idx_recycling_entries_turma_id ON recycling_entries(turma_id);
CREATE INDEX IF NOT EXISTS idx_recycling_entries_professor_id ON recycling_entries(professor_id);

-- Habilitar Row Level Security (RLS)
-- ============================================
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE turmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE materiais ENABLE ROW LEVEL SECURITY;
ALTER TABLE albuns ENABLE ROW LEVEL SECURITY;
ALTER TABLE atividades ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE connected_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranking_alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranking_turmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE recycling_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE perguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE opcoes ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança básicas
-- ============================================
-- Usuários
CREATE POLICY "Usuários podem ler todos os usuários" ON usuarios FOR SELECT USING (true);
CREATE POLICY "Usuários podem inserir seus próprios dados" ON usuarios FOR INSERT WITH CHECK (true);
CREATE POLICY "Usuários podem atualizar seus próprios dados" ON usuarios FOR UPDATE USING (true);

-- Turmas
CREATE POLICY "Todos podem ler turmas" ON turmas FOR SELECT USING (true);
CREATE POLICY "Professores podem gerenciar turmas" ON turmas FOR ALL USING (true);

-- Materiais
CREATE POLICY "Todos podem ler materiais" ON materiais FOR SELECT USING (true);
CREATE POLICY "Professores podem gerenciar materiais" ON materiais FOR ALL USING (true);

-- Álbuns
CREATE POLICY "Todos podem ler álbuns" ON albuns FOR SELECT USING (true);
CREATE POLICY "Professores podem gerenciar álbuns" ON albuns FOR ALL USING (true);

-- Atividades
CREATE POLICY "Todos podem ler atividades" ON atividades FOR SELECT USING (true);
CREATE POLICY "Professores podem gerenciar atividades" ON atividades FOR ALL USING (true);

-- Quizzes
CREATE POLICY "Todos podem ler quizzes" ON quizzes FOR SELECT USING (true);
CREATE POLICY "Professores podem gerenciar quizzes" ON quizzes FOR ALL USING (true);

-- Questões
CREATE POLICY "Todos podem ler questões" ON quiz_questions FOR SELECT USING (true);
CREATE POLICY "Professores podem gerenciar questões" ON quiz_questions FOR ALL USING (true);

-- Opções
CREATE POLICY "Todos podem ler opções" ON quiz_options FOR SELECT USING (true);
CREATE POLICY "Professores podem gerenciar opções" ON quiz_options FOR ALL USING (true);

-- Respostas
CREATE POLICY "Usuários podem ler suas próprias respostas" ON quiz_responses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem inserir suas próprias respostas" ON quiz_responses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar suas próprias respostas" ON quiz_responses FOR UPDATE USING (auth.uid() = user_id);

-- Sessões
CREATE POLICY "Todos podem ler sessões" ON quiz_sessions FOR SELECT USING (true);
CREATE POLICY "Professores podem gerenciar sessões" ON quiz_sessions FOR ALL USING (true);

-- Alunos conectados
CREATE POLICY "Todos podem ler alunos conectados" ON connected_students FOR SELECT USING (true);
CREATE POLICY "Usuários podem gerenciar suas próprias conexões" ON connected_students FOR ALL USING (auth.uid() = aluno_id);

-- Respostas dos alunos
CREATE POLICY "Usuários podem ler suas próprias respostas" ON student_answers FOR SELECT USING (auth.uid() = aluno_id);
CREATE POLICY "Usuários podem inserir suas próprias respostas" ON student_answers FOR INSERT WITH CHECK (auth.uid() = aluno_id);

-- Ranking
CREATE POLICY "Todos podem ler ranking" ON ranking_alunos FOR SELECT USING (true);
CREATE POLICY "Todos podem ler ranking de turmas" ON ranking_turmas FOR SELECT USING (true);

-- Recycling
CREATE POLICY "Todos podem ler recycling" ON recycling_entries FOR SELECT USING (true);
CREATE POLICY "Professores podem inserir recycling" ON recycling_entries FOR INSERT WITH CHECK (true);

-- Perguntas e opções
CREATE POLICY "Todos podem ler perguntas" ON perguntas FOR SELECT USING (true);
CREATE POLICY "Professores podem gerenciar perguntas" ON perguntas FOR ALL USING (true);
CREATE POLICY "Todos podem ler opções" ON opcoes FOR SELECT USING (true);
CREATE POLICY "Professores podem gerenciar opções" ON opcoes FOR ALL USING (true);

-- Inserir dados iniciais
-- ============================================
-- Usuários de teste (senha: 123456)
INSERT INTO usuarios (nome, email, password, role) VALUES
('Admin Sistema', 'admin@teste.com', '$2b$06$K8nLW8QI7zQzV8wNjP1wOuD5s.rV9j2K4l3m5nP7qR8tS9uV0wX1y', 'admin'),
('Professor João', 'professor@teste.com', '$2b$06$K8nLW8QI7zQzV8wNjP1wOuD5s.rV9j2K4l3m5nP7qR8tS9uV0wX1y', 'professor'),
('Aluno Maria', 'aluno@teste.com', '$2b$06$K8nLW8QI7zQzV8wNjP1wOuD5s.rV9j2K4l3m5nP7qR8tS9uV0wX1y', 'aluno')
ON CONFLICT (email) DO NOTHING;

-- Turmas de exemplo
INSERT INTO turmas (nome, codigo, professor_id) VALUES
('Turma A - Manhã', 'TURMA001', 2),
('Turma B - Tarde', 'TURMA002', 2),
('Turma C - Noite', 'TURMA003', 2)
ON CONFLICT (codigo) DO NOTHING;

-- Materiais de exemplo
INSERT INTO materiais (titulo, semana, topico, data, link, tipo) VALUES
('Introdução ao Meio Ambiente', 1, 'Conceitos Básicos', '2024-01-15', 'http://bit.ly/4joMsd8', 'slide'),
('Poluição e Impactos Ambientais', 2, 'Problemas Ambientais', '2024-01-22', 'http://bit.ly/4jkNO8z', 'slide'),
('Sustentabilidade e Soluções', 3, 'Práticas Sustentáveis', '2024-01-29', 'http://bit.ly/4kLmN3p', 'slide'),
('Apostila Completa - Meio Ambiente', 1, 'Material de Apoio', '2024-01-15', 'http://bit.ly/44XtF53', 'apostila'),
('Vídeo Aula - Reciclagem', 2, 'Educação Ambiental', '2024-01-22', 'http://bit.ly/4mN5oP9', 'video')
ON CONFLICT DO NOTHING;

-- Álbuns de exemplo
INSERT INTO albuns (titulo, descricao, imagemUrl, turma, data, tipo) VALUES
('Visita ao Parque Ecológico', 'Fotos da excursão educativa ao parque', 'https://picsum.photos/300/200?random=1', 'Turma A', '2024-01-20', 'foto'),
('Projeto de Reciclagem', 'Documentação do projeto de coleta seletiva', 'https://picsum.photos/300/200?random=2', 'Turma B', '2024-01-25', 'documento'),
('Feira de Ciências', 'Apresentações dos alunos sobre sustentabilidade', 'https://picsum.photos/300/200?random=3', 'Turma A', '2024-02-01', 'foto'),
('Workshop de Compostagem', 'Vídeos do workshop prático de compostagem', 'https://picsum.photos/300/200?random=4', 'Turma C', '2024-02-05', 'video'),
('Horta Escolar', 'Fotos do desenvolvimento da horta escolar', 'https://picsum.photos/300/200?random=5', 'Turma B', '2024-02-10', 'foto')
ON CONFLICT DO NOTHING; 