const joi = require("joi");
const APIError = require("../../utils/errors");
//auth validation middlewares for register login and change password.
//joi is used for validation.
class authValidation {
  constructor() {}
  static register = async (req, res, next) => {
    try {
      await joi
        .object({
          full_name: joi.string().min(2).max(50).required().messages({
            "string.base": "İsim alanı normal metin olmalıdır!",
            "string.empty": "İsim alanı boş olamaz!",
            "string.min": "İsim en az 2 karakterden oluşmalıdır!",
            "string.max": "İsim en fazla 50 karakterden oluşmalıdır!",
            "string.required": "İsim alanı zorunludur!",
          }),
          email: joi
            .string()
            .email()
            .min(3)
            .max(100)
            .required()
            .messages({
              "string.base": "Email alanı normal metin olmalıdır!",
              "string.empty": "Email alanı boş olamaz!",
              "string.min": "Email en az 3 karakterden oluşmalıdır!",
              "string.email": "Lütfen geçerli bir email adresi giriniz!",
              "string.max": "Email en fazla 50 karakterden oluşmalıdır!",
              "string.required": "Email alanı zorunludur!",
            }),
          password: joi.string().min(8).max(36).pattern(new RegExp('(?=.*[.!@#$%^&*])')).required().messages({
            "string.base": "Şifre alanı normal metin olmalıdır!",
            "string.empty": "Şifre alanı boş olamaz!",
            "string.min": "Şifre en az 8 karakterden oluşmalıdır!",
            "string.max": "Şifre en fazla 36 karakterden oluşmalıdır!",
            "string.pattern.base": "Şifre en az bir özel karakter içermelidir!",
            "string.required": "Şifre alanı zorunludur!",
          }),
          confirm_password: joi.any().equal(joi.ref('password')).required().messages({
            'any.only': 'Şifreler eşleşmiyor!',
            'any.required': 'Şifre tekrarı alanı zorunludur!',
          })
        })
        .validateAsync(req.body);
    } catch (error) {
      if (error.details && error?.details[0].message) throw new APIError(error.details[0].message, 400);
      else throw new APIError("Lütfen doğrulama kurallarına uyun!", 400);
    }
    next();
  };

  static login = async (req, res, next) => {
    try {
      await joi
        .object({
          email: joi
            .string()
            .email()
            .trim()
            .min(3)
            .max(100)
            .required()
            .messages({
              "string.base": "Email alanı normal metin olmalidir!",
              "string.empty": "Email alanı boş olamaz!",
              "string.min": "Email en az 3 karakterden oluşmalıdır!",
              "string.email": "Lütfen geçerli bir email adresi giriniz!",
              "string.max": "Email en fazla 50 karakterden olusmalidir!",
              "string.required": "Email field is required!",
            }),
          password: joi.string().trim().min(6).max(36).required().messages({
            "string.base": "Sifre alani normal metin olmalidir!",
            "string.empty": "Sifre alani bos olamaz!",
            "string.min": "Sifre en az 6 karakterden olusmalidir!",
            "string.max": "Sifre en fazla 36 karakterden olusmalidir!",
            "string.required": "Sifre alani zorunludur!",
          })
        })
        .validateAsync(req.body);
    } catch (error) {
      if (error.details && error?.details[0].message) throw new APIError(error.details[0].message, 400);
      else throw new APIError("Lutfen dogrulama kurallarina uyun!", 400);
    }
    next();
  };
  static changePassword = async (req, res, next) => {
    try {
      await joi
        .object({        
          password: joi.string().min(8).max(36).pattern(new RegExp('(?=.*[.!@#$%^&*])')).required().messages({
            "string.base": "Şifre alanı normal metin olmalıdır!",
            "string.empty": "Şifre alanı boş olamaz!",
            "string.min": "Şifre en az 8 karakterden oluşmalıdır!",
            "string.max": "Şifre en fazla 36 karakterden oluşmalıdır!",
            "string.pattern.base": "Şifre en az bir özel karakter içermelidir!",
            "string.required": "Şifre alanı zorunludur!",
          }),
          new_password: joi.string().min(8).max(36).pattern(new RegExp('(?=.*[.!@#$%^&*])')).required().messages({
            "string.base": "Yeni Şifre alanı normal metin olmalıdır!",
            "string.empty": "Yeni Şifre alanı boş olamaz!",
            "string.min": "Yeni Şifre en az 8 karakterden oluşmalıdır!",
            "string.max": "Yeni Şifre en fazla 36 karakterden oluşmalıdır!",
            "string.pattern.base": "Yeni Şifre en az bir özel karakter içermelidir!",
            "string.required": "Yeni Şifre alanı zorunludur!",
          }),
          confirm_password: joi.any().equal(joi.ref('new_password')).required().messages({
            'any.only': 'Şifreler eşleşmiyor!',
            'any.required': 'Şifre tekrarı alanı zorunludur!',
          })
        })
        .validateAsync(req.body);
    } catch (error) {
      if (error.details && error?.details[0].message) throw new APIError(error.details[0].message, 400);
      else throw new APIError("Lutfen dogrulama kurallarina uyun!", 400);
    }
    next();
  };
}

module.exports = authValidation;
