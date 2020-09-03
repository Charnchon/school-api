'use strict'

const Database =  use('Database')
const Validator = use('Validator')
const Subject = use('App/Models/Subject')

function numberTypeParamValidator(number) {
    if(Number.isNaN(parseInt(number))) 
        return {error:"param: ${number} is not support please input number" }
    return {}
}

class SubjectController {

    async index({request}) {

        const {references = undefined} = request.qs
       
        const subjects = Subject.query()

        if(references) {
            const extractedReferences = references.split(",")
            subjects.with(extractedReferences)

        }
        
        return {status:200,error:undefined,data:await subjects.fetch()}

    }

    async show ({request}) {

        const {id} = request.params

        const validatedValue = numberTypeParamValidator(id)

        if (validatedValue.error) return {
            status : 500,error:validatedValue.error, data:undefined
        }

        const subject = await Subject.find(id)
        return {status:200,error:undefined,data:subject || {}}
    }

    async store ({request}) {

        const {title,teacher_id} = request.body

        const rules = {
            title: "required",
            teacher_id: "required",
        }

        const validation = await Validator.validateAll(request.body,rules)

        if(validation.fails())
            return {status:422,error:validation.messages(),data:undefined}

        const subject = await Database.table("subjects").insert({title,teacher_id})
        
        return {status:200,error:undefined,data:{title,teacher_id}}

    }
    
    async update ({request}) {

        const {body,params} = request 
        const {id} = params
        const {title,teacher_id} = body

        const subjectId = await Database.table("subjects").where({subject_id: id})
        .update({title,teacher_id})

        const subject = await Database.table("subjects").where({subject_id: subjectId})
        .first()

        return {status:200,error:undefined,data:subject}

    }

    async destroy ({request}) {

        const {id} = request.params
        const deleteSubject = await Database.table("subjects").where({subject_id:id}).delete()
        return {status:200,error:undefined,data:{message:'success'}}

    }

    async showTeacher({request}) {
        const {id} = request.params
        const subject = await Database
        .table('subjects')
        .where({subject_id : id})
        .innerJoin('teachers','subjects.teacher_id','teachers.teacher_id')
        .first()
        return {status:200,error:undefined,data:subject || {}}
    }

    async showEnrollment({request}) {
        const {id} = request.params
        const subject = await Database
        .table('subjects')
        .where({subject_id : id})
        .innerJoin('enrollments','subjects.subject_id','enrollments.subject_id')
        .first()
        return {status:200,error:undefined,data:subject || {}}

    }

}

module.exports = SubjectController
