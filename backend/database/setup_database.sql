-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS projeto_pi;
USE projeto_pi;

-- USUÁRIOS
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'professor', 'aluno') NOT NULL DEFAULT 'aluno',
    turma_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- TURMAS
-- ============================================
CREATE TABLE IF NOT EXISTS turmas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    professor_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (professor_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- MATERIAIS
-- ============================================
CREATE TABLE IF NOT EXISTS materiais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    semana INT NOT NULL,
    topico VARCHAR(255) NOT NULL,
    data DATE NOT NULL,
    link TEXT NOT NULL,
    tipo ENUM('slide', 'apostila', 'video', 'documento') NOT NULL DEFAULT 'slide',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_semana (semana),
    INDEX idx_tipo (tipo),
    INDEX idx_data (data)
);

-- ÁLBUNS
-- ============================================
CREATE TABLE IF NOT EXISTS albuns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    imagemUrl VARCHAR(500) NOT NULL,
    turma VARCHAR(100) NOT NULL,
    data VARCHAR(20) NOT NULL,
    tipo ENUM('foto', 'video', 'documento') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_turma (turma),
    INDEX idx_tipo (tipo)
);

-- QUIZZES
-- ============================================
CREATE TABLE IF NOT EXISTS quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    atividade_id INT,
    criado_por INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (criado_por) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_atividade (atividade_id),
    INDEX idx_criado_por (criado_por)
);

-- QUESTÕES DO QUIZ
-- ============================================
CREATE TABLE IF NOT EXISTS quiz_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    pergunta TEXT NOT NULL,
    tipo ENUM('multipla_escolha', 'verdadeiro_falso', 'dissertativa') NOT NULL,
    ordem INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    INDEX idx_quiz_id (quiz_id),
    INDEX idx_ordem (ordem)
);

-- OPÇÕES DAS QUESTÕES
-- ============================================
CREATE TABLE IF NOT EXISTS quiz_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    opcao TEXT NOT NULL,
    correta BOOLEAN NOT NULL DEFAULT FALSE,
    ordem INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE,
    INDEX idx_question_id (question_id),
    INDEX idx_ordem (ordem)
);

-- RESPOSTAS DOS USUÁRIOS
-- ============================================
CREATE TABLE IF NOT EXISTS quiz_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    quiz_id INT NOT NULL,
    question_id INT NOT NULL,
    option_id INT,
    resposta_texto TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES quiz_options(id) ON DELETE SET NULL,
    INDEX idx_user_quiz (user_id, quiz_id),
    INDEX idx_question (question_id)
);

-- INSERIR DADOS INICIAIS
-- ============================================
-- Usuários de teste
INSERT IGNORE INTO usuarios (nome, email, password, role) VALUES
('Admin Sistema', 'admin@teste.com', '$2b$06$K8nLW8QI7zQzV8wNjP1wOuD5s.rV9j2K4l3m5nP7qR8tS9uV0wX1y', 'admin'),
('Professor João', 'professor@teste.com', '$2b$06$K8nLW8QI7zQzV8wNjP1wOuD5s.rV9j2K4l3m5nP7qR8tS9uV0wX1y', 'professor'),
('Aluno Maria', 'aluno@teste.com', '$2b$06$K8nLW8QI7zQzV8wNjP1wOuD5s.rV9j2K4l3m5nP7qR8tS9uV0wX1y', 'aluno');

-- Turmas de exemplo
INSERT IGNORE INTO turmas (id, nome, professor_id) VALUES
(1, 'Turma A - Manhã', 2),
(2, 'Turma B - Tarde', 2),
(3, 'Turma C - Noite', 2);

-- Materiais de exemplo
INSERT IGNORE INTO materiais (titulo, semana, topico, data, link, tipo) VALUES
('Introdução ao Meio Ambiente', 1, 'Conceitos Básicos', '2024-01-15', 'http://bit.ly/4joMsd8', 'slide'),
('Poluição e Impactos Ambientais', 2, 'Problemas Ambientais', '2024-01-22', 'http://bit.ly/4jkNO8z', 'slide'),
('Sustentabilidade e Soluções', 3, 'Práticas Sustentáveis', '2024-01-29', 'http://bit.ly/4kLmN3p', 'slide'),
('Apostila Completa - Meio Ambiente', 1, 'Material de Apoio', '2024-01-15', 'http://bit.ly/44XtF53', 'apostila'),
('Vídeo Aula - Reciclagem', 2, 'Educação Ambiental', '2024-01-22', 'http://bit.ly/4mN5oP9', 'video');

-- Álbuns de exemplo
INSERT IGNORE INTO albuns (titulo, descricao, imagemUrl, turma, data, tipo) VALUES
('Visita ao Parque Ecológico', 'Fotos da excursão educativa ao parque', 'https://picsum.photos/300/200?random=1', 'Turma A', '2024-01-20', 'foto'),
('Projeto de Reciclagem', 'Documentação do projeto de coleta seletiva', 'https://picsum.photos/300/200?random=2', 'Turma B', '2024-01-25', 'documento'),
('Feira de Ciências', 'Apresentações dos alunos sobre sustentabilidade', 'https://picsum.photos/300/200?random=3', 'Turma A', '2024-02-01', 'foto'),
('Workshop de Compostagem', 'Vídeos do workshop prático de compostagem', 'https://picsum.photos/300/200?random=4', 'Turma C', '2024-02-05', 'video'),
('Horta Escolar', 'Fotos do desenvolvimento da horta escolar', 'https://picsum.photos/300/200?random=5', 'Turma B', '2024-02-10', 'foto');

-- CONFIRMAÇÃO DE SETUP
-- ============================================
SELECT 'Setup do banco de dados concluído com sucesso!' as status;
SELECT COUNT(*) as total_usuarios FROM usuarios;
SELECT COUNT(*) as total_materiais FROM materiais;
SELECT COUNT(*) as total_albuns FROM albuns; 