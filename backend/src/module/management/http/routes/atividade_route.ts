import { Router } from 'express';
import { container } from 'tsyringe';
import { AtividadeController } from '../controller/atividade_controller';
import { ensureAuthenticated } from '../../../auth/middleware/ensure_authenticated';
import { ensureTeacher } from '../../../auth/middleware/ensure_teacher';

const atividadeRouter = Router();
const atividadeController = container.resolve(AtividadeController);

// Rotas protegidas - todas precisam de autenticação
atividadeRouter.use(ensureAuthenticated);

// Rotas públicas (para alunos visualizarem)
atividadeRouter.get('/atividades', (req, res) => 
  atividadeController.getAllAtividades(req, res)
);

atividadeRouter.get('/atividades/status', (req, res) =>
  atividadeController.getAtividadesByStatus(req, res)
);

atividadeRouter.get('/atividades/:id', (req, res) => 
  atividadeController.getAtividadeById(req, res)
);

atividadeRouter.get('/atividades/:id/completa', (req, res) =>
  atividadeController.getAtividadeCompleta(req, res)
);

// Rotas protegidas (apenas professores e admins)
atividadeRouter.post('/atividades', ensureTeacher, (req, res) => 
  atividadeController.createAtividade(req, res)
);

atividadeRouter.put('/atividades/:id', ensureTeacher, (req, res) => 
  atividadeController.updateAtividade(req, res)
);

atividadeRouter.delete('/atividades/:id', ensureTeacher, (req, res) => 
  atividadeController.deleteAtividade(req, res)
);

// Rotas especiais para gestão de atividades
atividadeRouter.post('/atividades/liberar-proxima', ensureTeacher, (req, res) =>
  atividadeController.liberarProximaAtividade(req, res)
);

atividadeRouter.patch('/atividades/:id/concluir', ensureAuthenticated, (req, res) =>
  atividadeController.marcarAtividadeComoConcluida(req, res)
);

export default atividadeRouter; 