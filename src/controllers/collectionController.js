import { validationResult } from 'express-validator';
import * as collectionService from '../services/collectionService.js';

// Criar nova coleção
export const createCollection = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { name } = req.body;
    const collection = await collectionService.createCollection(req.user.id, name);

    res.status(201).json({
      success: true,
      message: 'Coleção criada com sucesso',
      data: { collection }
    });
  } catch (error) {
    console.error('Erro ao criar coleção:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao criar coleção',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Listar todas as coleções do usuário
export const getUserCollections = async (req, res) => {
  try {
    const collections = await collectionService.getUserCollections(req.user.id);

    res.json({
      success: true,
      data: { collections }
    });
  } catch (error) {
    console.error('Erro ao listar coleções:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao listar coleções',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Obter uma coleção específica com seus artigos
export const getCollectionById = async (req, res) => {
  try {
    const collection = await collectionService.getCollectionById(
      req.params.id,
      req.user.id
    );

    res.json({
      success: true,
      data: { collection }
    });
  } catch (error) {
    console.error('Erro ao buscar coleção:', error);
    
    const statusCode = error.message === 'Coleção não encontrada' ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Erro ao buscar coleção',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Atualizar nome da coleção
export const updateCollection = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { name } = req.body;
    const collection = await collectionService.updateCollection(
      req.params.id,
      req.user.id,
      name
    );

    res.json({
      success: true,
      message: 'Coleção atualizada com sucesso',
      data: { collection }
    });
  } catch (error) {
    console.error('Erro ao atualizar coleção:', error);
    
    const statusCode = error.message === 'Coleção não encontrada' ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Erro ao atualizar coleção',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Deletar coleção
export const deleteCollection = async (req, res) => {
  try {
    await collectionService.deleteCollection(req.params.id, req.user.id);

    res.json({
      success: true,
      message: 'Coleção deletada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar coleção:', error);
    
    const statusCode = error.message === 'Coleção não encontrada' ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Erro ao deletar coleção',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Adicionar artigo à coleção
export const addArticleToCollection = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const article = await collectionService.addArticleToCollection(
      req.params.id,
      req.user.id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: 'Artigo adicionado à coleção com sucesso',
      data: { article }
    });
  } catch (error) {
    console.error('Erro ao adicionar artigo:', error);
    
    const statusCode = error.message === 'Coleção não encontrada' ? 404 :
                      error.message === 'Artigo já existe nesta coleção' ? 400 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Erro ao adicionar artigo',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Remover artigo da coleção
export const removeArticleFromCollection = async (req, res) => {
  try {
    await collectionService.removeArticleFromCollection(
      req.params.collectionId,
      req.params.articleId,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Artigo removido da coleção com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover artigo:', error);
    
    const statusCode = error.message === 'Coleção não encontrada' || 
                      error.message === 'Artigo não encontrado nesta coleção' ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Erro ao remover artigo',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
