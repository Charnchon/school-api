
const Validator = use("Validator")

module.exports = async function teacherValidator (data) {

    if(typeof data !== 'object') throw new Error()
    const {first_name,last_name,password,email} = data

    const rules = {
        first_name: "required",
        last_name: "required",
        email: "required|email|unique:teachers,email",
        password: "required|min:8"
    }

    const validation = await Validator.validateAll({first_name,last_name,password,email},rules)
    
    return {
        error: validation.messages()
    }
}