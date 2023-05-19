const mongoose = require("mongoose");


const CustomerrSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    contactNumber: {
        
        type: Number,
        required: true,
          
    },
    address: {
        type: String,
        required: true
    },
    bookings: [{
        flightNumber: { 
          type: String 
        },
        baggage: { 
          type: Number 
        },
        fare: { 
          type: Number 
        },
        date: { 
            type: Date
        }
      }]
      
},
  { timestamps: true }
);

module.exports = mongoose.model("Customerr", CustomerrSchema);
