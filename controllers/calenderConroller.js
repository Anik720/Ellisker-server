const Calender = require('../models/calenderModel');
exports.getAlldate = async (req, res, next) => {
  try {
    const calender = await Calender.find();

    res.status(200).json({
      message: 'Success',
      data: {
        calender,
      },
    });
  } catch (err) {
    res.status(404).json({
      message: 'failed',
    });
  }
};

exports.careteCalender = async (req, res) => {
  try {
    const date = req.body.value.substr(0, 10);
    const date9 = req.body.value.substr(0, 10);
    console.log("data", date)
    const date1=date.substr(8,2)
   
    

    console.log("data1", date1)
    const data2=parseInt(date1)+1
    console.log("data2",data2)
   var data3=''
    if(data2.toString().length===1 ||data2.toString().length===2){
      if(data2.toString().length===2){
        data3=data2
      
      } 
      if(data2.toString().length===1){
        console.log(data2.toString().length)
        data3='0'+data2
      }
      
    }
    console.log("newdaa", data3)
const u=date9.split('')

 const k=data3.toString().split('')
 console.log(k)
for(var i=0;i<u.length;i++){
  
  if(i===8){
    u[i]=k[0]
  }
  if(i===9){
    u[i]=k[1]
  }
}
console.log("newdaata", u.join(''))
    const newDate=date.replace(date.substr(8,2),data3)
     //console.log("newdaat", newDate)
   
    const time = req.body.value.substr(11, 5);
  
    const calender = await Calender.create({date:u.join(''), time });
    console.log(calender);
    res.status(201).json({
      status: 'success',
      data: {
        calender,
      },
    });
  } catch (err) {
    res.status(404).json({
      message: 'failed',
    });
  }
};

exports.deleteDate = async (req, res, next) => {
  const date = await Calender.findByIdAndDelete(req.params.id);
  console.log(req.params);
  // if (!service) {
  //   return next(new AppError('No service found with that ID', 404));
  // }

  res.status(204).send({date});
};


exports.updateDate = async (req, res, next) => {
  console.log(req.params.id)
  const item=req.body.newData
  const service = await Calender.findByIdAndUpdate(req.params.id, item, {
    new: true,
    runValidators: true
  });
  console.log(service)
  // if (!service) {
  //   return next(new AppError('No service found with that ID', 404));
  // }

  res.status(200).json({
    status: 'success',
    data: {
      service
    }
  });
};