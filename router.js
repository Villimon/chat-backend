import { Router } from "express";
import { loginValidation, registerValidation, updateValidation } from "./validations/auth.js";
import handleValidationErrors from './utils/handleValidationErrors.js'
import { following, getAllUsers, getMe, login, register, unfollowing, updateFullName } from "./controllers/UserControllers.js";
import checkAuth from "./utils/checkAuth.js";


const router = new Router()

router.post('/register', registerValidation, handleValidationErrors, register)
router.post('/login', loginValidation, handleValidationErrors, login)
router.get('/me', checkAuth, getMe)


router.get('/users', checkAuth, getAllUsers)
router.put('/users', checkAuth, updateValidation, handleValidationErrors, updateFullName)


router.post('/follow/:id', checkAuth, following)
router.delete('/follow/:id', checkAuth, unfollowing)



export default router;

