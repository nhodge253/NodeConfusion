const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);

var leaderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    image: {
      type: String,
      required: true
    },
    designation: {
      type: String,
      required: true
    },
    abbr: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      required: true
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    usePushEach: true,
    timestamps: true
  }
);

var Leaders = mongoose.model("Leader", leaderSchema);

module.exports = Leaders;
