'use strict'

const Database =  use('Database')
const Hash = use('Hash')
const Validator = use('Validator')
const Teacher = use('App/Models/Teacher')

function numberTypeParamValidator(number) {
    if(Number.isNaN(parseInt(number))) 
        return {error:"param: ${number} is not support please input number" }
    
    return {}
}

class TeacherController {
    
    async index() {
        const teachers = await Database.table('teachers')
        return teachers
    }
    async show ({request}) {

        const {id} = request.params

        const validatedValue = numberTypeParamValidator(id)

        if (validatedValue.error) return {
            status : 500,error:validatedValue.error, data:undefined
        }

        const teacher = await Teacher.find(id)
        
        return {status:200,error:undefined,data:teacher || {}}

    }

    async store ({request}) {
        const {first_name,last_name,email,password} = request.body

        const rules = {
            first_name: "required",
            last_name: "required",
            email: "required|email|unique:teachers,email",
            password: "required|min:8"
        }

        const validation = await Validator.validateAll(request.body,rules)

        if(validation.fails())
            return {status:422,error:validation.messages(),data:undefined}

        const hashPassword = await Hash.make(password)
        const teacher = await Database.table("teachers").insert({first_name,last_name,email,password})
        return {status:200,error:undefined,data:{ first_name,last_name,email}}
    }

    async update ({request}) {

        const {body,params} = request 
        const {id} = params
        const {first_name,last_name,email} = body

        const teacherId = await Database.table("teachers").where({teacher_id: id})
        .update({first_name,last_name,email})

        const teacher = await Database.table("teachers").where({teacher_id: teacherId})
        .first()

        return {status:200,error:undefined,data:teacher}

    }

    async destroy ({request}) {

        const {id} = request.params
        const deleteTeacher = await Database.table("teachers").where({teacher_id:id}).delete()
        return {status:200,error:undefined,data:{message:'success'}}


    }

}

module.exports = TeacherController
