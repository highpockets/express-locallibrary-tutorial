var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var AuthorSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
  }
);

// Virtual for author's full name
AuthorSchema
.virtual('name')
.get(function() {
// To avoid errors in cases where an author does not have either a family name or first name
// We want to make sure we handle the exception by returning an empty string for that case

  var fullname = '';
  if (this.first_name && this.family_name) {
    fullname = this.family_name + ', ' + this.first_name
  }
  else if (this.first_name) { fullname = this.first_name; }
  else if (this.family_name) { fullname = this.family_name; }

  return fullname;
});

// Virtual for author's lifespan
AuthorSchema
.virtual('lifespan')
.get(function() {

    var date = '';

    if(this.date_of_birth && this.date_of_death){
        date = (this.date_of_death.getYear() - this.date_of_birth.getYear()).toString();
    }
    else if(this.date_of_birth){
        date = (new Date().getYear() - this.date_of_birth.getYear()).toString();
    }
    else{
        return date;
    }
});

// Virtual for author's URL
AuthorSchema
.virtual('url')
.get(function() {
  return '/catalog/author/' + this._id;
});

AuthorSchema
.virtual('lifespan_formatted')
.get(function() {
    return moment(this.date_of_birth).format('MMMM Do, YYYY') + ' - ' + ((this.date_of_death) ? moment(this.date_of_death).format('MMMM Do, YYYY') : 'Present');
});

//Export model
module.exports = mongoose.model('Author', AuthorSchema);