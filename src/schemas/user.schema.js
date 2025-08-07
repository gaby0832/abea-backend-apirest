import Joi from 'joi';

export const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': "Esse campo precisa ter mais de dois caracteres",
    'string.max': 'Esse campo suporta até 50 caracteres',
    'any.required': "Nome é um campo obrigátoio"
  }),
  email: Joi.string().email().required().messages({
    'any.required':'Email é um campoo obrigátoio',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': "Esse campo precisa ter mais de 6 caracteres",
    'any.required': 'Senha é um campo obrigátoio'
  })
})

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required':'Email é um campoo obrigátoio',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': "Esse campo precisa ter mais de 6 caracteres",
    'any.required': 'Senha é um campo obrigátoio'
  })
})