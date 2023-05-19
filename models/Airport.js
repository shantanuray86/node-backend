const mongoose = require("mongoose");


const AirportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    address: {
        
        type: String,
        required: true,
          
    },
    geo: {
        
        alt: { 
          type: Number 
        },
        lat: { 
          type: Number 
        },
        lon: { 
          type: Number 
        }
      
    },
    facilities: {type:Array},
      
},
  { timestamps: true }
);
/*
mongod> use example
switched to db example
example> db.Airport.deleteOne( { name: "San Francisco Airport" } )
{ acknowledged: true, deletedCount: 0 }
example> db.airports.deleteOne( { name: "San Francisco Airport" } )
{ acknowledged: true, deletedCount: 1 }
example> db.airports.deleteOne( { address: { $regex: /^San Francisco/ } } )
{ acknowledged: true, deletedCount: 1 }
*/
module.exports = mongoose.model("Airport", AirportSchema);
