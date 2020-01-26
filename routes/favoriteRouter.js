const express = require("express");
const favoriteRouter = express.Router();
var authenticate = require("../authenticate");
const Favorites = require("../models/favorites");
const cors = require("./cors");

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .populate("user")
      .populate("dishes")
      .then(
        favorites => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorites);
        },
        err => {
          next(err);
        }
      )
      .catch(err => {
        next(err);
      });
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then(favorites => {
        if (favorites) {
          req.body.forEach(fav => {
            if (favorites.dishes.indexOf(fav._id) === -1) {
              favorites.dishes.push(fav._id);
            }
          });
          favorites
            .save()
            .then(favorites => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorites);
            })
            .catch(err => next(err));
        } else {
          favorite = new Favorites({ user: req.user._id });
          favorite.dishes = [];
          req.body.forEach(fav => {
            favorite.dishes.push(fav._id);
          });
          favorite
            .save()
            .then(favorites => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorites);
            })
            .catch(err => next(err));
        }
      })
      .catch(err => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation does not work on /favorites");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then(favorites => {
        if (favorites) {
          favorites
            .remove()
            .then(favorites => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorites);
            })
            .catch(err => next(err));
        } else {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorites);
        }
      })
      .catch(err => next(err));
  });

favoriteRouter
  .route("/:dishId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then(
        favorites => {
          if (!favorites) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            return res.json({ exists: false, favorites: favorites });
          } else {
            if (favorites.dishes.indexOf(req.params.dishId) < 0) {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              return res.json({ exists: false, favorites: favorites });
            } else {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              return res.json({ exists: true, favorites: favorites });
            }
          }
        },
        err => next(err)
      )
      .catch(err => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then(favorites => {
        if (favorites) {
          if (favorites.dishes.indexOf(req.params.dishId) === -1) {
            favorites.dishes.push(req.params.dishId);
            favorites
              .save()
              .then(resp => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(resp);
              })
              .catch(err => next(err));
          } else {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorites);
          }
        } else {
          favorite = new Favorites({ user: req.user._id });
          favorite.dishes = [];
          favorite.dishes.push(req.params.dishId);
          favorite
            .save()
            .then(resp => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(resp);
            })
            .catch(err => next(err));
        }
      })
      .catch(err => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("GET operation does not work on /favorites" + req.params.dishId);
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then(favorites => {
        if (favorites) {
          var index = favorites.dishes.indexOf(req.params.dishId);
          if (index >= 0) {
            favorites.dishes.splice(index, 1);
          }
          favorites
            .save()
            .then(favorite => {
              Favorites.findById(favorite._id)
                .populate("user")
                .populate("dishes")
                .then(favorite => {
                  console.log("Favorite Dish Deleted Forever!  Or at least for now.", favorite);
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(favorite);
                });
            })
            .catch(err => next(err));
        } else {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorites);
        }
      })
      .catch(err => next(err));
  });

module.exports = favoriteRouter;
