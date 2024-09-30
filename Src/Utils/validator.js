const validateEmail = (email)=>{
    let regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    return regex.test(email);
}

const validateMobile = (num)=>{
    let regex = /^\d{10}$/
    return regex.test(num);
}

const validatePassword = (pwd)=>{
    let regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    return regex.test(pwd);
}

export default {
    validateEmail,
    validateMobile,
    validatePassword
}