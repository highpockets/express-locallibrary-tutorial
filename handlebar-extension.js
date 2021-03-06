var hbs = require('hbs');
var moment = require('moment');

hbs.handlebars.registerHelper('sort_books', function(book_list){
    book_list.sort(function(a, b) {let textA = a.title.toUpperCase(); let textB = b.title.toUpperCase(); return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;});
});

hbs.handlebars.registerHelper('sort_authors', function(author_list){
    author_list.sort(function(a, b) {let textA = a.family_name.toUpperCase(); let textB = b.family_name.toUpperCase(); return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;});
});

hbs.handlebars.registerHelper('book_status', function(book_copy, is_detail_page){
    
    const status = (cls) => {
        const span = `<span class="text-${cls}">${book_copy.status}</span>`;
        return (is_detail_page) ? span : span + `<span> ( Due: ${book_copy.due_back_formatted} )</span>`;
    };
    var val = (book_copy.status == 'Available')
                ? status('success') : (book_copy.status == 'Maintenance')
                ? status('danger')
                : status('warning');

    return new hbs.handlebars.SafeString(val);
});

hbs.handlebars.registerHelper('is_checked', function(checked){
    return (checked == 'true') ? new hbs.handlebars.SafeString(`checked`) : new hbs.handlebars.SafeString(``);
});

hbs.handlebars.registerHelper('is_the_author', function(author_id, author, book_author_id){
    return (author_id.toString() == author.toString()
            || author_id.toString() == book_author_id.toString()) ? new hbs.handlebars.SafeString('selected') : '';
});

hbs.handlebars.registerHelper('is_the_book', function(book_id, book){
    return (book_id.toString() == book.toString()) ? new hbs.handlebars.SafeString('selected') : '';
});

hbs.handlebars.registerHelper('overdue', function(book_copy){
    return (book_copy.status != 'Available') ? new hbs.handlebars.SafeString(`<p><strong>Due back: </strong>${book_copy.due_back_formatted}</p>`) : '';
});

hbs.handlebars.registerHelper('is_undefined', function(obj, val){
    if(val instanceof Date) { val = moment(val).format('YYYY-MM-DD'); }
    return (obj === undefined) ? '' : new hbs.handlebars.SafeString(val);
});

hbs.handlebars.registerHelper('concatenate_strings', function(first, second){
    return first + '' + second;
});

hbs.handlebars.registerHelper('make_safe', function(str){
    return new hbs.handlebars.SafeString(str);
});

module.exports = hbs;