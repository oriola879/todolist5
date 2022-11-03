const path = require ('path');
const router = require('express').Router();

const itemsController = require('../controllers/items');

const isAuth = require ('../middleware/is-auth');

router.get('/', isAuth, itemsController.getAddItems);

router.post('/add', isAuth, itemsController.postAddItems);

router.get('/edit/:id'  ,isAuth , itemsController.editItem);

router.post ('/edit/:id', isAuth, itemsController.postEditItem);

router.get('/remove/:id', isAuth , itemsController.deleteItem);



module.exports = router; 