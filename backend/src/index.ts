import 'reflect-metadata';
import { config } from './shared/config/env';
import { initializeDatabase, testConnection } from './shared/database/mysql/db';

import './module/login/container/container'; 
import './module/register/container/container';
import './module/auth/container/container';
import './module/management/container/container';
import './module/management/container/album_container';
import './module/quizshow/container/container';
import './module/teachmanagement/container/container';
import { app } from "./shared/config/server";
import express from 'express';
import loginRouter from "./module/login/http/routes/login_route";
import registerRouter from "./module/register/http/routes/register_route";
import managementRouter from './module/management/http/routes/management_route';
import teachRouter from './module/teachmanagement/http/routes/teach_route';

app.use('/api', loginRouter);
app.use('/api', registerRouter);

app.use('/api/management', managementRouter);
app.use('/api', teachRouter);

app.use('*', (req, res) => {
  res.status(404).json({
      error: 'Rota não encontrada',
      path: req.originalUrl
  });
});

app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro na aplicação:', error);
  
  return res.status(500).json({
      error: 'Erro interno do servidor',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Algo deu errado'
  });
});

async function startServer() {
  try {
    initializeDatabase();
    
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('Falha na conexão com o banco de dados');
      process.exit(1);
    }
    
    app.listen(config.server.port, () => {
      console.log(`Servidor rodando na porta ${config.server.port}`);
      console.log(`Banco de dados: MySQL conectado`);
    });
  } catch (error) {
    console.error('Erro ao inicializar servidor:', error);
    process.exit(1);
  }
}

startServer();