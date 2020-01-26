const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);

var favoriteSchema = new Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    dishes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dishes",
      required: true
    }
  },
  {
    usePushEach: true,
    timestamps: true
  }
);

var Favorites = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorites;
