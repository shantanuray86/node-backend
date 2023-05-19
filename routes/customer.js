const router = require("express").Router();
const Customer = require("../models/Customer");

router.post("/account", async (req, res, next) => {
    try {
      console.log(req.body.buffetname);
      const newCustomer = new Customer({
        CustomerName:{
            firstname:req.body.firstname,
            lastname:req.body.lastname,
        },
        PersonalDetails:{
            gender:req.body.gender,
            dob:req.body.dob,
        },
        Contact:{
          email:req.body.email,
          phone:req.body.phone
        },
        KycCheck:req.body.KycCheck,
        Income:req.body.Income,
        LoanDetails:[
          {
            loanNumber:req.body.loanNumber,
            type:req.body.type,
            interest:req.body.binterest,
            amount:req.body.amount,
            tenure:req.body.tenure,
        }
      ],
        AccountDetails:[
            {
            accNumber:req.body.accNumber,
            accType:req.body.accType,
            interest:req.body.interest,
            balance:req.body.balance,
            branch:req.body.branch,
          }
        ]
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
// Get one value
router.put("/account/update/:id", async (req, res,next) => {

  try {
    const hotel = await Customer.updateOne(
      { _id: req.query.id},
      { $set:
        {
          'CustomerName.firstname': req.body.firstname,
          'CustomerName.lastname': req.body.lastname,
          'PersonalDetails.gender': req.body.gender,
          'Contact.email': req.body.email,
        }
     }
    )
    if(hotel===null){
      res.status(200).json({"status":"fail"});
    }else{
      res.status(200).json(hotel);
    }  
  } catch (err) {
    next(err);
  }
});
// update query

router.get("/account/update/:id", async (req, res,next) => {

  try {
    console.log(req.params.id);
    const hotel = await Customer.findOne(
      {_id:req.params.id }
  )
    if(hotel===null){
      res.status(200).json({"status":"fail"});
    }else{
      res.status(200).json(hotel);
    }  
  } catch (err) {
    next(err);
  }
});
// Get all buffets
router.get("/account/", async (req, res,next) => {

    try {
      const hotel = await Customer.find();
      if(hotel===null){
        res.status(200).json({"status":"fail"});
      }else{
        res.status(200).json(hotel);
      }  
    } catch (err) {
      next(err);
    }
  });


// Get all buffets
router.get("/account/income", async (req, res,next) => {

  try {
   // const hotel = await Customer.find({Income:{$gt:500000,$lt:1000000}},{Income:1,'CustomerName.firstname':1});
    const hotel = await Customer.find({Income:{$gte:500000,$lte:1000000}},{Income:1,'CustomerName.firstname':1});
    if(hotel===null){
      res.status(200).json({"status":"fail"});
    }else{
      res.status(200).json(hotel);
    }  
  } catch (err) {
    next(err);
  }
});


// Get all buffets
router.get("/account/email/empty", async (req, res,next) => {

  try {
    const hotel = await Customer.find({$and:[{'Contact.email':{$exists:false}}]},{_id:1,CustomerName:1,'Contact.email':1})
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
Retrieve the customer ID of the customet whiose firstname starts with Tanek(case-sensitive)

*/
router.get("/account/retrieve", async (req, res,next) => {

  try {
    const hotel = await Customer.find({'CustomerName.firstname':/^Tanek/},{_id:1,'CustomerName.firstname':1})
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
Retrieve the customer ID and Acc Details of the customet who have acctype-"Savings" in branch ElMonte

*/
router.get("/account/retrieve/branch", async (req, res,next) => {

  try {
    const hotel = await Customer.find({'AccountDetails.branch':"El Monte",'AccountDetails.accType':"S"},{_id:1,AccountDetails:1})
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
Retrieve the customerID, customerName and loandetails of the customers who have taken only load
*/
router.get("/account/retrieve/loan", async (req, res,next) => {

  try {
    const hotel = await Customer.find({'LoanDetails':{$size:1}},{_id:1,LoanDetails:1,'CustomerName.firstname':1})
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

$and---->
db.employees.find({
  $and:[
    {department: {$in :["ETA","IVS"]}},
    {salary:{$gt:3000}}
  ]},{empName:1, department:1, salary:1, _id:0})
  
})

$or---->
db.employees.find({
  $or:[
    {department: {$in :["ETA","IVS"]}},
    {salary:{$gt:3000}}
  ]},{empName:1, department:1, salary:1, _id:0})
  
})


*/

/*
Retrieve the sutomerID and CustomerName who have born(use dob field) in the year 1991 in the descending 
order of Customer name.
Example result:----
{"customerID":58965874,
  "customerName":{
    "firstname":"Tom",
    "lastName":"jake"
  }
}
*/
router.get("/account/retrieve/dob", async (req, res,next) => {

  try {
    const hotel = await Customer.find({'PersonalDetails.dob':{$gt:new Date('1990'),$lt:new Date('1992')}},{CustomerName:1,PersonalDetails:1}).sort( { "CustomerName.firstname": -1 } );
    
  //   const hotel = await Customer.aggregate(
  //     [
  //       {
  //         $project:
  //           {
  //             year: { $year: "$PersonalDetails.dob" },
             
             
  //           }
  //       }
        
  //     ]
  //  );

  // another try
//   const hotel = await Customer.aggregate(
//     [
      
         
//           {$year: "$PersonalDetails.dob" },
//            { $match: { "$PersonalDetails.dob": "1991" }
//           }
      
      
//     ]
//  );


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
Output each element of accDetails as a separate document along with customerid and customerName only in 
a new collection named "customerDetails"

"customerDetails":{
  "customerId":6857485256,
  "customerName":{
    "firstName":"Tom",
    "lastName":"jake"
  },
  "accDetails":{
    "accNum":"45345435",
    "accType":"savings",
    "branch":"vorst",
    "interest":0.9,
    "balance":7578575
  }
}
*/



  router.get("/account/retrieve/collection", async (req, res,next) => {

    try {
      const hotel = await Customer.aggregate(
            [
              {
                $project:
                  {
                    customerDetails: {customerName:"$CustomerName",accDetails:"$AccountDetails"},
                   
                   
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
Retrieve the average account balance (use AvgAccBal as alias) 
for each acctype that have balance >= 100000

output --
{"_id":"savings", "AvgAccBal":99}
*/


/*
$unwind
Deconstructs an array field from the input documents to output a document for each element. 
Each output document is the input document with the value of the array field replaced by the element.
*/
router.get("/account/retrieve/average/balance", async (req, res,next) => {

  try {
    const hotel = await Customer.aggregate(
          [
             
            //{ $match : { Income: { $gt: 100 } } },
            {$unwind : "$AccountDetails"},  // it takes out the elements in an array and makes a single array.
            { $match: { 'AccountDetails.balance': {$gt: 100} }},
            {
              $group:
                {
                  _id: '$AccountDetails.accType', 
                  "AvgAccBal" :{$avg :  "$AccountDetails.balance"},
                  //balanceAvg: { "$avg":{$first: "$AccountDetails.balance" }},
                              
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
Retrieve the total sum(use totalLoAmount as alias) of loan amount according to loan type

output---
{"_id":"house","TotalAmount":99}
*/
router.get("/account/retrieve/loan/sum", async (req, res,next) => {

  try {
    const hotel = await Customer.aggregate(
          [
             

            {$unwind : "$LoanDetails"},  // it takes out the elements in an array and makes a single array.

            {
              $group:
                {
                  _id: '$LoanDetails.type', 
                  "AvgAccBal" :{$sum :  "$LoanDetails.amount"},            
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
Display along with "_id" a new field "custName" by concatenating customer firstname
and customer lastname with blank space as the delimiter between fields
*/

router.get("/account/retrieve/custname", async (req, res,next) => {

  try {
    const hotel = await Customer.aggregate(
          [
            {
              $project:
                {
                  custName: {$concat: [ '$CustomerName.firstname',' ', '$CustomerName.lastname' ]},
                 
                 
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
For those members who have not completed their KYC check(KYCcheck=false), remove the nationalIDNum 
field from their document
*/
module.exports = router;