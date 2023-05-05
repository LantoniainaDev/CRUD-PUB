require("./config");

const bcrypt = require("bcrypt");
const { model, Schema } = require("mongoose");

const UserSchema = Schema({
    name:{
        type:String,
        required:true
    },
    firstname:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    params:{
        type:String,
        default:""
    },
    email:{
        type:String,
        unique:true,
        required:true,
        validate:[(e)=>{
            const reg = /^[a-z0-9]+@[a-z]+\.[a-z]+$/i.test(e);
            return reg
        }]
    },
    signinDate:{
        type:Date,
        default:Date.now(),
    },
    birth:{
        type:Date,
    },
    lastUpdate:{
        type:Date,
        default:Date.now()
    }
},{
    timeStamps:true,
    methods:{
        compare(pwd = " "){
            return bcrypt.compare(pwd,this.password)
        }
    }
})

UserSchema.pre(["save"],async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
})

// UserSchema.pre(["save",/[uU]pdate/],function (next) {
//     console.log("this",this);
// })

UserSchema.pre(/[uU]pdate/,async function(next){
    const pwd = this._update.$set.password;
    if (pwd) {
        const salt = await bcrypt.genSalt();
        // console.log('hashing password on update');
        this._update.$set.password = bcrypt.hashSync(pwd,salt);
        this._update.$set.lastUpdate = Date.now();
    }
    next();
})

const User = model("User",UserSchema,"User");

module.exports = { User }