var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AuthorSchema = new Schema(
    {
        first_name: {type: String, required: true, max: 100},
        family_name: {type: String, required: true, max: 100},
        date_of_birth: {type: Date},
        date_of_death: {type: Date},
    }
);

// Virtual author's full name
AuthorSchema
.virtual('name')
.get(() => {

    // To avoid errors in cases where an author does not have either a family name or first name
    // We want to make sure we handle the exception by returning an empty string for that case

    var fullname = '';

    if(this.first_name && this.family_name){
        fullname = this.family_name + ', ' + this.first_name;
    }
    else if(!this.first_name && this.family_name){
        fullname = this.family_name;
    }
    else if(!this.family_name && this.first_name){
        fullname = this.first_name;
    }
    return fullname;
});

AuthorSchema
.virtual('url')
.get(() => {
    return '/catalog/author/' + this._id;
});

//Export model
module.exports = mongoose.model('Author', AuthorSchema);