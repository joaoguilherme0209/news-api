import { validationResult } from 'express-validator';
import * as authService from '../services/authService.js';

// Registrar novo usuário
export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const result = await authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: result
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    
    const statusCode = error.message === 'Email já cadastrado' ? 400 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Erro ao registrar usuário',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: result
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    
    const statusCode = error.message === 'Email ou senha inválidos' ? 401 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Erro ao fazer login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Obter perfil do usuário logado
export const getProfile = async (req, res) => {
  try {
    const user = await authService.getUserProfile(req.user.id);

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    
    const statusCode = error.message === 'Usuário não encontrado' ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Erro ao buscar perfil',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Atualizar perfil do usuário
export const updateProfile = async (req, res) => {
  try {
    const user = await authService.updateUserProfile(req.user.id, req.body);

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: { user }
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    
    const statusCode = error.message === 'Usuário não encontrado' ? 404 : 
                      error.message.includes('Frequência de email inválida') ? 400 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Erro ao atualizar perfil',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
