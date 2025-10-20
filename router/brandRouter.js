const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { isAuthenticated,isAdmin } = require('../middlewares/authMiddleware');

// Tất cả routes đều yêu cầu đăng nhập
router.use(isAuthenticated);

// Routes cho Brand CRUD
router.get('/',isAdmin, brandController.getAllBrands);
router.get('/add',isAdmin, brandController.showAddForm);
router.post('/add',isAdmin, brandController.addBrand);
router.get('/:id/edit',isAdmin, brandController.showEditForm);
router.post('/:id/edit',isAdmin, brandController.updateBrand);
router.get('/:id/delete',isAdmin, brandController.deleteBrand);
router.get('/:id',isAdmin, brandController.getBrandDetail);

module.exports = router;
