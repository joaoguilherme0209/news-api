import express from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import * as collectionController from '../controllers/collectionController.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Validações
const collectionValidation = [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Nome da coleção deve ter entre 1 e 100 caracteres')
];

// Rotas de coleções
router.post('/', collectionValidation, collectionController.createCollection);
router.get('/', collectionController.getUserCollections);
router.get('/:id', collectionController.getCollectionById);
router.put('/:id', collectionValidation, collectionController.updateCollection);
router.delete('/:id', collectionController.deleteCollection);

// Rotas de artigos
router.post('/:id/articles', [
  body('title').trim().notEmpty().withMessage('Título é obrigatório'),
  body('url').isURL().withMessage('URL inválida'),
  body('publishedAt').notEmpty().withMessage('Data de publicação é obrigatória')
], collectionController.addArticleToCollection);

router.delete('/:collectionId/articles/:articleId', collectionController.removeArticleFromCollection);

export default router;
