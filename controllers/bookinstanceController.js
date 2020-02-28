var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all BookInstances.
exports.bookinstance_list = function(req, res, next) {
    
    BookInstance.find()
        .populate('book')
        .exec((err, list_bookinstances) => {
            if(err) { return next(err); }
            res.render('bookinstance_list', { title: 'Book Instance List', bookinstance_list: list_bookinstances})
        });
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function(req, res, next) {

    BookInstance.findById(req.params.id)
        .populate('book')
        .exec(function (err, bookinstance) {
            if(err) { return next(err); }
            if(bookinstance == null){
                var err = new Error('Book copy not found');
                err.status = 404;
                return next(err);
            }
            res.render('bookinstance_detail', {bookinstance: bookinstance});
        });
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = function(req, res, next) {
    
    Book.find({}, 'title')
    .exec(function(err, books) {
        if(err) { return next(err); }
        //Successful, so render.
        res.render('bookinstance_form', { title: 'Create Book Copy', book_list: books});
    });
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
    
    //Validate fields.
    body('book', 'Book must be specified').trim().isLength({min: 1}),
    body('imprint', 'Imprint must be specified').trim().isLength({min: 1}),
    body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),

    //Sanitize fields.
    sanitizeBody('book').escape(),
    sanitizeBody('imprint').escape(),
    sanitizeBody('status').trim().escape(),
    sanitizeBody('due_back').toDate(),

    //Process request after validation and sanitization.
    (req, res, next) => {

        //Extract the validation errors from a request.
        const errors = validationResult(req);

        //Create a BookInstance object with escaped and trimmed data.
        var bookinstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back
        });
        if(!errors.isEmpty()) {
            //There are errors. Render form again with the sanitized values and error messages
            Book.find({}, 'title')
                .exec(function(err, books) {
                    if(err) { return next(err); }
                    //Successful, so render
                    res.render('bookinstance_form', { title: 'Create Book Copy', book_list: books, selected_book: bookinstance.book._id, errors: errors.array(), bookinstance: bookinstance });
            });
            return;
        }
        else{
            //Data from form is valid.
            bookinstance.save(function(err){
                if(err) { return next(err); }
                //Successful - redirect to new record
                res.redirect(bookinstance.url);
            });
        }
    }
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function(req, res, next) {
    
    BookInstance.findById(req.params.id)
        .populate('book')
        .exec( function(err, bookinstance) {
            if(err) { return next(err); }
            if(bookinstance == null){
                var err = new Error('Book copy not found');
                err.status = 404;
                return next(err);
            }
            //Successful, so render
            res.render('bookinstance_delete', { title: 'Delete Copy ID:', bookinstance: bookinstance });
        });
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function(req, res, next) {
    
    BookInstance.findById(req.body.bookinstanceid)
    .populate('book')
    .exec( function(err, bookinstance) {
        if(err) { return next(err); }
        if(bookinstance == null){
            var err = new Error('Book copy not found');
            err.status = 404;
            return next(err);
        }
        var book_url = bookinstance.book.url;

        BookInstance.findByIdAndRemove(req.body.bookinstanceid, function deleteBookInstance(err) {
            if(err) { return next(err); }
            //Success - got to book list
            res.redirect(book_url);
        });
    });
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = function(req, res, next) {
    
    BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function(err, bookinstance){
        if(err) { return next(err); }
        if(bookinstance == null){
            var err = new Error('Book copy not found');
            err.status = 404;
            return next(err);
        }
        res.render('bookinstance_form', {title: 'Update Book Copy', bookinstance: bookinstance, book: bookinstance.book});
    });
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = [

        //Validate fields.
        body('imprint', 'Imprint must be specified').trim().isLength({min: 1}),
        body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),
    
        //Sanitize fields.
        sanitizeBody('imprint').escape(),
        sanitizeBody('status').trim().escape(),
        sanitizeBody('due_back').toDate(),
    
        //Process request after validation and sanitization.
        (req, res, next) => {
    
            //Extract the validation errors from a request.
            const errors = validationResult(req);
    
            //Create a BookInstance object with escaped and trimmed data.
            var bookinstance = new BookInstance({
                book: req.body.book,
                imprint: req.body.imprint,
                status: req.body.status,
                due_back: req.body.due_back,
                _id: req.params.id
            });
            if(!errors.isEmpty()) {
                //There are errors. Render form again with the sanitized values and error messages
                Book.findById(bookinstance.book)
                    .exec(function(err, book) {
                        if(err) { return next(err); }
                        //Successful, so render
                        res.render('bookinstance_form', { title: 'Update Book Copy', errors: errors.array(), bookinstance: bookinstance, book: book });
                });
                return;
            }
            else{
                //Data from form is valid.
                BookInstance.findByIdAndUpdate(bookinstance._id, bookinstance, {}, function(err){
                    if(err) { return next(err); }
                    //Successful - redirect to new record
                    res.redirect(bookinstance.url);
                });
            }
        }
];