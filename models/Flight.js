const mongoose = require("mongoose");


const FlightSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: String,
      required: true,
      unique: true,
    },
    sourceAirport: {
        
            name: { 
              type: String 
            },
            city: { 
              type: String 
            }
          
    },
    STDdepartureTime: {
      type: String,
      required: false,
    },
    ESTdepartureTime: {
      type: String,
      required: true,
    },
    destinationAirport: {
        
        name: { 
          type: String 
        },
        city: { 
          type: String 
        }
      
    },
    STDarrivalTime: {
    type: String,
    required: false,
    },
    ESTarrivalTime: {
    type: String,
    required: true,
    },
    capacity: {
        type: String,
        required: true,
    },
    arrivalStatus: {
        type: String,
        required: true,
    },
    departureStatus: {
        type: String,
        required: true,
    }
    
},
  { timestamps: true }
);

module.exports = mongoose.model("Flight", FlightSchema);
