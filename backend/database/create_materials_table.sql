-- Criar tabela de materiais
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
    INDEX idx_tipo (tipo)
);

-- Inserir alguns dados de exemplo (esses links funcionam)
INSERT INTO materiais (titulo, semana, topico, data, link, tipo) VALUES
('Slides - Semana 1', 1, 'Introdução ao Meio Ambiente', '2024-01-15', 'http://bit.ly/4joMsd8', 'slide'),
('Slides - Semana 2', 2, 'Poluição e Resíduos', '2024-01-22', 'http://bit.ly/4jkNO8z', 'slide'),
('Apostila Completa', 1, 'Material de Apoio', '2024-01-15', 'http://bit.ly/44XtF53', 'apostila'); 