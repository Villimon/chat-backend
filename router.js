import { Router } from "express";
import { loginValidation, registerValidation, updateValidation } from "./validations/auth.js";
import handleValidationErrors from './utils/handleValidationErrors.js'
import { following, getAllUsers, getMe, login, register, unfollowing, updateFullName } from "./controllers/UserControllers.js";
import checkAuth from "./utils/checkAuth.js";
import { createDialog, deleteDialog, getAllDialogs } from "./controllers/DialogController.js";
import { createMessage, deleteMessage, getMessages } from "./controllers/MessageController.js";


const router = new Router()

router.post('/register', registerValidation, handleValidationErrors, register)
router.post('/login', loginValidation, handleValidationErrors, login)
router.get('/me', checkAuth, getMe)


router.get('/users', checkAuth, getAllUsers)
router.put('/users', checkAuth, updateValidation, handleValidationErrors, updateFullName)


router.post('/follow/:id', checkAuth, following)
router.delete('/follow/:id', checkAuth, unfollowing)

router.get('/dialogs', checkAuth, getAllDialogs)
router.post('/dialogs', checkAuth, createDialog)
router.delete('/dialogs/:id', checkAuth, deleteDialog)



router.get('/messages', checkAuth, getMessages)
router.post('/messages', checkAuth, createMessage)
router.delete('/messages/:id', checkAuth, deleteMessage)




export default router;

