const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    CustomerName: {
      "firstname": String,
      "lastname": String,
    },
    PersonalDetails:{
      "gender":String,
      "dob":Date
    },
    Contact:{
      "email":String,
      "phone":Number
    },
    Income:{type:Number},
    KycCheck:{type: Boolean,default:false},
    LoanDetails:[
      {
      "loanNumber":{ 
        type: String
      },
      "type":{ 
        type: String
      },
      "interest":{ 
        type: Number
      },
      "amount":{ 
        type: Number
      },
      "tenure":{ 
        type: Number
      },
    }
  ],
  AccountDetails:[
      {
      "accNumber":{ 
        type: String,
        required: true
      },
      "accType":{ 
        type: String,
        required: true
      },
      "interest":{ 
        type: String,
        required: true
      },
      "branch":{ 
        type: String
      },
      "balance":{ 
        type: Number,
        required: true
      },
    }
  ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", CustomerSchema);