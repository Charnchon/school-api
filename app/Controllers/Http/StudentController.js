'use strict'

const Database =  use('Database')
const Hash = use('Hash')
const Validator = use('Validator')
const Student = use('App/Models/Student')

function numberTypeParamValidator(number) {
    if(Number.isNaN(parseInt(number))) 
        return {error:"param: ${number} is not support please input number" }
    
    return {}
}

class StudentController {

    async index({request}) {
        const {references = undefined} = request.qs

        const students = Student.query()

        if(references) {
            const extractedReferences = references.split(",")
            students.with(extractedReferences)

        }
        return {status:200,error:undefined,data:await students.fetch()}
    }
    async show ({request}) {
 
        const {id} = request.params

        const validatedValue = numberTypeParamValidator(id)

        if (validatedValue.error) return {
            status : 500,error:validatedValue.error, data:undefined
        }

        const student = await Student.find(id)
        
        return {status:200,error:undefined,data:student || {}}

    }

    async store ({request}) {
        const {first_name,last_name,password,email,group_id} = request.body

        const rules = {
            first_name: "required",
            last_name: "required",
            password: "required|min:8",
            email: "required|email|unique:teachers,email",
            group_id: "required"
        }

        const validation = await Validator.validateAll(request.body,rules)

        if(validation.fails())
            return {status:422,error:validation.messages(),data:undefined}

        const hashPassword = await Hash.make(password)
        const student = await Database.table("students").insert({first_name,last_name,password,email,group_id})
        return {status:200,error:undefined,data:{first_name,last_name,password,email,group_id}}
        
    }

    async update ({request}) {

        const {body,params} = request 
        const {id} = params
        const {first_name,last_name,email,group_id} = body

        const studentId = await Database.table("students").where({student_id: id})
        .update({first_name,last_name,email,group_id})

        const student = await Database.table("students").where({student_id: studentId})
        .first()

        return {status:200,error:undefined,data:student}

    }

    async destroy ({request}) {

        const {id} = request.params
        const deleteStudent = await Database.table("students").where({student_id:id}).delete()
        return {status:200,error:undefined,data:{message:'success'}}


    }

    async showGroup({request}) {
        const {id} = request.params
        const student = await Database
        .table('students')
        .where({student_id : id})
        .innerJoin('groups','groups.group_id','students.group_id')
        .first()
        return {status:200,error:undefined,data:student || {}}
    }

}

module.exports = StudentController
