const express = require("express");
const router = express.Router();
const Book = require("../models").Book;

//get / - Home route should redirect to the /books route
router.get("/", (req, res, next) => {
  res.redirect("/books");
});

//get /books - Shows the full list of books
router.get(
  "/books",
  asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    res.render("index", { books, title: "Books" });
  })
);

//get /books/new - Shows the create new book form
router.get(
  "/books/new",
  asyncHandler(async (req, res) => {
    res.render("new-book", { book: {}, title: "New Book" });
  })
);

//post /books/new - Posts a new book to the database
router.post(
  "/books/new",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/books");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        res.render("new-book", {
          book,
          errors: error.errors,
          title: "New Book",
        });
      } else {
        throw error;
      }
    }
  })
);

// get /books/:id - Shows book detail form
router.get(
  "/books/:id",
  asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("update-book", { book: book });
    } else {
      const err = new Error();
      err.status = 404;
      next(err);
    }
  })
);

// post /books/:id - Updates book info in the database
router.post(
  "/books/:id",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect("/books/");
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        res.render("update-book", {
          book,
          title: "Update Book",
          errors: error.errors,
        });
      } else {
        throw error;
      }
    }
  })
);

// post /books/:id/delete - Deletes a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting
router.post(
  "/books/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.destroy();
    res.redirect("/books");
  })
);

//ASYNC/AWAIT
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = router;
