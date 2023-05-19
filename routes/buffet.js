const router = require("express").Router();
const Buffet = require("../models/Buffet");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const errorHandler = require("../utils/errorHandler");
const Validator = require('../validation/validators');

//REGISTER
router.post("/register", async (req, res, next) => {
  try {
    /* Check the password */
   console.log(req.body.phone);
   const passCheck  = Validator.validatePassword(req.body.password);
   const emailCheck = Validator.validateEmail(req.body.email);
   const phoneCheck = Validator.validatePhone(req.body.phone);

   const duplicate = await User.find({ email:  req.body.email }).exec();

   if (duplicate.length>0){
     //console.log(duplicate);
     const error = new Error('Email already exists');
     error.statusCode = 409;
    // throw error;
     next(error);
   }
 
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPass,
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});
//REGISTER
router.post("/book", async (req, res, next) => {
  try {
    console.log(req.body.buffetname);
    const newBuffet = new Buffet({
      buffetname: req.body.buffetname,
      email: req.body.emailId,
      platecount: req.body.platecount,
      bookingdate: req.body.bookedOn
      // bankdetails: {
      //   accountno: req.body.accountno,
      //   type: req.body.accounttype,
      // },
    });

    const buffet = await newBuffet.save();
    res.status(200).json(buffet);
  } catch (err) {
    //res.status(500).json(err);
    err.message = "Something went wrong seriously";
    err.statusCode =501;

    next(err);
  }
});

// router.get("/maxval", async (req, res) => {
//   try {
//     const user = await Buffet.findOne({'bankdetails.accountno': 1 }).sort('-LAST_MOD').exec();
//     res.status(200).json(user);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

router.get("/maxval", async (req, res) => {
  try {
    const user = await Buffet.findOne({}).sort({'bankdetails.accountno':'desc'}).exec();
    // const user = await Buffet.aggregate(
    //   [
    //      {"$group": {_id: "$bankdetails.accountno"}},
       
    //     // {"$sort":{"bankdetails.accountno": -1}},
    //     // {"$limit":1}
    //   ]
    // )

    // const user2 = await Buffet.TopVal.find();

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});


// get the buffet
router.get("/booking/:id", async (req, res,next) => {

  try {
    const hotel = await Buffet.findById(req.params.id);
    console.log("fsdfs"+hotel);
    if(hotel===null){
      res.status(200).json({"status":"fail"});
    }else{
      res.status(200).json(hotel);
    }  
  } catch (err) {
    next(err);
  }
});
// update buffet

router.put("/booking/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const updatedHotel = await Buffet.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    res.status(500).json(err);
  }

});

// delete
router.delete("/booking/:id", async (req, res,next) => {
  try {
    const hotel = await Buffet.findById(req.params.id);
    
    if(!hotel){
      res.status(200).json({"status":"fail"});
    }
    await Buffet.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel has been deleted.");
  } catch (err) {
    next(err);
  }
});

// Get all buffets
router.get("/all-buffets", async (req, res,next) => {

  try {
    const hotel = await Buffet.find();
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