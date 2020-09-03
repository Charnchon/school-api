'use strict'

const { test } = use('Test/Suite')('Teacher Validator')
const teacherValidator = require('../../service/TeacherValidator')



test('should return error when pass incorrect data', async ({assert}) => {
  const validateData = await teacherValidator({
    first_name:"John",
    last_name:"Doe",
    password:"123456789",
    email:"wrong email"
  })
  assert.isArray(validateData.error)
})

test('should return more than one error if multiple incorrect data is passed', async ({assert}) => {
  const validateData = await teacherValidator({
    first_name:"John",
    last_name:"Doe",
    password:"12345",
    email:"john@gmail.com"
  })
  assert.isAbove( validateData.error.length, 1)
})

test('should return undefind when pass correct data', async({assert}) => {
  const validateData = await teacherValidator({
    first_name:"John",
    last_name:"Doe",
    password:"123456789",
    email:"john@gmail.com"
})
  assert.equal(validateData.error, undefined)

})
