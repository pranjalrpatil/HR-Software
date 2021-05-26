const mongoose= require("mongoose")
const Schema = mongoose.Schema;

const JobSchema = new Schema({
   dept: {type: String},
   post: {type: String},
   expected_salary: {type: Number},
   vacancies: {type: Number},
   description: {type: String},
   author: {
       type: Schema.Types.ObjectId,
       ref: 'User'
   },
   applicants: [
       {
            type: Schema.Types.ObjectId,
            ref:'User'
       }
    ]
});

module.exports = mongoose.model('Job', JobSchema);