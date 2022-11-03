
const User = require('../models/user');
const Todo = require('../models/todo');
const todo = require('../models/todo');
const ITEMS_PER_PAGE = 5;

exports.getAddItems = (req, res, next) => {
    todo.find({userId : req.user._id})
    const page = +req.query.page || 1;
    let totalItems;
    todo
        .find()
        .countDocuments()
        .then(numItems => {
            totalItems = numItems;
            todo.find({}, (err, Item) => {
                res.render('todo.ejs',
                    {
                        todo: Item,
                        isAuthenticated: req.session.isLoggedIn,
                        currentPage: page,
                        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                        hasPreviousPage: page > 1,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
                    });
            })
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
        })
}


exports.postAddItems = (req, res, next) => {
    const todo = req.body.content;
    const newItem = new Item({ todo });
    newItem
        .save()
        .then(() => {
            console.log('Added!')
            res.redirect('/');
        })
        .catch((err) => {
            console.log(err);
        })
};


exports.editItem = (req, res, next) => {
    const id = req.params.id;
    Todo.find({}, (err, Item) => {
        res.render("todoEdit.ejs", { todo: Item, idTask: id, isAuthenticated: req.isLoggedIn })
    });
}
exports.postEditItem = ((req, res, next) => {
    const id = req.params.id;
    Todo.findByIdAndUpdate(id, { content: req.body.content }, err => {
        if (err) return res.send(500, err);
        res.redirect("/")
       
    });
});
exports.deleteItem = ((req, res, next) => {
    const id = req.params.id;
    Todo.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});
