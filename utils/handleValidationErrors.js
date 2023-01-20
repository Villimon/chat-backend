import { validationResult } from 'express-validator'

// парсим ошибки , чтобы их отображать, если валидация не прошла, т е если валидация ошибки вернула
export default (req, res, next) => {
    // проверяем есть ли у нас ошибку
    const errors = validationResult(req)
    // в случае если есть то будем возвращать код 400
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())
    }

    next()
}