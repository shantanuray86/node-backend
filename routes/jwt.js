const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const checkUserAuth = require('../middlewares/auth-middleware')
require('dotenv').config();
//REGISTER
router.post("/register", async (req, res) => {
    try {
      /* Check the password */
    // console.log(req.body.firstname);
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(req.body.password, salt);
      const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPass,
        phone:req.body.phone
      });
  
      const user = await newUser.save();
       
        const accessToken = jwt.sign(
            { "email": user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );
        const refreshToken = jwt.sign(
            { "username": user.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
         res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: false, maxAge: 24 * 60 * 60 * 1000 });
     //res.json(user );
        res.status(200).json({accessToken,user});
    } catch (err) {
      res.status(500).json(err);
    }
});



// const User = require('../models/User')
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')

// @desc Login
// @route POST /auth
// @access Public

router.post("/login", async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await User.findOne({ email }).exec()

    if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized!!!!!!' })
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) return res.status(401).json({ message: 'Unauthorized' })

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "email": foundUser.email
                // "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15s' }
    )

    const refreshToken = jwt.sign(
        { "email": foundUser.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    )

    // Create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: false, //https true 
        sameSite: 'None', //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })

    // Send accessToken containing username and roles 
    res.json({ accessToken })
});

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired

router.post("/refresh", async (req, res) => {
    const cookies = req.cookies;
    console.log(req.cookies);
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized!!!!!' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ username: decoded.username }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        }
    )
});

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists

router.post("/refresh", async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: false })
    res.json({ message: 'Cookie cleared' })
});

router.get("/checkoutauth", checkUserAuth, async(req,res)=>{
    
    res.json({"hello":req.user});
});

router.get("/checktokenvalidity", async(req,res)=>{
    token = authorization.split(' ')[1]

    // Verify Token
    const { email } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ email: decoded.email }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            res.json({ 'status':200, 'message':'authorized' })
        }
    )
})




module.exports = router;