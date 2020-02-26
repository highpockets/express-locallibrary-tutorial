var hbs = require('hbs');

hbs.handlebars.registerHelper('sort', function(book_list){
    book_list.sort(function(a, b) {let textA = a.title.toUpperCase(); let textB = b.title.toUpperCase(); return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;});
});

hbs.handlebars.registerHelper('bookstatus', function(book_copy, detail){
    
    const status = (cls, needsDate) => {
        const span = `<span class="text-${cls}">${book_copy.status}</span>`;
        return (!needsDate) ? span : span + `<span> ( Due: ${book_copy.due_back_formatted} )</span>`;
    };
    var val = (book_copy.status == 'Available')
                ? status('success', false) : (book_copy.status == 'Maintenance')
                ? status('danger', true)
                : status('warning', true);

    return new hbs.handlebars.SafeString(val);
});

hbs.handlebars.registerHelper('overdue', function(book_copy){
    return (book_copy.status != 'Available') ? new hbs.handlebars.SafeString(`<p><strong>Due back: </strong>${book_copy.due_back_formatted}</p>`) : '';
});

hbs.handlebars.registerHelper('isundefined', function(obj, val){
    return (obj === undefined) ? '' : val;
});

module.exports = hbs;