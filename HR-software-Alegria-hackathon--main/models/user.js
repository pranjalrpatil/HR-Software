const mongoose= require("mongoose")
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
    type: {type: String},
    email: {type: String, required: true, unique: true},
    username: {type: String},
    name: {type: String },
    dateOfBirth: {type: Date },
    contactNumber: {type: Number},
    department: String,
    Skills: [String],
    designation: String,
    dateAdded: {type: Date},
    uniname:{type: String},
    gdate: {type: Date},
    spe:{type: String},
    deg:{type: String},
    colgname: {type: String},
    twdate:{type: Date},
    boa: {type: String},
    addr:{type: String},
    city:{type: String},
    state:{type: String},
    zip:{type: Number},
    phone:{type: Number},
    applied: [
        {
            id: {type: String},
            status: {
                type: String,
                enum: ['not applied','applied','interview','in progress','accepted','rejected']
            },
            feedback: {type: String}
        }
    ],
    isaccepted: {
        type: Number,
        default: 0
    }
});

UserSchema.plugin(passportLocalMongoose,
    { usernameField : 'email'});

module.exports = mongoose.model('User', UserSchema);
