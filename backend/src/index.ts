import 'reflect-metadata';
import './module/login/container/container'; 
import './module/register/container/container';
import './module/auth/container/container';
import './module/management/container/container';
import './module/teachmanagement/container/container';
import { app } from "./shared/config/server";
import { ensureAuthenticated } from './module/auth/middleware/ensure_authenticated';
import loginRouter from "./module/login/http/routes/login_route";
import registerRouter from "./module/register/http/routes/register_route";
import managementRouter from './module/management/http/routes/management_route';
import teachRouter from './module/teachmanagement/http/routes/teach_route';
import express from 'express';

const PORT = process.env.PORT || 3000;

// Rotas públicas
app.use('/api', loginRouter);
app.use('/api', registerRouter);

// Rotas protegidas (precisam de autenticação)
app.use('/api/management', ensureAuthenticated, managementRouter);
app.use('/api/teach', ensureAuthenticated, teachRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});