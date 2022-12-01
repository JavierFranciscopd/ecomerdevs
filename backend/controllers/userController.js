const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto")


//Registro de usuario

exports.registerUser = catchAsyncErrors( async(req,res,next)=>{

    const {name,email,password} = req.body
    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:"Esto es un Id de ejemplo",
            url:"url perfil"
        }
    });

    sendToken(user,201,res);
});

// Usuario de inicio de sesión
exports.loginUser = catchAsyncErrors (async (req,res,next)=>{

    const {email,password} = req.body;

    // checking if user has given password and email both

    if(!email || !password){
        return next(new ErrorHander("Ingrese el correo electrónico y la contraseña", 400))
    }

    const user = await User.findOne({ email }).select("+password");

    if(!user){
        return next(new ErrorHander("Correo electrónico o contraseña no válidos", 401));
    }

    const isPasswordMatched = user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHander("Correo electrónico o contraseña no válidos", 401));
    }

    sendToken(user,200,res);
});


// Logout User

exports.logout = catchAsyncErrors(async(req,res,next)=>{
   
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly: true,
    })

    res.status(200).json({
        success:true,
        message: "Desconectado",
    });
});

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{
    
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHander("Usuario no encontrado", 404));
    }

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false });


    const resetPasswordUrl = `${req.protocol}://${req.get(
        "host"
        )}/api/v1/password/reset/${resetToken}`;

        const message = `Su token de restablecimiento de contraseña es :- \n\n ${resetPasswordUrl} \n\nSi no has solicitado este correo
        Entonces, por favor ignóralo `;

        try {
            await sendEmail({
                email:user.email,
                subject:`Recuperación de contraseña de comercio electrónico`,
                message,
            });

            res.status(200).json({
                success:true,
                message:`Email enviado a ${user.email} exitosamente`,
            });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({validateBeforeSave: false });

            return next(new ErrorHander(error.message, 500));
        }
});


// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next)=> {

    // creating token hash
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if(!user){
        return next(new ErrorHander("El token de restablecimiento de contraseña no es válido o ha caducado", 
        400
        )
        );
    }
    
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHander("Contraseña no contraseña", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
    
});

// Get User Detail
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
  
    res.status(200).json({
      success: true,
      user,
    });
  });