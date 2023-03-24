const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt=require('bcrypt');
const dbSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,'please enter a valid email'],
        unique:true,
        lowercase:true,
        validate:[isEmail,'please enter a valid email']
    },
    password:{
        type:String,
        required:[true,'please enter a valid password'],
        minlength:[6,'password length should be greater than 6 characters']
    }
});
dbSchema.pre('save',async function(){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
});
dbSchema.statics.login = async function(email,password){
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password,user.password);
        if(auth){
            return user;
        }
        throw Error("incorrect password");
    }else{
        throw Error("email doesnot exists");
    }
}
const user = mongoose.model("user",dbSchema);
module.exports = user;