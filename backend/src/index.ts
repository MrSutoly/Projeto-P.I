import 'reflect-metadata';
import { config } from './shared/config/env';
import { testConnection } from './shared/database/supabase/db';

import './module/login/container/container'; 
import './module/register/container/container';
import './module/auth/container/container';
import './module/management/container/container';
import './module/management/container/album_container';
import './module/management/container/atividade_container';
import './module/teachmanagement/container/container';
import './module/album/container/container';
import './module/ranking/container/container';
import './module/quiz/container/container';
import './module/admin/container/container';
import { app } from "./shared/config/server";
import express from 'express';
import loginRouter from "./module/login/http/routes/login_route";
import rankingRouter from './module/ranking/http/routes/ranking_route';
import registerRouter from "./module/register/http/routes/register_route";
import albumRouter from './module/album/http/routes/album_route';
import managementRouter from './module/management/http/routes/management_route';
import teachRouter from './module/teachmanagement/http/routes/teach_route';
import { quizRouter } from './module/quiz/http/routes/quiz_route';
import { adminRoutes } from './module/admin/http/routes/admin_routes';
import { publicAdminRoutes } from './module/admin/http/routes/public_admin_routes';

// Rotas públicas primeiro (sem autenticação)
app.use('/api', publicAdminRoutes);

app.use('/api', quizRouter);
app.use('/api', loginRouter);
app.use('/api', registerRouter);
app.use('/api', albumRouter);
app.use('/api', rankingRouter);
app.use('/api/management', managementRouter);
app.use('/api/teach', teachRouter);

// Rotas protegidas por último (com autenticação)
app.use('/api/admin', adminRoutes);

app.use('*', (req, res) => {
  res.status(404).json({
      error: 'Rota não encontrada',
      path: req.originalUrl
  });
});

async function startServer() {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('Falha na conexão com o banco de dados');
      process.exit(1);
    }
    
    app.listen(config.server.port, () => {
      console.log(`Servidor rodando na porta ${config.server.port}`);
      console.log(`Banco de dados: Supabase conectado`);
    });
  } catch (error) {
    console.error('Erro ao inicializar servidor');
    process.exit(1);
  }
}

startServer();