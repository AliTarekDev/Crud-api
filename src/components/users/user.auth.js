const User= require('./user.model');
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
const {catchAsyncError}= require('../../utils/catchAsync');
const AppError= require('../../utils/appError');

//SignUp
exports.signUp= catchAsyncError(async (req,res,next)=> {
    const {email,password}= req.body;
    const exstUser= await User.findOne({email});

    exstUser && next(new AppError("User already exists !"));

    let hash= await bcrypt.hash(password, 8)

    let user= new User({email, password: hash});

    user= await user.save()

    !user && next(new AppError("User cannot be added !"));

    user && res.status(201).json({message: "New User added !", user});
});



//Loign 
exports.Login= catchAsyncError(async (req,res,next)=> {
    const {email, password}= req.body;

    let userExst= await User.findOne({email})

    console.log(userExst);

    !userExst && next(new AppError("Cannot find Email !", 404));

    let check=await bcrypt.compare(password, userExst.password);

    !check && next(new AppError("Invalid Password !", 404));

    let token= jwt.sign({email: userExst.email,id: userExst._id}, process.env.KEY, {expiresIn: '1h'});

    res.status(200).json({message: "user Authenticated", token, expires: 3600})
});


//Handle Authentication 

exports.protectedRoutes= catchAsyncError(async (req,res,next)=> {
    let checkHeader= req.headers.authorization;

    if(!checkHeader) return next(new AppError("User not Authenticated, Login please", 404));

    let token= checkHeader.split(" ")[1];

    if(!token) return next(new AppError("User not Authenticated, Login please", 404));

    let decoded= await jwt.verify(token, process.env.KEY);

    let user= await User.findById(decoded.id);

    !user && next(new AppError("cannot find User", 404));

    req.user= user;

    next()
})