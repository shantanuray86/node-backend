const router = require("express").Router();
const Buffet = require("../models/Buffet");
const User = require("../models/User");
const Flight = require("../models/Flight");
const Airport = require("../models/Airport");
const Customerr = require("../models/Customerr");
const bcrypt = require("bcrypt");
const errorHandler = require("../utils/errorHandler");
const Validator = require('../validation/validators');


//REGISTER airport
router.post("/register/airport", async (req, res, next) => {
  try {
    
    const newAirport = new Airport({
        name: req.body.name,
        address: req.body.address,
        facilities: req.body.facilities,
        geo: {
            alt: req.body.alt,
            lat: req.body.lat,
            lon: req.body.lon
        },
    });

    const buffet = await newAirport.save();
    res.status(200).json(buffet);
  } catch (err) {
    //res.status(500).json(err);
    err.message = "Something went wrong seriously";
    err.statusCode =501;

    next(err);
  }
});



//REGISTER flight
router.post("/register/flight", async (req, res, next) => {
    try {
      
      const newFlight = new Flight({
        flightNumber: req.body.flightNumber,
        sourceAirport: {
            name: req.body.name,
            city: req.body.city
        },
        STDdepartureTime: req.body.STDdepartureTime,
        ESTdepartureTime: req.body.ESTdepartureTime,

        destinationAirport: {
            name: req.body.destinationAirportname,
            city: req.body.destinationAirportcity
        },
        STDarrivalTime: req.body.STDarrivalTime,
        ESTarrivalTime: req.body.ESTarrivalTime,

        capacity: req.body.capacity,
        arrivalStatus: req.body.arrivalStatus,

        departureStatus: req.body.departureStatus
          
      });
  
      const buffet = await newFlight .save();
      res.status(200).json(buffet);
    } catch (err) {
      //res.status(500).json(err);
      err.message = "Something went wrong seriously";
      err.statusCode =501;
  
      next(err);
    }
  });


  //REGISTER customer
router.post("/register/customer", async (req, res, next) => {
  try {
    
    const newCustomer = new Customerr({
        name: req.body.name,
        contactNumber: req.body.contactNumber,
        address: req.body.address,
        bookings: req.body.bookings
    });

    const buffet = await newCustomer.save();
    res.status(200).json(buffet);
  } catch (err) {
    //res.status(500).json(err);
    err.message = "Something went wrong seriously";
    err.statusCode =501;

    next(err);
  }
});

//flight number with least number of booking-
router.get("/leastnumber/customer", async (req, res,next) => {

  try {
    const hotel = await Customerr.aggregate(
          [
             

            {$unwind : "$bookings"},  // it takes out the elements in an array and makes a single array.
            
           
            {
              $group:
                {
                  _id: '$bookings.flightNumber',
                  FlightCount: { $sum: 1  }
                            
                }


             },
             { $sort: { FlightCount: 1 } },

             {$limit:1}
            
          ]
       );
    if(hotel===null){
      res.status(200).json({"status":"fail"});
    }else{
      res.status(200).json(hotel);
    }  
  } catch (err) {
    next(err);
  }
}); 

//most preferred flight by customer having customer name Jacob Eagle
router.get("/preferred-flight/customer", async (req, res,next) => {

  try {
    const hotel = await Customerr.aggregate(
          [
             
            { $match : { name : "jacob john" } },
            {$unwind : "$bookings"},  // it takes out the elements in an array and makes a single array.
            
           
            {
              $group:
                {
                  _id: '$bookings.flightNumber',
                  FlightCount: { $sum: 1  }
                            
                }


             },
             { $sort: { FlightCount: -1 } },

             {$limit:1}
            
          ]
       );
    if(hotel===null){
      res.status(200).json({"status":"fail"});
    }else{
      res.status(200).json(hotel);
    }  
  } catch (err) {
    next(err);
  }
}); 



/*Retrieve the average fare spent by each customer and store the output in another collection name
"AvgFare"

*/
router.get("/avg-fare/customer", async (req, res,next) => {

  try {
    const hotel = await Customerr.aggregate(
          [
             
           
            {$unwind : "$bookings"},  // it takes out the elements in an array and makes a single array.
            
           
            {
              $group:
                {
                  _id: null,
                  AverageFare: {  $avg: "$bookings.fare" }
                            
                }


             }
            
          ]
       );
    if(hotel===null){
      res.status(200).json({"status":"fail"});
    }else{
      res.status(200).json(hotel);
    }  
  } catch (err) {
    next(err);
  }
});

/*
Retrieve the average fare spent by each customer and store the output in another collection name
"AvgFare"
*/
router.get("/avg-fare-two/customer", async (req, res,next) => {

  try {
    const hotel = await Customerr.aggregate(
          [
             
           
            {$unwind : "$bookings"},  // it takes out the elements in an array and makes a single array.
            
           
            {
              $group:
                {
                  _id: "$_id",
                  AverageFare: {  $avg: "$bookings.fare" }
                            
                }


             }
            
          ]
       );
    if(hotel===null){
      res.status(200).json({"status":"fail"});
    }else{
      res.status(200).json(hotel);
    }  
  } catch (err) {
    next(err);
  }
});


