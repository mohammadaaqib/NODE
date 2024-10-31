const userModel=require("./../Models/userModel");

exports.signUp=async(req,res,next)=>{
    try{

        const user=await userModel.create(req.body);
        res.status(201).json({
            status:"success",
            data:{
                user:user
            }
        })
    }catch(err){

        res.status(404).json({
            status: "Fail",
            message: err.message,
          });


    }


}