import { body } from "express-validator";



export const registerValidation = [
    body('fullName', 'Слишком длинное или короткое имя').isLength({ min: 2, max: 22 }),
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Слишком короткий пароль').isLength({ min: 5 }),
    body('avatarUrl', 'Неверная ссылка на аватар').optional().isURL(),
]

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Слишком короткий пароль').isLength({ min: 5 }),
]
export const updateValidation = [
    body('fullName', 'Слишком длинное или короткое имя').isLength({ min: 2, max: 22 }),
]