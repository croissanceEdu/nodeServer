const mongoose = require('mongoose');
const crypto = require('crypto');




const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required: true,
        unique: true,
        trim: true,
        lowercase:true
    },
    name:{ 
        type:String,
        required: true,
        trim: true,
     },   
    hashed_password:{
        type:String,
        required: true
    },
    salt:String,
    role:{
        type:String,
        default:"student"
    },
    resetPasswordLink:{
        
        type:String,
        default:""
    },
    imagePath:{
        
        type:String,
        default:""
    }
}, 
{
    timestamps: true 
});



// userSchema.virtual("password")
// .set(function (password){
//     this.password=password
//     this.salt=this.makeSalt()
//     this.hashed_password=this.encriptPassword(password)
// })
// .get(function(){
//     return this.password
// })

// userSchema.methods={
//     makeSalt:function(){
//         return Math.round(new Date().valueOf()*Math.random()+'')
//     },
//     encriptPassword:function(password){
//         if(!password)return ''
//         try{
//             return crypto
//             .createHmac('sha1',this.salt)
//             .update(password)
//             .digest('hex')
//         }catch(err){
//             return ""
//         }
//     },
//     authenticate:function(plainPassword){
//         return this.encriptPassword(plainPassword)===this.hashed_password
//     }
// }


//for test
// userSchema.virtual("passwordo")
// .set(function (password){
//     this.password=password
// })
// .get(function(){
//     return this.password
// })

// userSchema.method={
// authenticate:function(plainPassword){
//              return plainPassword===this.password
//         }
// }


userSchema.virtual("password")
.set(function (password){
    this.salt=this.makeSalt()
    this.hashed_password=this.encriptPassword(password)
})
.get(function(){
    return this.hashed_password
})

userSchema.methods={
    makeSalt:function(){
        return Math.round(new Date().valueOf()*Math.random()+'')
    },
    encriptPassword:function(password){
        if(!password)return ''
        try{
            return crypto
            .createHmac('sha1',this.salt)
            .update(password)
            .digest('hex')
        }catch(err){
            return ""
        }
    },
    authenticate:function(plainPassword){
        return this.encriptPassword(plainPassword)===this.hashed_password
    }
}






module.exports=mongoose.model('User',userSchema)