/*
Find the most frequently travelling customer based on the _id field of customer collection. Use 
totalbooking as alias wherever necessary
*/
router.get("/frequently-travelling/customer", async (req, res,next) => {

  try {
    const hotel = await Customerr.aggregate(
          [
             
           
            {$unwind : "$bookings"},  // it takes out the elements in an array and makes a single array.
            
           
            {
              $group:
                {
                  _id: "$_id",
                  TotalBooking: { $sum: 1  }
                            
                }


             },
             { $sort: { TotalBooking: -1 } },

             {$limit:1}
            
          ]
       );
    if(hotel===null){
      res.status(200).json({"status":"fail"});
    }else{
      res.status(200).json(hotel);
    }  
  } catch (err) {
    next(err);
  }
});

/*
All the airports operating in "Bellendre city" are non operational as it is shifted to a 
new location. Delete the documents corresponding to "Bellendre City" airport.



mongod> use example
switched to db example
example> db.Airport.deleteOne( { name: "San Francisco Airport" } )
{ acknowledged: true, deletedCount: 0 }
example> db.airports.deleteOne( { name: "San Francisco Airport" } )
{ acknowledged: true, deletedCount: 1 }
example> db.airports.deleteOne( { address: { $regex: /^San Francisco/ } } )
{ acknowledged: true, deletedCount: 1 }

*/

router.get("/delete-airport/airport", async (req, res,next) => {

  try {
    //await Airport.deleteMany({ name: "Bellendre City" });
    const deletedval = await Airport.deleteMany({ address: { $regex: /^Bellendre City/ } });
    if(deletedval.deletedCount){
      res.status(200).json({msg:"Airport has been deleted...",action:deletedval});
    }else{
      res.status(200).json({msg:"No record Found"});
    }
    
  } catch (err) {
    next(err);
  }
});

/*
For airports located at a latitude lat>45 add another facility "reserved seating"
Note -  Make sure that the facility is unique while adding
*/
router.get("/update-facility/airport", async (req, res,next) => {

  try {
    const updatedtedval = await Airport.updateMany({ "geo.lat":{$gt:45}}, {$addToSet :{"facilities":"reserved seating"}} );
    
    
    if(updatedtedval.nModified){
      res.status(200).json({msg:"Airport facility has been update...",action:updatedtedval});
    }else{
      res.status(200).json({msg:"No record Found"});
    }
    
  } catch (err) {
    next(err);
  }
});


/*
A customer with _id=1000985 has booked another flight . update his booking with the following
{
  flightNumber: "UA276",
  baggage: 10,
  fare: 350,
  date: "2019-03-04"
}
*/

router.get("/update-booking/customerr", async (req, res,next) => {

  try {
    const updatedtedval = await Customerr.updateOne({ "_id":"64367c76d0cbbd1ec844689e"}, {$push :{"bookings":{
      flightNumber: "UA276",
      baggage: 10,
      fare: 350,
      date: "2019-03-04"
    }}} );
    
    
    if(updatedtedval.nModified){
      res.status(200).json({msg:"Customerr facility has been update...",action:updatedtedval});
    }else{
      res.status(200).json({msg:"No record Found"});
    }
    
  } catch (err) {
    next(err);
  }
});


/*
Retrieve the flight details that have the capacity greater than 250 and the 
departurestatus ="on time"
*/

router.get("/capacity-departurestatus/flight", async (req, res,next) => {

  try {
  
    const hotel = await Flight.find({capacity:{$gte:250},departureStatus:'on time'});
    if(hotel===null){
      res.status(200).json({"status":"fail"});
    }else{
      res.status(200).json(hotel);
    }  
  } catch (err) {
    next(err);
  }
});


/*
Retrieve the total number of flights from paris to honolulu city
output- it should be just a number 99
*/

router.get("/paris-honolulu/flight", async (req, res,next) => {

  try {
  
    const hotel = await Flight.find({"sourceAirport.city":"San Francisco","destinationAirport.city":"New York"}).count();
    if(hotel===null){
      res.status(200).json({"status":"fail"});
    }else{
      res.status(200).json(hotel);
    }  
  } catch (err) {
    next(err);
  }
});


/*
Find the airports that provide both "self-service checkin" and "cubside checkin" facilities
db.inventory.find( { quantity: { $in: [ 5, 15 ] } }, { _id: 0 } )
*/

router.get("/facilities/airport", async (req, res,next) => {

  try {
  
    const hotel = await Airport.find( { facilities: { $in: [ "self service checkin", "cubside checkin" ] } }, { _id: 0 } );
    if(hotel===null){
      res.status(200).json({"status":"fail"});
    }else{
      res.status(200).json(hotel);
    }  
  } catch (err) {
    next(err);
  }
});

module.exports = router;