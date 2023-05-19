const mongoose = require("mongoose");

const AddressSchema = mongoose.Schema({
  accountno: Number,
  type: String
});

const BuffetSchema = new mongoose.Schema(
  {
    buffetname: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    platecount: {
      type: String,
      required: false,
    },
    bookingdate: {
      type: String,
      required: true,
    },
    bankdetails:{
      type: AddressSchema,
      // required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Buffet", BuffetSchema);
