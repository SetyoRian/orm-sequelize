const router = require('express').Router();

const PhotoController = require('../controllers/photoController');
const UserController = require('../controllers/userController');
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');

router.post('/users/login', UserController.login);

router.post('/users/register', UserController.register);

router.use(authentication);

router.get('/photos', PhotoController.GetAllPhotos);

router.get('/photos/:id', PhotoController.getOnePhotoByID);

router.post('/photos', PhotoController.createPhoto);

router.use('/photos/:id', authorization)

router.put('/photos/:id', PhotoController.updateOnePhotoByID);

router.delete('/photos/:id', PhotoController.deleteOnePhotoByID);

module.exports = router;