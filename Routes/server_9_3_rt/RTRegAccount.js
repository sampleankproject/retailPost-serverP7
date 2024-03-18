
const express = require('express')
const { getDistance } = require('geolib');
const jwt = require('jsonwebtoken');
const {nanoid} = require('nanoid')
const {customAlphabet} = require('nanoid/non-secure');
const Razorpay = require('razorpay');
const multer = require('multer')
const nodemailer = require('nodemailer');
const RoutesReg = express.Router()

const RTregFull = require('../../Models/RTReg_full');
const Rupload = require('../../Models/RImgUpload');
const distance = require('../../Models/distance');
const RtplnTy = require('../../Models/RtPln');
const RtplnTy2 = require('../../Models/RtPln2');
const transaction = require('../../Models/transcation');
const RTRnwl = require('../../Models/RtRnwl');
const RfRtCd = require('../../Models/RtRfCd');
const RtplnTy3 = require('../../Models/RtPln3');
const FailTrans = require('../../Models/TransFail');
const Rtpln0 = require('../../Models/RtPln0');
const RtInireq = require('../../Models/RtIniReq');

const nan1 = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',10)

const storageEngine = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./images2");
    },
    filename:(req,file,cb) =>{
        cb(null,Date.now()+nan1()+file.originalname);
    },
});
const upload = multer({storage:storageEngine});

RoutesReg.route('/RtRegFullData').post(upload.array('photo'),(req,res)=>{
    console.log(req.body)
    const id = nanoid()

    const nan2 = customAlphabet('0123456789ABDEFGHJKMNPQRTYabdefghjkmnpqrty',6)
    const Pw = nan2()
    var MyDate = new Date();
    const date = MyDate.getDate()+ '/'+(MyDate.getMonth()+1)+'/'+MyDate.getFullYear()
    const MyDateStringOne = MyDate.getFullYear() + ('0' + (MyDate.getMonth()+1)).slice(-2)  +('0' + MyDate.getDate()).slice(-2);
    const Mydate3 = new Date();         // ISO date 1

    const num1 = 10;
    const MyDate5 = new Date();
    MyDate5.setDate(MyDate5.getDate() + (num1-1));
    const date2 = MyDate5.getDate()+ '/'+(MyDate5.getMonth()+1)+'/'+MyDate5.getFullYear()
    const MyDateStringTwo = MyDate5.getFullYear() + ('0' + (MyDate5.getMonth()+1)).slice(-2)  +('0' + MyDate5.getDate()).slice(-2);


   
    const Mydate4 = new Date();         // ISO date 2
    Mydate4.setDate(Mydate4.getDate()+(num1-1)) 
    Mydate4.setHours(0,0,0,0)

    RTregFull.find({RtMlId:req.body.RtMlId},(err,result81)=>{
        if(err){
            console.log(err)
        }else{
            if(result81.length === 0){
                RTregFull.find({RtUnm:req.body.RtUnm},(err,result71)=>{
                    if(err){
                        console.log(err)
                    }else{
                        if(result71.length === 0){
                            RtplnTy.find({FieldOne:req.body.RtPlnTy},(err,result)=>{
                                if(err){
                                    console.log(err)
                                }else{
                                    if(result.length > 0){           
                                        distance.find({fieldOne:"XYZ"},(err,result41)=>{
                                            if(err){
                                                console.log(err)
                                            }else{
                                                // res.json(result)
                                                // console.log(result)
                                    
                                                const DATAARR = result41[0].fieldTwo
                                                const arr = []
                                                const abc = JSON.parse(req.body.RtShCo)
                                                const abc2 = JSON.parse(req.body.RtShCo2)
                                                const abc3 = JSON.parse(req.body.RtPlnTyNm)
                                                console.log('Abc3')
                                                console.log(abc3)
                                                // console.log(DATAARR.length)
                                            
                                                for(let i=0;i<DATAARR.length; i++){
                                                    const distance2 = getDistance(
                                                        { latitude:abc.latitude, longitude:abc.longitude },
                                                        { latitude: DATAARR[i].latitude, longitude: DATAARR[i].longitude }
                                                    );
                                                    arr.push([distance2, DATAARR[i].C])
                                                    console.log('Distance')
                                                    console.log(distance2)
                                                }
                                            
                                                // console.log(arr)
                                                // console.log(arr[1])
                                            
                                                arr.sort((a,b)=>b[0]-a[0])
                                                // console.log(arr[1][1])
                                            
                                                //After sorting array of column value is displaying with array format
                                                // const xarray = [];
                                               const  xarray = arr.map(function(item){
                                                    return item[1]
                                                })
                                                // res.json(xarray)
                                                console.log(xarray)
                                                console.log(xarray[0])
                        
                                                const info = {
                                                    RtId:id,
                                                    RtShNm:req.body.RtShNm,
                                                    RtShBrcNm:req.body.RtShBrcNm,
                                                    RtUnm:req.body.RtUnm,
                                                    RtPwd:Pw,
                                                    RtUsrNm:req.body.RtUsrNm,
                                                    RtUsrTy:req.body.RtUsrTy,
                                                    RtUsrImg:req.files[0].filename,
                                            
                                                    RtUsrGnd:req.body.RtUsrGnd,
                                
                                                    RtUsrYob1:JSON.parse(req.body.RtUsrYob1),//// date 
                                                    RtUsrYob2:req.body.RtUsrYob2,///// ISO date 
                                                    RtUsrIdImg:[{img0:req.files[1].filename,img1:req.files[2].filename}],
                                                    RtUsrIdTy:req.body.RtUsrIdTy,
                                                    RtUsrIdNo:req.body.RtUsrIdNo,
                                                    RtLgImg1:req.files[5].filename,
                                                    RtLgImg2:req.files[6].filename,
                                                  
                                            
                                                    RtStrOpLvTy:"auto",
                                                    RtStrOpLvSt:"open",
                                                    RtStrOpD:JSON.parse(req.body.RtStrOpD),
                                                    RtStrOpN1:req.body.RtStrOpN1,
                                                    RtStrOpN2:req.body.RtStrOpN2,
                                                    RtStrOpN3:req.body.RtStrOpN3,
                                                    RtShIdImg:[{img0:req.files[3].filename,img1:req.files[4].filename}],
                                                    RtLcnTy:req.body.RtLcnTy,
                                                    RtLcnNo:req.body.RtLcnNo,
                                                    RtStrSpl:req.body.RtStrSpl,                          
                                                   
                                                    RtMlId:req.body.RtMlId,                
                                                    RtPhn:req.body.RtPhn,
                                                    RtCsMlId:req.body.RtCsMlId,
                                                    RtCsPhn:req.body.RtCsPhn,
                                                    RtTy1:req.body.RtTy1,
                                                    RtBrNm:req.body.RtBrNm,
                                                    RtTy2:req.body.RtTy2,
                                                  
                                            
                                                    RtStrDt1:'',    
                                                    RtStrDt2:'',    
                                                    RtStrDt3:'',    
                                                    RtExpDt1:date2, 
                                                    RtExpDt2:MyDateStringTwo,   
                                                    RtExpDt3:Mydate4,   
                                                    RtMnLm:result[0].FieldThree[0].MnLm,  
                                                    RtSbLm:result[0].FieldThree[0].SbLm,  
                                                    RtPlnDys:result[0].FieldThree[0].Dys,                
                                                    RtPlnAmt:result[0].FieldThree[0].FAmt,    
                                                    RtPlnTy:result[0].FieldTwo, 
                                                    RtPlnTyNm:abc3,
                                                    RtPlnNm:result[0].FieldThree[0].PlNm,   
                                                   
                                                  
                                                    RtShImg:[{img0:req.files[7].filename},{img0:req.files[8].filename},{img0:req.files[9].filename}],
                                            
                                                    RtShCo:[{latitude:abc.latitude,longitude:abc.longitude}],
                                                    RtShCo2:{type:"Point",coordinates:[abc2.latitude,abc2.longitude]},
                                                    RtShCoCd:xarray[0],
                                                    RtShCoLn:req.body.RtShCoLn,
                                                    RtPdAmt:'',
                                                    RtPdAmtDt:'',
                                                    RtPdAmtTm:'',
                                                    RtAcnSt:'NtActv',
                                                    RtRnwSt:'NtRenewed',
                                                    RtAcnBlkSt:'NtBlk',
                                                    RtAdr1:req.body.RtAdr1,
                                                    RtAdr2:req.body.RtAdr2,
                                                    RtAdr3:req.body.RtAdr3,
                                                    RtAdr4:req.body.RtAdr4,
                                                    RtAdr5:req.body.RtAdr5,
                                                    RtAdr6:req.body.RtAdr6,
                                                    RtAdr7:req.body.RtAdr7,
                                            
                                                    RtPin:req.body.RtPin,
                                                    RtHbl:req.body.RtHbl,
                                                    RtHbl2:req.body.RtHbl2,
                                                    RtHbl3:req.body.RtHbl3,
                                                    RtTlk:req.body.RtTlk,
                                                    RtTlk2:req.body.RtTlk2,
                                                    RtTlk3:req.body.RtTlk3,
                                                    RtDst:req.body.RtDst,
                                                    RtDst2:req.body.RtDst2,
                                                    RtSt:req.body.RtSt,
                                                    RtSt2:req.body.RtSt2,
                                                    RtLdMk:req.body.RtLdMk,
                                                    RtRefTy:'',
                                                    RtRefCd:req.body.RtRefCd,

                                                    RtRefCdUsg:'No',
                                                    RtRegTy:req.body.RtRegTy,
                                                    RtRegDt1:date,
                                                    RtRegDt2:MyDateStringOne,
                                                    RtRegDt3:Mydate3,
                                                    RtSlOrg:req.body.RtSlOrg,
                                                    RtSlOrgCd:req.body.RtSlOrgCd,
                                                    RtSlId:req.body.RtSlId,
                                                    RtSlRegTy:'Direct',
                                                    RtSlRegSts:'Started'
                                                }
                                                const data = RTregFull(info)
                                                    data.save()
                                                    .then(response=>{
                                                        console.log(response)
                                                        var transport = nodemailer.createTransport({
                                                            host:'smtp.gmail.com',
                                                            port:587,
                                                            secure:false,
                                                            auth: {
                                                                user:"ank66145@gmail.com",
                                                                pass:"nv123456abc#"
                                                            }
                                                        
                                                        })
                                                        var mailoption= {
                                                            from:"ank66145@gmail.com",
                                                            to:req.body.RtMlId,
                                                            subject:"Registered successfully,Password for Mobile Application",
                                                            text:`Registered successfully,your unique name is "${req.body.RtUnm}" and your password is "${Pw}".`
                                                        }
                                                        
                                                        transport.sendMail(mailoption,function(error,info){
                                                            if(error){
                                                                
                                                                console.log(error);
                                                            }else{
                                                                console.log("success"+info.response);
                                                            }
                                                        })
                                                        res.json('Successfully registered one')
                                                    })
                                                    .catch(err=>{
                                                        console.log(err)
                                                    })
                        
                                            }
                                        })
                        
                                    }
                                }
                            })
            
                        }else{
                            res.json('Unique name already exists')
                            console.log('Unique name already exists')
                        }
                    }
                })

            }else{
                res.json('Email already exists')
                console.log('Email already exists')
            }
        }
    })
    
})
const nan3 = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',10)
const storageEngine3 = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./images2");
    },
    filename:(req,file,cb) =>{
        cb(null,Date.now()+nan3()+file.originalname);
    },
});
const upload3 = multer({storage:storageEngine3});

RoutesReg.route('/RtRegFullDataTwo').post(upload3.array('photo'),(req,res)=>{
    console.log('rtregfulldata')
    // const id = nanoid()
    const nan2 = customAlphabet('0123456789ABDEFGHJKMNPQRTYabdefghjkmnpqrty',6)
    const Pw = nan2()
    var MyDate = new Date();
    const date = MyDate.getDate()+ '/'+(MyDate.getMonth()+1)+'/'+MyDate.getFullYear()
    const MyDateStringOne = MyDate.getFullYear() + ('0' + (MyDate.getMonth()+1)).slice(-2)  +('0' + MyDate.getDate()).slice(-2);
    const Mydate3 = new Date();         // ISO date 1

    const num1 = 10;
    const MyDate5 = new Date();
    MyDate5.setDate(MyDate5.getDate() + (num1-1));
    const date2 = MyDate5.getDate()+ '/'+(MyDate5.getMonth()+1)+'/'+MyDate5.getFullYear()
    const MyDateStringTwo = MyDate5.getFullYear() + ('0' + (MyDate5.getMonth()+1)).slice(-2)  +('0' + MyDate5.getDate()).slice(-2);


   
    const Mydate4 = new Date();         // ISO date 2
    Mydate4.setDate(Mydate4.getDate()+(num1-1)) 
    Mydate4.setHours(0,0,0,0)

    RTregFull.find({RtId:req.body.RtId},(err,result91)=>{
        if(err){
            console.log(err)
        }else{
            console.log(result91.length)
            if(result91.length === 0){
                RTregFull.find({RtMlId:req.body.RtMlId},(err,result71)=>{
                    if(err){
                        console.log(err)
                    }else{
                        if(result71.length === 0){
                            RTregFull.find({RtUnm:req.body.RtUnm},(err,result81)=>{
                                if(err){
                                    console.log(err)
                                }else{             
                                                         
                                    if(result81.length ===0){
                                        console.log(req.body.RtPlnTy)                                       
                                        RtInireq.find({RtId:req.body.RtId},(err,result61)=>{
                                            if(err){
                                                console.log(err)
                                            }else{
                                               
                                                if(result61.length === 1){                                                   
                                                    RtplnTy.find({FieldOne:req.body.RtPlnTy},(err,result)=>{
                                                        if(err){                                                            
                                                            console.log(err)
                                                        }else{                                                                                                        
                                                            if(result.length > 0){     
                                                                distance.find({fieldOne:"XYZ"},(err,result51)=>{
                                                                    if(err){
                                                                        console.log(err)
                                                                    }else{
                                                                        // res.json(result)
                                                                        // console.log(result)                                                                 
                                                                        const DATAARR = result51[0].fieldTwo
                                                                        const arr = []
                                                                        const abc = JSON.parse(req.body.RtShCo)
                                                                        const abc2 = JSON.parse(req.body.RtShCo2)
                                                                        const abc3 = JSON.parse(req.body.RtPlnTyNm)
                                                                      
                                                                        // console.log(DATAARR.length)
                                                                    
                                                                        for(let i=0;i<DATAARR.length; i++){
                                                                            const distance2 = getDistance(
                                                                                { latitude:abc.latitude, longitude: abc.longitude },
                                                                                { latitude: DATAARR[i].latitude, longitude: DATAARR[i].longitude }
                                                                            );
                                                                            arr.push([distance2, DATAARR[i].C])
                                                                            console.log('Distance')
                                                                            console.log(distance2)
                                                                        }
                                                                    
                                                                        // console.log(arr)
                                                                        // console.log(arr[1])
                                                                    
                                                                        arr.sort((a,b)=>b[0]-a[0])
                                                                        // console.log(arr[1][1])
                                                                    
                                                                        //After sorting array of column value is displaying with array format
                                                                        // const xarray = [];
                                                                       const  xarray = arr.map(function(item){
                                                                            return item[1]
                                                                        })
                                                                        // res.json(xarray)
                                                                        console.log(xarray)
                                                                        console.log(xarray[0])
                                                
                                                
                                                                        const info = {
                                                                            RtId:req.body.RtId,
                                                                            RtShNm:req.body.RtShNm,
                                                                            RtShBrcNm:req.body.RtShBrcNm,
                                                                            RtUnm:req.body.RtUnm,
                                                                            RtPwd:Pw,
                                                                            RtUsrNm:req.body.RtUsrNm,
                                                                            RtUsrTy:req.body.RtUsrTy,
                                                                            RtUsrImg:req.files[0].filename,
                                                                    
                                                                            RtUsrGnd:req.body.RtUsrGnd,
                                                        
                                                                            RtUsrYob1:JSON.parse(req.body.RtUsrYob1),//// date 
                                                                            RtUsrYob2:req.body.RtUsrYob2,///// ISO date 
                                                                            RtUsrIdImg:[{img0:req.files[1].filename,img1:req.files[2].filename}],
                                                                            RtUsrIdTy:req.body.RtUsrIdTy,
                                                                            RtUsrIdNo:req.body.RtUsrIdNo,
                                                                            RtLgImg1:req.files[5].filename,
                                                                            RtLgImg2:req.files[6].filename,
                                                                          
                                                                    
                                                                            RtStrOpLvTy:"auto",
                                                                            RtStrOpLvSt:"open",
                                                                            RtStrOpD:JSON.parse(req.body.RtStrOpD),
                                                                            RtStrOpN1:req.body.RtStrOpN1,
                                                                            RtStrOpN2:req.body.RtStrOpN2,
                                                                            RtStrOpN3:req.body.RtStrOpN3,
                                                                            RtShIdImg:[{img0:req.files[3].filename,img1:req.files[4].filename}],
                                                                            RtLcnTy:req.body.RtLcnTy,
                                                                            RtLcnNo:req.body.RtLcnNo,
                                                                            RtStrSpl:req.body.RtStrSpl,                          
                                                                           
                                                                            RtMlId:req.body.RtMlId,                
                                                                            RtPhn:req.body.RtPhn,
                                                                            RtCsMlId:req.body.RtCsMlId,
                                                                            RtCsPhn:req.body.RtCsPhn,
                                                                            RtTy1:req.body.RtTy1,
                                                                            RtBrNm:req.body.RtBrNm,
                                                                            RtTy2:req.body.RtTy2,
                                                                          
                                                                    
                                                                            RtStrDt1:'',    
                                                                            RtStrDt2:'',    
                                                                            RtStrDt3:'',    
                                                                            RtExpDt1:date2, 
                                                                            RtExpDt2:MyDateStringTwo,   
                                                                            RtExpDt3:Mydate4,   
                                                                            RtMnLm:result[0].FieldThree[0].MnLm,  
                                                                            RtSbLm:result[0].FieldThree[0].SbLm,  
                                                                            RtPlnDys:result[0].FieldThree[0].Dys,                
                                                                            RtPlnAmt:result[0].FieldThree[0].FAmt,    
                                                                            RtPlnTy:result[0].FieldTwo, 
                                                                            RtPlnTyNm:abc3,
                                                                            RtPlnNm:result[0].FieldThree[0].PlNm,   
                                                                           
                                                                          
                                                                            RtShImg:[{img0:req.files[7].filename},{img0:req.files[8].filename},{img0:req.files[9].filename}],
                                                                    
                                                                            RtShCo:[{latitude:abc.latitude,longitude:abc.longitude}],
                                                                            RtShCo2:{type:"Point",coordinates:[abc2.latitude,abc2.longitude]},
                                                                            RtShCoCd:xarray[0],
                                                                            RtShCoLn:req.body.RtShCoLn,
                                                                            RtPdAmt:'',
                                                                            RtPdAmtDt:'',
                                                                            RtPdAmtTm:'',
                                                                            RtAcnSt:'NtActv',
                                                                            RtRnwSt:'NtRenewed',
                                                                            RtAcnBlkSt:'NtBlk',
                                                                            RtAdr1:req.body.RtAdr1,                 
                                                                            RtAdr2:req.body.RtAdr2,                 
                                                                            RtAdr3:req.body.RtAdr3,                 
                                                                            RtAdr4:req.body.RtAdr4,                 
                                                                            RtAdr5:req.body.RtAdr5,                 
                                                                            RtAdr6:req.body.RtAdr6,                 
                                                                            RtAdr7:req.body.RtAdr7,                 
                                                                    
                                                                            RtPin:req.body.RtPin,
                                                                            RtHbl:req.body.RtHbl,
                                                                            RtHbl2:req.body.RtHbl2,
                                                                            RtHbl3:req.body.RtHbl3,
                                                                            RtTlk:req.body.RtTlk,
                                                                            RtTlk2:req.body.RtTlk2,
                                                                            RtTlk3:req.body.RtTlk3,
                                                                            RtDst:req.body.RtDst,
                                                                            RtDst2:req.body.RtDst2,
                                                                            RtSt:req.body.RtSt,
                                                                            RtSt2:req.body.RtSt2,
                                                                            RtLdMk:req.body.RtLdMk,
                                                                            RtRefTy:req.body.RtRefTy,
                                                                            RtRefCd:req.body.RtRefCd,

                                                                            RtRefCdUsg:'No',
                                                                            RtRegTy:'',
                                                                            RtRegDt1:date,
                                                                            RtRegDt2:MyDateStringOne,
                                                                            RtRegDt3:Mydate3,
                                                                            RtSlOrg:req.body.RtSlOrg,
                                                                            RtSlOrgCd:req.body.RtSlOrgCd,
                                                                            RtSlId:req.body.RtSlId,
                                                                            RtSlRegTy:'Indirect',
                                                                            RtSlRegSts:'Started'
                                                                        }
                                                                        const data = RTregFull(info)
                                                                            data.save()
                                                                            .then(response=>{
                                                                                console.log(response)
                                                                                RtInireq.findOneAndUpdate({RtId:req.body.RtId},{
                                                                                            $set:{
                                                                                                RtSts:'ReqRegtrd',
                                                                                            }
                                                                                    },(err,result5)=>{
                                                                                        if(err){
                                                                                            console.log(err)
                                                                                        }else{
                                                                                            // console.log('updated success')
                                                                                            var transport = nodemailer.createTransport({
                                                                                                host:'smtp.gmail.com',
                                                                                                port:587,
                                                                                                secure:false,
                                                                                                auth: {
                                                                                                    user:"ank66145@gmail.com",
                                                                                                    pass:"nv123456abc#"
                                                                                                }
                                                                                            
                                                                                            })
                                                                                            var mailoption= {
                                                                                                from:"ank66145@gmail.com",
                                                                                                to:req.body.RtMlId,
                                                                                                subject:"Registered successfully,Password for Mobile Application",
                                                                                                text:`Registered successfully,your unique name is "${req.body.RtUnm}" and your password is "${Pw}".`
                                                                                            }
                                                                                            
                                                                                            transport.sendMail(mailoption,function(error,info){
                                                                                                if(error){
                                                                                                    
                                                                                                    console.log(error);
                                                                                                }else{
                        
                                                                                                    console.log("success"+info.response);
                                                                                                }
                                                                                            })
                                                                                            res.json('Successfully registered two')
            
                                                                                        }
                                                                                    }) 
                                                                                
                                                                                // res.json('Data is Stored in DB')
                                                                            })
                                                                            .catch(err=>{
                                                                                console.log(err)
                                                                            })
                                                                    }
                                                                })           
                                                
                                                            }else{                                                                
                                                                res.json('no plan found')
                                                                console.log('no plan found')
                                                            }
                                                        }
                                                    })
                                    
                                                }else{
                                                    res.json('RtInireq Not valid')
                                                    console.log('RtInireq Not valid')
                                                }
                                            }
                                        })
            
                                    }else{
                                        res.json('Unique name already exists')
                                        console.log('Unique name already exists')
                                    }
                                }
                            })
                        }else{
                            res.json('Email already exists')
                            console.log('Email already exists')
                        }
                    }
                })

            }else{
                res.json('Already RtId exists')
                console.log('Already RtId exists')
            }
        }
    }) 
 
})

RoutesReg.route('/GetRtInfoId').post((req,res)=>{
    console.log(req.body)
    RTregFull.find({RtId:req.body.RtId},(err,result)=>{
        if(err){
            console.log(err)
        }else{
            // console.log(result.length)
            if(result.length > 0){
                const obj1 = {
                    RtId:result[0].RtId,
                    RtLgImg1:result[0].RtLgImg1,
                    RtLgImg2:result[0].RtLgImg2,
                    RtUnm:result[0].RtUnm,
                    RtShNm:result[0].RtShNm,
                    // RtShNm:result[0].RtShNm,
                    RtDst:result[0].RtDst,
                    RtShBrcNm:result[0].RtShBrcNm
                }
                
                res.json(obj1)
            }
        }
    })
})

RoutesReg.route('/GetRtPsInfo').post((req,res)=>{
    console.log(req.body)
    Rupload.find({RPsId:req.body.RPsId},(err,result1)=>{
        if(err){
            console.log(err)
        }else{
            if(result1.length > 0){
                RTregFull.find({RtId:result1[0].RtId},(err,result)=>{
                    if(err){
                        console.log(err)
                    }else{
                        // console.log(result.length)
                        if(result.length > 0){
                            const obj1 = {
                                RtId:result[0].RtId,
                                RtLgImg1:result[0].RtLgImg1,
                                RtLgImg2:result[0].RtLgImg2,
                                RtUnm:result[0].RtUnm,
                                RtShNm:result[0].RtShNm,
                                RtDst:result[0].RtDst,
                                RtShBrcNm:result[0].RtShBrcNm
                            }
                            
                            res.json(obj1)
                        }
                    }
                })

            }
        }
    })
    
})

RoutesReg.route('/RtHome').post((req,res)=>{
    RTregFull.find({RtId:req.body.RtId},(err,result8)=>{
        if(err){
            console.log(err)
        }else{
            if(result8.length > 0){
               console.log(result8[0])
               
                            const obj = {
                                                RtId:result8[0].RtId,
                                                RtShNm:result8[0].RtShNm,
                                                RtShBrcNm:result8[0].RtShBrcNm,
                                                RtUnm:result8[0].RtUnm,
                                                RtUsrNm:result8[0].RtUsrNm,
                                                RtUsrTy:result8[0].RtUsrTy,
                                                RtUsrImg:result8[0].RtUsrImg,

                                                RtUsrGnd:result8[0].RtUsrGnd,
                                                RtUsrYob1:result8[0].RtUsrYob1,
                                                RtUsrYob2:result8[0].RtUsrYob2,
                                                RtUsrIdImg:result8[0].RtUsrIdImg,
                                                RtShIdImg:result8[0].RtShIdImg,
                                                RtLgImg1:result8[0].RtLgImg1,
                                                RtLgImg2:result8[0].RtLgImg2,
                                                RtSlOrg:result8[0].RtSlOrg,
            
                                                RtStrOpLvTy:result8[0].RtStrOpLvTy,
                                                RtStrOpLvSt:result8[0].RtStrOpLvSt,
                                                RtStrOpD:result8[0].RtStrOpD,
                                                RtStrOpN1:result8[0].RtStrOpN1,
                                                RtStrOpN2:result8[0].RtStrOpN2,
                                                RtStrOpN3:result8[0].RtStrOpN3,
                                                RtLcnTy:result8[0].RtLcnTy,
                                                RtStrSpl:result8[0].RtStrSpl,
            
                                                RtMlId:result8[0].RtMlId,                                
                                                RtPhn:result8[0].RtPhn,
                                                RtCsMlId:result8[0].RtCsMlId,
                                                RtCsPhn:result8[0].RtCsPhn,
                                                RtTy1:result8[0].RtTy1,
                                                RtBrNm:result8[0].RtBrNm,
                                                RtTy2:result8[0].RtTy2,
                                                RtMnLm:result8[0].RtMnLm,
                                                RtSbLm:result8[0].RtSbLm,
            
                                                RtStrDt1:result8[0].RtStrDt1,
                                                RtStrDt2:result8[0].RtStrDt2,
                                                RtStrDt3:result8[0].RtStrDt3,
                                                RtExpDt1:result8[0].RtExpDt1,
                                                RtExpDt2:result8[0].RtExpDt2,
                                                RtExpDt3:result8[0].RtExpDt3,
                                                RtPlnTy:result8[0].RtPlnTy,
                                                RtPlnTyNm:result8[0].RtPlnTyNm,
                                                RtPlnNm:result8[0].RtPlnNm,
                                                RtPlnDys:result8[0].RtPlnDys,
                                                RtPlnAmt:result8[0].RtPlnAmt,
                                                RtAcnSt:result8[0].RtAcnSt,
                                                RtLcnNo:result8[0].RtLcnNo,
                                                RtShImg:result8[0].RtShImg,
            
                                                RtShCo:result8[0].RtShCo,
                                                RtShCo2:result8[0].RtShCo2,
                                                RtShCoCd:result8[0].RtShCoCd,
                                                RtShCoLn:result8[0].RtShCoLn,
                                                RtPdAmt:result8[0].RtPdAmt,
                                                RtPdAmtDt:result8[0].RtPdAmtDt,
                                                RtPdAmtTm:result8[0].RtPdAmtTm,
                                                RtRnwSt:result8[0].RtRnwSt,
                                                RtAdr1:result8[0].RtAdr1,
                                                RtAdr2:result8[0].RtAdr2,
                                                RtAdr3:result8[0].RtAdr3,
                                                RtAdr4:result8[0].RtAdr4,
                                                RtAdr5:result8[0].RtAdr5,
                                                RtAdr6:result8[0].RtAdr6,
                                                RtAdr7:result8[0].RtAdr7,
            
                                                RtPin:result8[0].RtPin,
                                                RtSt:result8[0].RtSt,
                                                RtSt2:result8[0].RtSt2,
                                                RtLdMk:result8[0].RtLdMk,
                                                RtRefTy:result8[0].RtRefTy,
                                                RtRefCd:result8[0].RtRefCd,
                                                RtRefCdUsg:result8[0].RtRefCdUsg,
                                                RtRegTy:result8[0].RtRegTy,
                                                RtRegDt1:result8[0].RtRegDt1,
                                                RtRegDt2:result8[0].RtRegDt2,
                                                RtSlId:result8[0].RtSlId,

                                                RtHbl:result8[0].RtHbl,
                                                RtHbl2:result8[0].RtHbl2,
                                                RtHbl3:result8[0].RtHbl3,
                                                RtTlk:result8[0].RtTlk,
                                                RtTlk2:result8[0].RtTlk2,
                                                RtTlk3:result8[0].RtTlk3,
                                                RtDst:result8[0].RtDst,
                                                RtDst2:result8[0].RtDst2
                                    }
                res.json([obj])
            }else{
                res.json('notFound')
            }
        }
    })
})



RoutesReg.route('/RtGetMyAccount').post((req,res)=>{
    console.log('RtgetMy account')
    console.log(req.body)
    RTregFull.find({RtId:req.body.RtId},(err,result)=>{
        if(err){
            console.log(err)
        }else {
            // console.log(result)
            if(result.length > 0 ){
                // console.log(result)
                // res.json(result[0])
                const obj = {
                    // RtId: result[0].RtId,
                    // RtNm: result[0].RtNm,
                    // RtUnm: result[0].RtUnm,
                    // RtMlId: result[0].RtMlId,
                    // RtPhn: result[0].RtPhn,
                    // RtCsMlId: result[0].RtCsMlId,
                    // RtCsPhn: result[0].RtCsPhn,
                    // RtTy1: result[0].RtTy1,
                    // RtBrNm: result[0].RtBrNm,
                    // RtTy2: result[0].RtTy2,
                    // RtMnLm: result[0].RtMnLm,
                    // RtSbLm: result[0].RtSbLm,
                    // RtStrDt1: result[0].RtStrDt1,
                    // RtStrDt2:result[0].RtStrDt2,
                    // RtStrDt3: result[0].RtStrDt3,
                    // RtExpDt1: result[0].RtExpDt1,
                    // RtExpDt2: result[0].RtExpDt2,
                    // RtExpDt3: result[0].RtExpDt3,
                    // RtPlnTy: result[0].RtPlnTy,
                    // RtAcnSt: result[0].RtAcnSt,
                    // RtLcnNo: result[0].RtLcnNo,
                    // RtUImg: result[0].RtUImg,
                    // RtShImg: result[0].RtShImg,
                    // RtLgImg: result[0].RtLgImg,
                    // RtShCo: result[0].RtShCo,
                    // RtShCoCd: result[0].RtShCoCd,
                    // RtPdAmt: result[0].RtPdAmt,
                    // RtPdAmtDt: result[0].RtPdAmtDt,
                    // RtRnwSt: result[0].RtRnwSt,
                    // RtAdr1: result[0].RtAdr1,
                    // RtAdr2: result[0].RtAdr2,
                    // RtAdr3: result[0].RtAdr3,
                    // RtAdr4: result[0].RtAdr4,
                    // RtAdr5: result[0].RtAdr5,
                    // RtAdr6: result[0].RtAdr6,
                    // RtAdr7: result[0].RtAdr7,
                    // RtPin: result[0].RtPin,
                    // RtSt: result[0].RtSt,
                    // RtLdMk: result[0].RtLdMk,
                    // RtRefTy: result[0].RtRefTy,
                    // RtRefCd: result[0].RtRefCd,
                    // RtRefCdUsg: result[0].RtRefCdUsg,
                    // RtRegTy: result[0].RtRegTy

                    
                    RtId:result[0].RtId,
                    RtShNm:result[0].RtShNm,
                    RtShBrcNm:result[0].RtShBrcNm,
                    RtUnm:result[0].RtUnm,
                    RtUsrNm:result[0].RtUsrNm,
                    RtUsrTy:result[0].RtUsrTy,
                    RtUsrImg:result[0].RtUsrImg,
                    RtUsrGnd:result[0].RtUsrGnd,
                    RtUsrYob1:result[0].RtUsrYob1,
                    RtUsrYob2:result[0].RtUsrYob2,
                    RtUsrIdImg:result[0].RtUsrIdImg,
                    RtShIdImg:result[0].RtShIdImg,
                    RtLgImg1:result[0].RtLgImg1,
                    RtLgImg2:result[0].RtLgImg2,
                    RtSlOrg:result[0].RtSlOrg,
                    RtStrOpLvTy:result[0].RtStrOpLvTy,
                    RtStrOpLvSt:result[0].RtStrOpLvSt,
                    RtStrOpD:result[0].RtStrOpD,
                    RtStrOpN1:result[0].RtStrOpN1,
                    RtStrOpN2:result[0].RtStrOpN2,
                    RtStrOpN3:result[0].RtStrOpN3,
                    RtLcnTy:result[0].RtLcnTy,
                    RtStrSpl:result[0].RtStrSpl,
                    RtMlId:result[0].RtMlId,
                    RtPhn:result[0].RtPhn,
                    RtCsMlId:result[0].RtCsMlId,
                    RtCsPhn:result[0].RtCsPhn,
                    RtTy1:result[0].RtTy1,
                    RtBrNm:result[0].RtBrNm,
                    RtTy2:result[0].RtTy2,
                    RtMnLm:result[0].RtMnLm,
                    RtSbLm:result[0].RtSbLm,
                    RtStrDt1:result[0].RtStrDt1,
                    RtStrDt2:result[0].RtStrDt2,
                    RtStrDt3:result[0].RtStrDt3,
                    RtExpDt1:result[0].RtExpDt1,
                    RtExpDt2:result[0].RtExpDt2,
                    RtExpDt3:result[0].RtExpDt3,
                    RtPlnTy:result[0].RtPlnTy,
                    RtPlnTyNm:result[0].RtPlnTyNm,
                    RtPlnNm:result[0].RtPlnNm,
                    RtPlnDys:result[0].RtPlnDys,
                    RtPlnAmt:result[0].RtPlnAmt,
                    RtAcnSt:result[0].RtAcnSt,
                    RtLcnNo:result[0].RtLcnNo,
                    RtShImg:result[0].RtShImg,
                    RtShCo:result[0].RtShCo,
                    RtShCo2:result[0].RtShCo2,
                    RtShCoCd:result[0].RtShCoCd,
                    RtShCoLn:result[0].RtShCoLn,
                    RtPdAmt:result[0].RtPdAmt,
                    RtPdAmtDt:result[0].RtPdAmtDt,
                    RtPdAmtTm:result[0].RtPdAmtTm,
                    RtRnwSt:result[0].RtRnwSt,
                    RtAdr1:result[0].RtAdr1,
                    RtAdr2:result[0].RtAdr2,
                    RtAdr3:result[0].RtAdr3,
                    RtAdr4:result[0].RtAdr4,
                    RtAdr5:result[0].RtAdr5,
                    RtAdr6:result[0].RtAdr6,
                    RtAdr7:result[0].RtAdr7,
                    RtPin:result[0].RtPin,
                    RtSt:result[0].RtSt,
                    RtSt2:result[0].RtSt2,
                    RtLdMk:result[0].RtLdMk,
                    RtRefTy:result[0].RtRefTy,
                    RtRefCd:result[0].RtRefCd,
                    RtRefCdUsg:result[0].RtRefCdUsg,
                    RtRegTy:result[0].RtRegTy,
                    RtRegDt1:result[0].RtRegDt1,
                    RtRegDt2:result[0].RtRegDt2,
                    RtSlId:result[0].RtSlId,
                    RtHbl:result[0].RtHbl,
                    RtHbl2:result[0].RtHbl2,
                    RtHbl3:result[0].RtHbl3,
                    RtTlk:result[0].RtTlk,
                    RtTlk2:result[0].RtTlk2,
                    RtTlk3:result[0].RtTlk3,
                    RtDst:result[0].RtDst,
                    RtDst2:result[0].RtDst2
                    
                }
                console.log(obj)
                res.json(obj)
            }
        }
    })
})

RoutesReg.route('/AddDistance').post((req,res)=>{
    console.log(req.body)
    distance.find({fieldOne:req.body.fieldOne},(err,result2)=>{
        if(err){

        }else{
            if (result2.length === 0){

                const addData = distance(req.body)
                addData.save()
                .then(response=>{
                    res.json('Your Data is saved')
                    console.log(response)
                })
                .catch(err=>{
                    console.log(err)
                    res.json(err)
                })

            }
            else{
                console.log('already exists')
                res.json('already exists')
            }
        }
    })
   
})

RoutesReg.route('/AddDistanceOne').post((req,res)=>{
    console.log(req.body)
    distance.find({fieldOne:req.body.fieldOne1,fieldTwo:{$elemMatch:{C:req.body.C1}}},(err,result2)=>{
        if(err){

        }else{
            console.log(result2.length)
            if (result2.length === 0){
                distance.updateOne(
                    {fieldOne:req.body.fieldOne1},
                    { $push: { fieldTwo :{
                        latitude:req.body.latitude1,
                        longitude:req.body.longitude1,
                        C:req.body.C1
                
                
                    }
                        
                    } },(err,result)=>{
                        if(err){
                            res.json(err)
                            console.log(err)          
                        }else{
                            res.json('Added')
                            console.log(result)
                        }
                
                    }
                 )

            }
            else{
                res.json('alreadyExists')
                console.log('alreadyExists')// result length will be only one even though actually more than one
            }
        }})


})



RoutesReg.route('/DelDistanceOne').post((req,res)=>{
    console.log(req.body)
    
   distance.updateOne(
    {fieldOne:req.body.fieldOne2},
    { $pull: { fieldTwo :{
        _id:req.body._id,
        latitude:req.body.latitude2,
        longitude:req.body.longitude2,
        C:req.body.C2
    }    
    } },(err,result)=>{
        if(err){
            res.json(err)
            console.log(err)          
        }else{
            res.json('Deleted')
            console.log(result)
        }

    }
 )

})

//////////////////GetDistance with result length 8//////////////////////////////////////////////////
RoutesReg.route('/GetDistance').post((req,res)=>{
    console.log('getdistance')
    console.log(req.body)
    distance.find({fieldOne:"XYZ"},(err,result)=>{
        if(err){
            console.log(err)
        }else{
            // res.json(result)
            // console.log(result)

            const DATAARR = result[0].fieldTwo
            const arr = []
            // console.log(DATAARR.length)
        
            for(let i=0;i<DATAARR.length; i++){
                const distance2 = getDistance(
                    { latitude:req.body.latitude, longitude: req.body.longitude },
                    { latitude: DATAARR[i].latitude, longitude: DATAARR[i].longitude }
                );
                arr.push([distance2, DATAARR[i].C])
            }
        
            // console.log(arr)
            // console.log(arr[1])
        
            arr.sort((a,b)=>b[0]-a[0])
            // console.log(arr[1][1])
        
            //After sorting array of column value is displaying with array format
            // const xarray = [];
            
           const  xarray = arr.map(function(item){
                return item[1]
            })
            const abc =[xarray[0],xarray[1],xarray[2],xarray[3],xarray[4],xarray[5],xarray[6],xarray[7],xarray[8]]           
            res.json(abc)
            console.log(abc)
            // console.log(xarray)
        }
    })
})

////////// GetDistance Two with result length 4//////////////////////////

RoutesReg.route('/GetDistanceTwo').post((req,res)=>{
    distance.find({fieldOne:"XYZ"},(err,result)=>{
        if(err){
            console.log(err)
        }else{
            // res.json(result)
            // console.log(result)

            const DATAARR = result[0].fieldTwo
            const arr = []
            // console.log(DATAARR.length)
        
            for(let i=0;i<DATAARR.length; i++){
                const distance2 = getDistance(
                    { latitude:req.body.latitude, longitude: req.body.longitude },
                    { latitude: DATAARR[i].latitude, longitude: DATAARR[i].longitude }
                );
                arr.push([distance2, DATAARR[i].C])
            }
        
            // console.log(arr)
            // console.log(arr[1])
        
            arr.sort((a,b)=>b[0]-a[0])
            // console.log(arr[1][1])
        
            //After sorting array of column value is displaying with array format
            // const xarray = [];
           const  xarray = arr.map(function(item){
                return item[1]
            })
            const abc =[xarray[0],xarray[1],xarray[2],xarray[3],xarray[4]]
            console.log(abc)
            res.json(abc)
            // console.log(xarray)
        }
    })
})


RoutesReg.route('/GetDistanceThree').post(function(req,res){
    console.log(req.body)
    distance.find({fieldOne:req.body.fieldOne},(err,result)=>{
     //    console.log(result)
     if(err){
         res.json(err)
     }else{
         if(result.length > 0){
            res.json(result)
            console.log(result)   
         }
         else{
             res.json('not found')
             console.log('not found')
         }
     
     }
     
    }) 
 })




//generating token `

RoutesReg.route('/RTgenerateToken').post((req,res)=>{
    // console.log(req.body)
    // RTregFull.find({"usrNm":req.body["username"], "psw":req.body["password"]},
    RTregFull.find({RtUnm:req.body.username,RtPwd:req.body.password},
    
    (err,user)=>{
        
        if(err){
            res.json(error)
         } else{
             console.log(req.body)
             let userdata = user.filter((use)=>{
                 return use.RtUnm == req.body.username && use.RtPwd == req.body.password; 
             })
             
             if(userdata.length){
                 let token_payload = {id:userdata[0].RtId};
                 let token = jwt.sign(token_payload,"!@1709nm");
                 let response = { 'accessToken' : token,user:'ja'}
                 console.log(response)
         
                 return res.status(200).json(response);
             } else {
                 return res.status(400).json('Authentication failed...');
             }
         
         }
     });
    })

    
//validation token

RoutesReg.route('/RTvalidateTokenTwo').post((req,res)=>{
    console.log('token getting')
    console.log(req.body)
    let key = "!@1709nm"
    var token = req.body['TokenId'];
// console.log(token)                                                            
    try{                                                             
        if(token){                                                           
            let verify = jwt.verify(token,key)                                                           
            // console.log(verify)                                                            
                                                                
            if(verify){
                let decoded = jwt.decode(token,{complete:true});
                console.log(decoded.payload.id)
                // res.send({"id":decoded.payload.id});
                var MyDateA = new Date();
                const MyDateStringA = MyDateA.getFullYear() + ('0' + (MyDateA.getMonth()+1)).slice(-2)  +('0' + MyDateA.getDate()).slice(-2); 
                // const MyDateStringA = 20230811
                RTregFull.find({RtId:decoded.payload.id},(err,result8)=>{
                    // if(err){
                    //     console.log(err)
                    // }else{
                    //     console.log(result)
                    //     if(result.length > 0){
                    //         console.log(result[0])
                            
                    //         const obj = {
                    
                    //             RtId: result[0].RtId,
                    //             RtNm: result[0].RtNm,
                    //             RtUnm: result[0].RtUnm,
                    //             RtMlId: result[0].RtMlId,
                    //             RtPhn: result[0].RtPhn,
                    //             RtCsMlId: result[0].RtCsMlId,
                    //             RtCsPhn: result[0].RtCsPhn,
                    //             RtTy1: result[0].RtTy1,
                    //             RtBrNm: result[0].RtBrNm,
                    //             RtTy2: result[0].RtTy2,
                    //             RtMnLm: result[0].RtMnLm,
                    //             RtSbLm: result[0].RtSbLm,
                    //             RtStrDt1: result[0].RtStrDt1,
                    //             RtStrDt2:result[0].RtStrDt2,
                    //             RtStrDt3: result[0].RtStrDt3,
                    //             RtExpDt1: result[0].RtExpDt1,
                    //             RtExpDt2: result[0].RtExpDt2,
                    //             RtExpDt3: result[0].RtExpDt3,
                    //             RtPlnTy: result[0].RtPlnTy,
                    //             RtAcnSt: result[0].RtAcnSt,
                    //             RtLcnNo: result[0].RtLcnNo,
                    //             RtUImg: result[0].RtUImg,
                    //             RtShImg: result[0].RtShImg,
                    //             RtLgImg: result[0].RtLgImg,
                    //             RtShCo: result[0].RtShCo,
                    //             RtShCoCd: result[0].RtShCoCd,
                    //             RtPdAmt: result[0].RtPdAmt,
                    //             RtPdAmtDt: result[0].RtPdAmtDt,
                    //             RtRnwSt: result[0].RtRnwSt,
                    //             RtAdr1: result[0].RtAdr1,
                    //             RtAdr2: result[0].RtAdr2,
                    //             RtAdr3: result[0].RtAdr3,
                    //             RtAdr4: result[0].RtAdr4,
                    //             RtAdr5: result[0].RtAdr5,
                    //             RtAdr6: result[0].RtAdr6,
                    //             RtAdr7: result[0].RtAdr7,
                    //             RtPin: result[0].RtPin,
                    //             RtSt: result[0].RtSt,
                    //             RtLdMk: result[0].RtLdMk,
                    //             RtRefTy: result[0].RtRefTy,
                    //             RtRefCd: result[0].RtRefCd,
                    //             RtRefCdUsg: result[0].RtRefCdUsg,
                    //             RtRegTy: result[0].RtRegTy,
                               
                    //         }
                    //         res.json(obj)
                    //     }else{
                            
                    //         console.log('no JWT result found')
                    //     }
                    // }

                    if(err){
                        console.log(err)
                    }else{
                        if(result8.length === 1){
                            if(result8[0].RtExpDt2 >= MyDateStringA){
                                console.log('ExDt > CrDt ')
                                    if(result8[0].RtAcnSt === 'Actv'){
                                        console.log('Account sts Actv')
                                        const obj1 = {
                                                RtId:result8[0].RtId,
                                                RtShNm:result8[0].RtShNm,
                                                RtShBrcNm:result8[0].RtShBrcNm,
                                                RtUnm:result8[0].RtUnm,
                                                RtUsrNm:result8[0].RtUsrNm,
                                                RtUsrTy:result8[0].RtUsrTy,
                                                RtUsrImg:result8[0].RtUsrImg,
            
                                                RtUsrGnd:result8[0].RtUsrGnd,
                                                RtUsrYob1:result8[0].RtUsrYob1,
                                                RtUsrYob2:result8[0].RtUsrYob2,
                                                RtUsrIdImg:result8[0].RtUsrIdImg,
                                                RtShIdImg:result8[0].RtShIdImg,
                                                RtLgImg1:result8[0].RtLgImg1,
                                                RtLgImg2:result8[0].RtLgImg2,
                                                RtSlOrg:result8[0].RtSlOrg,
            
                                                RtStrOpLvTy:result8[0].RtStrOpLvTy,
                                                RtStrOpLvSt:result8[0].RtStrOpLvSt,
                                                RtStrOpD:result8[0].RtStrOpD,
                                                RtStrOpN1:result8[0].RtStrOpN1,
                                                RtStrOpN2:result8[0].RtStrOpN2,
                                                RtStrOpN3:result8[0].RtStrOpN3,
                                                RtLcnTy:result8[0].RtLcnTy,
                                                RtStrSpl:result8[0].RtStrSpl,
            
                                                RtMlId:result8[0].RtMlId,                                
                                                RtPhn:result8[0].RtPhn,
                                                RtCsMlId:result8[0].RtCsMlId,
                                                RtCsPhn:result8[0].RtCsPhn,
                                                RtTy1:result8[0].RtTy1,
                                                RtBrNm:result8[0].RtBrNm,
                                                RtTy2:result8[0].RtTy2,
                                                RtMnLm:result8[0].RtMnLm,
                                                RtSbLm:result8[0].RtSbLm,
            
                                                RtStrDt1:result8[0].RtStrDt1,
                                                RtStrDt2:result8[0].RtStrDt2,
                                                RtStrDt3:result8[0].RtStrDt3,
                                                RtExpDt1:result8[0].RtExpDt1,
                                                RtExpDt2:result8[0].RtExpDt2,
                                                RtExpDt3:result8[0].RtExpDt3,
                                                RtPlnTy:result8[0].RtPlnTy,
                                                RtPlnTyNm:result8[0].RtPlnTyNm,
                                                RtPlnNm:result8[0].RtPlnNm,
                                                RtPlnDys:result8[0].RtPlnDys,
                                                RtPlnAmt:result8[0].RtPlnAmt,
                                                RtAcnSt:result8[0].RtAcnSt,
                                                RtLcnNo:result8[0].RtLcnNo,
                                                RtShImg:result8[0].RtShImg,
            
                                                RtShCo:result8[0].RtShCo,
                                                RtShCo2:result8[0].RtShCo2,
                                                RtShCoCd:result8[0].RtShCoCd,
                                                RtShCoLn:result8[0].RtShCoLn,
                                                RtPdAmt:result8[0].RtPdAmt,
                                                RtPdAmtDt:result8[0].RtPdAmtDt,
                                                RtPdAmtTm:result8[0].RtPdAmtTm,
                                                RtRnwSt:result8[0].RtRnwSt,
                                                RtAcnBlkSt:result8[0].RtAcnBlkSt,
                                                RtAdr1:result8[0].RtAdr1,
                                                RtAdr2:result8[0].RtAdr2,
                                                RtAdr3:result8[0].RtAdr3,
                                                RtAdr4:result8[0].RtAdr4,
                                                RtAdr5:result8[0].RtAdr5,
                                                RtAdr6:result8[0].RtAdr6,
                                                RtAdr7:result8[0].RtAdr7,
            
                                                RtPin:result8[0].RtPin,
                                                RtSt:result8[0].RtSt,
                                                RtSt2:result8[0].RtSt2,
                                                RtLdMk:result8[0].RtLdMk,
                                                RtRefTy:result8[0].RtRefTy,
                                                RtRefCd:result8[0].RtRefCd,
                                                RtRefCdUsg:result8[0].RtRefCdUsg,
                                                RtRegTy:result8[0].RtRegTy,
                                                RtRegDt1:result8[0].RtRegDt1,
                                                RtRegDt2:result8[0].RtRegDt2,
                                                RtSlId:result8[0].RtSlId,

                                                RtHbl:result8[0].RtHbl,
                                                RtHbl2:result8[0].RtHbl2,
                                                RtHbl3:result8[0].RtHbl3,
                                                RtTlk:result8[0].RtTlk,
                                                RtTlk2:result8[0].RtTlk2,
                                                RtTlk3:result8[0].RtTlk3,
                                                RtDst:result8[0].RtDst,
                                                RtDst2:result8[0].RtDst2

                                        
            
                                        }
                                        console.log('Send data1')
                                        res.json(obj1)
                                    }else{
                                        console.log('Account sts NtActv')
                                        const obj10 = {
                                            RtId:result8[0].RtId,
                                            RtShNm:result8[0].RtShNm,
                                            RtShBrcNm:result8[0].RtShBrcNm,
                                            RtUnm:result8[0].RtUnm,
                                            RtUsrNm:result8[0].RtUsrNm,
                                            RtUsrTy:result8[0].RtUsrTy,
                                            RtUsrImg:result8[0].RtUsrImg,
        
                                            RtUsrGnd:result8[0].RtUsrGnd,
                                            RtUsrYob1:result8[0].RtUsrYob1,
                                            RtUsrYob2:result8[0].RtUsrYob2,
                                            RtUsrIdImg:result8[0].RtUsrIdImg,
                                            RtShIdImg:result8[0].RtShIdImg,
                                            RtLgImg1:result8[0].RtLgImg1,
                                            RtLgImg2:result8[0].RtLgImg2,
                                            RtSlOrg:result8[0].RtSlOrg,
        
                                            RtStrOpLvTy:result8[0].RtStrOpLvTy,
                                            RtStrOpLvSt:result8[0].RtStrOpLvSt,
                                            RtStrOpD:result8[0].RtStrOpD,
                                            RtStrOpN1:result8[0].RtStrOpN1,
                                            RtStrOpN2:result8[0].RtStrOpN2,
                                            RtStrOpN3:result8[0].RtStrOpN3,
                                            RtLcnTy:result8[0].RtLcnTy,
                                            RtStrSpl:result8[0].RtStrSpl,
        
                                            RtMlId:result8[0].RtMlId,                                
                                            RtPhn:result8[0].RtPhn,
                                            RtCsMlId:result8[0].RtCsMlId,
                                            RtCsPhn:result8[0].RtCsPhn,
                                            RtTy1:result8[0].RtTy1,
                                            RtBrNm:result8[0].RtBrNm,
                                            RtTy2:result8[0].RtTy2,
                                            RtMnLm:result8[0].RtMnLm,
                                            RtSbLm:result8[0].RtSbLm,
        
                                            RtStrDt1:result8[0].RtStrDt1,
                                            RtStrDt2:result8[0].RtStrDt2,
                                            RtStrDt3:result8[0].RtStrDt3,
                                            RtExpDt1:result8[0].RtExpDt1,
                                            RtExpDt2:result8[0].RtExpDt2,
                                            RtExpDt3:result8[0].RtExpDt3,
                                            RtPlnTy:result8[0].RtPlnTy,
                                            RtPlnTyNm:result8[0].RtPlnTyNm,
                                            RtPlnNm:result8[0].RtPlnNm,
                                            RtPlnDys:result8[0].RtPlnDys,
                                            RtPlnAmt:result8[0].RtPlnAmt,
                                            RtAcnSt:result8[0].RtAcnSt,
                                            RtLcnNo:result8[0].RtLcnNo,
                                            RtShImg:result8[0].RtShImg,
        
                                            RtShCo:result8[0].RtShCo,
                                            RtShCo2:result8[0].RtShCo2,
                                            RtShCoCd:result8[0].RtShCoCd,
                                            RtShCoLn:result8[0].RtShCoLn,
                                            RtPdAmt:result8[0].RtPdAmt,
                                            RtPdAmtDt:result8[0].RtPdAmtDt,
                                            RtPdAmtTm:result8[0].RtPdAmtTm,
                                            RtRnwSt:result8[0].RtRnwSt,
                                            RtAcnBlkSt:result8[0].RtAcnBlkSt,
                                            RtAdr1:result8[0].RtAdr1,
                                            RtAdr2:result8[0].RtAdr2,
                                            RtAdr3:result8[0].RtAdr3,
                                            RtAdr4:result8[0].RtAdr4,
                                            RtAdr5:result8[0].RtAdr5,
                                            RtAdr6:result8[0].RtAdr6,
                                            RtAdr7:result8[0].RtAdr7,
        
                                            RtPin:result8[0].RtPin,
                                            RtSt:result8[0].RtSt,
                                            RtSt2:result8[0].RtSt2,
                                            RtLdMk:result8[0].RtLdMk,
                                            RtRefTy:result8[0].RtRefTy,
                                            RtRefCd:result8[0].RtRefCd,
                                            RtRefCdUsg:result8[0].RtRefCdUsg,
                                            RtRegTy:result8[0].RtRegTy,
                                            RtRegDt1:result8[0].RtRegDt1,
                                            RtRegDt2:result8[0].RtRegDt2,
                                            RtSlId:result8[0].RtSlId,

                                            RtHbl:result8[0].RtHbl,
                                            RtHbl2:result8[0].RtHbl2,
                                            RtHbl3:result8[0].RtHbl3,
                                            RtTlk:result8[0].RtTlk,
                                            RtTlk2:result8[0].RtTlk2,
                                            RtTlk3:result8[0].RtTlk3,
                                            RtDst:result8[0].RtDst,
                                            RtDst2:result8[0].RtDst2
        
                                    }
                                                                               
                                        console.log('Not Active')
                                        console.log(obj10)
                                        res.json(obj10)
                                    }
            
                            }else if(result8[0].RtExpDt2 < MyDateStringA){
                                console.log('ExDt < CrDt ')
                                if(result8[0].RtAcnSt === 'Actv'){
                                    console.log('Account sts Actv 2')
                                    if(result8[0].RtRnwSt === 'Renewed'){
                                        console.log('Account sts Renewed 2')
                                        // console.log(req.body.RtId)
                                        RTRnwl.find({RtId:decoded.payload.id},(err,result12)=>{
                                            if(err){
                                                console.log(err)
                                            }else{
                                                if(result12.length > 0){
                                                    console.log('result12 renewed')
                                                    console.log(result12[0])
                                                    const num1 = result12[0].RtDys;
                                                    var MyDate = new Date();
                                                    const date = MyDate.getDate()+ '/'+(MyDate.getMonth()+1)+'/'+MyDate.getFullYear()
                                                    const MyDateString = MyDate.getFullYear() + ('0' + (MyDate.getMonth()+1)).slice(-2)  +('0' + MyDate.getDate()).slice(-2);     
                                                    const Mydate3 = new Date();
            
                                                    MyDate.setDate(MyDate.getDate() + (num1-1));              
                                                    const date2 = MyDate.getDate()+ '/'+(MyDate.getMonth()+1)+'/'+MyDate.getFullYear()
                                                    const MyDateStringTwo = MyDate.getFullYear() + ('0' + (MyDate.getMonth()+1)).slice(-2)  +('0' + MyDate.getDate()).slice(-2);
                                            
                                                    const Mydate4 = new Date();         // ISO date 2
                                                    Mydate4.setDate(Mydate4.getDate()+(num1-1)) 
                                                    Mydate4.setHours(0,0,0,0)
                                                    RTregFull.updateOne({RtId:decoded.payload.id},{
                                                        $set:{
                                                                RtMnLm:result12[0].RtMLlmt,
                                                                RtSbLm:result12[0].RtSLmt,
                                                                RtStrDt1:date,
                                                                RtStrDt2:MyDateString,
                                                                RtStrDt3:Mydate3,
                                                                RtExpDt1:date2,
                                                                RtExpDt2:MyDateStringTwo,
                                                                RtExpDt3:Mydate4,
                                                                RtPlnTy:result12[0].RtPlnTy,
                                                                RtPlnNm:result12[0].RtPlNm,
                                                                RtPlnDys:result12[0].RtDys,
                                                                RtPlnAmt:result12[0].RtAmt1,
                                                                RtAcnSt:'Actv',
                                                                RtRnwSt:'NtRenewed'
                                                        }
                                                    },(err,result11)=>{
                                                        if(err){
                                                            console.log(err)
                                                        }else{
                                                            RTregFull.find({RtId:decoded.payload.id},(err,result14)=>{
                                                                if(err){
                                                                    console.log(err)
                                                                }else{
                                                                    if(result14.length > 0){
                                                                        const obj1 = {
                                                                            RtId:result14[0].RtId,
                                                                            RtShNm:result14[0].RtShNm,
                                                                            RtShBrcNm:result14[0].RtShBrcNm,
                                                                            RtUnm:result14[0].RtUnm,
                                                                            RtUsrNm:result14[0].RtUsrNm,
                                                                            RtUsrTy:result14[0].RtUsrTy,
                                                                            RtUsrImg:result14[0].RtUsrImg,
                                        
                                                                            RtUsrGnd:result14[0].RtUsrGnd,
                                                                            RtUsrYob1:result14[0].RtUsrYob1,
                                                                            RtUsrYob2:result14[0].RtUsrYob2,
                                                                            RtUsrIdImg:result14[0].RtUsrIdImg,
                                                                            RtShIdImg:result14[0].RtShIdImg,
                                                                            RtLgImg1:result14[0].RtLgImg1,
                                                                            RtLgImg2:result14[0].RtLgImg2,
                                                                            RtSlOrg:result14[0].RtSlOrg,
                                        
                                                                            RtStrOpLvTy:result14[0].RtStrOpLvTy,
                                                                            RtStrOpLvSt:result14[0].RtStrOpLvSt,
                                                                            RtStrOpD:result14[0].RtStrOpD,
                                                                            RtStrOpN1:result14[0].RtStrOpN1,
                                                                            RtStrOpN2:result14[0].RtStrOpN2,
                                                                            RtStrOpN3:result14[0].RtStrOpN3,
                                                                            RtLcnTy:result14[0].RtLcnTy,
                                                                            RtStrSpl:result14[0].RtStrSpl,
                                        
                                                                            RtMlId:result14[0].RtMlId,                                
                                                                            RtPhn:result14[0].RtPhn,
                                                                            RtCsMlId:result14[0].RtCsMlId,
                                                                            RtCsPhn:result14[0].RtCsPhn,
                                                                            RtTy1:result14[0].RtTy1,
                                                                            RtBrNm:result14[0].RtBrNm,
                                                                            RtTy2:result14[0].RtTy2,
                                                                            RtMnLm:result14[0].RtMnLm,
                                                                            RtSbLm:result14[0].RtSbLm,
                                        
                                                                            RtStrDt1:result14[0].RtStrDt1,
                                                                            RtStrDt2:result14[0].RtStrDt2,
                                                                            RtStrDt3:result14[0].RtStrDt3,
                                                                            RtExpDt1:result14[0].RtExpDt1,
                                                                            RtExpDt2:result14[0].RtExpDt2,
                                                                            RtExpDt3:result14[0].RtExpDt3,
                                                                            RtPlnTy:result14[0].RtPlnTy,
                                                                            RtPlnTyNm:result14[0].RtPlnTyNm,
                                                                            RtPlnNm:result14[0].RtPlnNm,
                                                                            RtPlnDys:result14[0].RtPlnDys,
                                                                            RtPlnAmt:result14[0].RtPlnAmt,
                                                                            RtAcnSt:result14[0].RtAcnSt,
                                                                            RtLcnNo:result14[0].RtLcnNo,
                                                                            RtShImg:result14[0].RtShImg,
                                        
                                                                            RtShCo:result14[0].RtShCo,
                                                                            RtShCo2:result14[0].RtShCo2,
                                                                            RtShCoCd:result14[0].RtShCoCd,
                                                                            RtShCoLn:result14[0].RtShCoLn,
                                                                            RtPdAmt:result14[0].RtPdAmt,
                                                                            RtPdAmtDt:result14[0].RtPdAmtDt,
                                                                            RtPdAmtTm:result14[0].RtPdAmtTm,
                                                                            RtRnwSt:result14[0].RtRnwSt,
                                                                            RtAcnBlkSt:result8[0].RtAcnBlkSt,
                                                                            RtAdr1:result14[0].RtAdr1,
                                                                            RtAdr2:result14[0].RtAdr2,
                                                                            RtAdr3:result14[0].RtAdr3,
                                                                            RtAdr4:result14[0].RtAdr4,
                                                                            RtAdr5:result14[0].RtAdr5,
                                                                            RtAdr6:result14[0].RtAdr6,
                                                                            RtAdr7:result14[0].RtAdr7,
                                        
                                                                            RtPin:result14[0].RtPin,
                                                                            RtSt:result14[0].RtSt,
                                                                            RtSt2:result14[0].RtSt2,
                                                                            RtLdMk:result14[0].RtLdMk,
                                                                            RtRefTy:result14[0].RtRefTy,
                                                                            RtRefCd:result14[0].RtRefCd,
                                                                            RtRefCdUsg:result14[0].RtRefCdUsg,
                                                                            RtRegTy:result14[0].RtRegTy,
                                                                            RtRegDt1:result14[0].RtRegDt1,
                                                                            RtRegDt2:result14[0].RtRegDt2,
                                                                            RtSlId:result14[0].RtSlId,

                                                                            RtHbl:result14[0].RtHbl,
                                                                            RtHbl2:result14[0].RtHbl2,
                                                                            RtHbl3:result14[0].RtHbl3,
                                                                            RtTlk:result14[0].RtTlk,
                                                                            RtTlk2:result14[0].RtTlk2,
                                                                            RtTlk3:result14[0].RtTlk3,
                                                                            RtDst:result14[0].RtDst,
                                                                            RtDst2:result14[0].RtDst2
                                        
                                                                    }
                                                                    console.log('Renewed data2')
                                                                    // console.log(obj1)
                                                                    res.json(obj1)
                                                                    }
                                                                }
                                                            })
                                                            console.log(result11)
                                                        }
                                                    })
                                                }
                                            }
                                        }).sort({"_id":-1})
                                        
                                        console.log('update')
                                    }else{
                                        console.log('Account sts NtRenewed 2')
                                        RTregFull.updateOne({RtId:decoded.payload.id},{
                                            $set:{
                                                RtAcnSt:"Expr"
                                            }
                                        },(err,result10)=>{
                                            if(err){
                                                console.log(err)
                                            }else{
                                                RTregFull.find({RtId:decoded.payload.id},(err,result14)=>{
                                                    if(err){
                                                        console.log(err)
                                                    }else{
                                                        if(result14.length > 0){
                                                            const obj1 = {
                                                                RtId:result14[0].RtId,
                                                                RtShNm:result14[0].RtShNm,
                                                                RtShBrcNm:result14[0].RtShBrcNm,
                                                                RtUnm:result14[0].RtUnm,
                                                                RtUsrNm:result14[0].RtUsrNm,
                                                                RtUsrTy:result14[0].RtUsrTy,
                                                                RtUsrImg:result14[0].RtUsrImg,
                            
                                                                RtUsrGnd:result14[0].RtUsrGnd,
                                                                RtUsrYob1:result14[0].RtUsrYob1,
                                                                RtUsrYob2:result14[0].RtUsrYob2,
                                                                RtUsrIdImg:result14[0].RtUsrIdImg,
                                                                RtShIdImg:result14[0].RtShIdImg,
                                                                RtLgImg1:result14[0].RtLgImg1,
                                                                RtLgImg2:result14[0].RtLgImg2,
                                                                RtSlOrg:result14[0].RtSlOrg,
                            
                                                                RtStrOpLvTy:result14[0].RtStrOpLvTy,
                                                                RtStrOpLvSt:result14[0].RtStrOpLvSt,
                                                                RtStrOpD:result14[0].RtStrOpD,
                                                                RtStrOpN1:result14[0].RtStrOpN1,
                                                                RtStrOpN2:result14[0].RtStrOpN2,
                                                                RtStrOpN3:result14[0].RtStrOpN3,
                                                                RtLcnTy:result14[0].RtLcnTy,
                                                                RtStrSpl:result14[0].RtStrSpl,
                            
                                                                RtMlId:result14[0].RtMlId,                                
                                                                RtPhn:result14[0].RtPhn,
                                                                RtCsMlId:result14[0].RtCsMlId,
                                                                RtCsPhn:result14[0].RtCsPhn,
                                                                RtTy1:result14[0].RtTy1,
                                                                RtBrNm:result14[0].RtBrNm,
                                                                RtTy2:result14[0].RtTy2,
                                                                RtMnLm:result14[0].RtMnLm,
                                                                RtSbLm:result14[0].RtSbLm,
                            
                                                                RtStrDt1:result14[0].RtStrDt1,
                                                                RtStrDt2:result14[0].RtStrDt2,
                                                                RtStrDt3:result14[0].RtStrDt3,
                                                                RtExpDt1:result14[0].RtExpDt1,
                                                                RtExpDt2:result14[0].RtExpDt2,
                                                                RtExpDt3:result14[0].RtExpDt3,
                                                                RtPlnTy:result14[0].RtPlnTy,
                                                                RtPlnTyNm:result14[0].RtPlnTyNm,
                                                                RtPlnNm:result14[0].RtPlnNm,
                                                                RtPlnDys:result14[0].RtPlnDys,
                                                                RtPlnAmt:result14[0].RtPlnAmt,
                                                                RtAcnSt:result14[0].RtAcnSt,
                                                                RtLcnNo:result14[0].RtLcnNo,
                                                                RtShImg:result14[0].RtShImg,
                            
                                                                RtShCo:result14[0].RtShCo,
                                                                RtShCo2:result14[0].RtShCo2,
                                                                RtShCoCd:result14[0].RtShCoCd,
                                                                RtShCoLn:result14[0].RtShCoLn,
                                                                RtPdAmt:result14[0].RtPdAmt,
                                                                RtPdAmtDt:result14[0].RtPdAmtDt,
                                                                RtPdAmtTm:result14[0].RtPdAmtTm,
                                                                RtRnwSt:result14[0].RtRnwSt,
                                                                RtAcnBlkSt:result8[0].RtAcnBlkSt,
                                                                RtAdr1:result14[0].RtAdr1,
                                                                RtAdr2:result14[0].RtAdr2,
                                                                RtAdr3:result14[0].RtAdr3,
                                                                RtAdr4:result14[0].RtAdr4,
                                                                RtAdr5:result14[0].RtAdr5,
                                                                RtAdr6:result14[0].RtAdr6,
                                                                RtAdr7:result14[0].RtAdr7,
                            
                                                                RtPin:result14[0].RtPin,
                                                                RtSt:result14[0].RtSt,
                                                                RtSt2:result14[0].RtSt2,
                                                                RtLdMk:result14[0].RtLdMk,
                                                                RtRefTy:result14[0].RtRefTy,
                                                                RtRefCd:result14[0].RtRefCd,
                                                                RtRefCdUsg:result14[0].RtRefCdUsg,
                                                                RtRegTy:result14[0].RtRegTy,
                                                                RtRegDt1:result14[0].RtRegDt1,
                                                                RtRegDt2:result14[0].RtRegDt2,
                                                                RtSlId:result14[0].RtSlId,

                                                                RtHbl:result14[0].RtHbl,
                                                                RtHbl2:result14[0].RtHbl2,
                                                                RtHbl3:result14[0].RtHbl3,
                                                                RtTlk:result14[0].RtTlk,
                                                                RtTlk2:result14[0].RtTlk2,
                                                                RtTlk3:result14[0].RtTlk3,
                                                                RtDst:result14[0].RtDst,
                                                                RtDst2:result14[0].RtDst2
                            
                                                        }
                                                        // console.log('Send data3')
                                                        // console.log(obj1)
                                                       console.log('Expired')
                                                        res.json(obj1)
                                                        }
                                                    }
                                                })
                                                // console.log(result11)
                                                // res.json('Expired')
                                                // console.log(result10)
                                            }
                                        })
                                    }
            
                                }else if(result8[0].RtAcnSt === 'Expr'){
                                    console.log('Account sts Expr')
                                    const obj3 = {
                                        RtId:result8[0].RtId,
                                        RtShNm:result8[0].RtShNm,
                                        RtShBrcNm:result8[0].RtShBrcNm,
                                        RtUnm:result8[0].RtUnm,
                                        RtUsrNm:result8[0].RtUsrNm,
                                        RtUsrTy:result8[0].RtUsrTy,
                                        RtUsrImg:result8[0].RtUsrImg,
    
                                        RtUsrGnd:result8[0].RtUsrGnd,
                                        RtUsrYob1:result8[0].RtUsrYob1,
                                        RtUsrYob2:result8[0].RtUsrYob2,
                                        RtUsrIdImg:result8[0].RtUsrIdImg,
                                        RtShIdImg:result8[0].RtShIdImg,
                                        RtLgImg1:result8[0].RtLgImg1,
                                        RtLgImg2:result8[0].RtLgImg2,
                                        RtSlOrg:result8[0].RtSlOrg,
    
                                        RtStrOpLvTy:result8[0].RtStrOpLvTy,
                                        RtStrOpLvSt:result8[0].RtStrOpLvSt,
                                        RtStrOpD:result8[0].RtStrOpD,
                                        RtStrOpN1:result8[0].RtStrOpN1,
                                        RtStrOpN2:result8[0].RtStrOpN2,
                                        RtStrOpN3:result8[0].RtStrOpN3,
                                        RtLcnTy:result8[0].RtLcnTy,
                                        RtStrSpl:result8[0].RtStrSpl,
    
                                        RtMlId:result8[0].RtMlId,                                
                                        RtPhn:result8[0].RtPhn,
                                        RtCsMlId:result8[0].RtCsMlId,
                                        RtCsPhn:result8[0].RtCsPhn,
                                        RtTy1:result8[0].RtTy1,
                                        RtBrNm:result8[0].RtBrNm,
                                        RtTy2:result8[0].RtTy2,
                                        RtMnLm:result8[0].RtMnLm,
                                        RtSbLm:result8[0].RtSbLm,
    
                                        RtStrDt1:result8[0].RtStrDt1,
                                        RtStrDt2:result8[0].RtStrDt2,
                                        RtStrDt3:result8[0].RtStrDt3,
                                        RtExpDt1:result8[0].RtExpDt1,
                                        RtExpDt2:result8[0].RtExpDt2,
                                        RtExpDt3:result8[0].RtExpDt3,
                                        RtPlnTy:result8[0].RtPlnTy,
                                        RtPlnTyNm:result8[0].RtPlnTyNm,
                                        RtPlnNm:result8[0].RtPlnNm,
                                        RtPlnDys:result8[0].RtPlnDys,
                                        RtPlnAmt:result8[0].RtPlnAmt,
                                        RtAcnSt:result8[0].RtAcnSt,
                                        RtLcnNo:result8[0].RtLcnNo,
                                        RtShImg:result8[0].RtShImg,
    
                                        RtShCo:result8[0].RtShCo,
                                        RtShCo2:result8[0].RtShCo2,
                                        RtShCoCd:result8[0].RtShCoCd,
                                        RtShCoLn:result8[0].RtShCoLn,
                                        RtPdAmt:result8[0].RtPdAmt,
                                        RtPdAmtDt:result8[0].RtPdAmtDt,
                                        RtPdAmtTm:result8[0].RtPdAmtTm,
                                        RtRnwSt:result8[0].RtRnwSt,
                                        RtAcnBlkSt:result8[0].RtAcnBlkSt,
                                        RtAdr1:result8[0].RtAdr1,
                                        RtAdr2:result8[0].RtAdr2,
                                        RtAdr3:result8[0].RtAdr3,
                                        RtAdr4:result8[0].RtAdr4,
                                        RtAdr5:result8[0].RtAdr5,
                                        RtAdr6:result8[0].RtAdr6,
                                        RtAdr7:result8[0].RtAdr7,
    
                                        RtPin:result8[0].RtPin,
                                        RtSt:result8[0].RtSt,
                                        RtSt2:result8[0].RtSt2,
                                        RtLdMk:result8[0].RtLdMk,
                                        RtRefTy:result8[0].RtRefTy,
                                        RtRefCd:result8[0].RtRefCd,
                                        RtRefCdUsg:result8[0].RtRefCdUsg,
                                        RtRegTy:result8[0].RtRegTy,
                                        RtRegDt1:result8[0].RtRegDt1,
                                        RtRegDt2:result8[0].RtRegDt2,
                                        RtSlId:result8[0].RtSlId,

                                        RtHbl:result8[0].RtHbl,
                                        RtHbl2:result8[0].RtHbl2,
                                        RtHbl3:result8[0].RtHbl3,
                                        RtTlk:result8[0].RtTlk,
                                        RtTlk2:result8[0].RtTlk2,
                                        RtTlk3:result8[0].RtTlk3,
                                        RtDst:result8[0].RtDst,
                                        RtDst2:result8[0].RtDst2                                                              

    
                                }


                                    // console.log('expired')
                                    res.json(obj3)
                                }else if(result8[0].RtAcnSt === 'NtActv'){
                                    console.log('Account sts NtActv 2')
                                //     const obj2 = {
                                //         RtId:result8[0].RtId,
                                //         RtShNm:result8[0].RtShNm,
                                //         RtShBrcNm:result8[0].RtShBrcNm,
                                //         RtUnm:result8[0].RtUnm,
                                //         RtUsrNm:result8[0].RtUsrNm,
                                //         RtUsrTy:result8[0].RtUsrTy,
                                //         RtUsrImg:result8[0].RtUsrImg,
    
                                //         RtUsrGnd:result8[0].RtUsrGnd,
                                //         RtUsrYob1:result8[0].RtUsrYob1,
                                //         RtUsrYob2:result8[0].RtUsrYob2,
                                //         RtUsrIdImg:result8[0].RtUsrIdImg,
                                //         RtShIdImg:result8[0].RtShIdImg,
                                //         RtLgImg1:result8[0].RtLgImg1,
                                //         RtLgImg2:result8[0].RtLgImg2,
                                //         RtSlOrg:result8[0].RtSlOrg,
    
                                //         RtStrOpLvTy:result8[0].RtStrOpLvTy,
                                //         RtStrOpLvSt:result8[0].RtStrOpLvSt,
                                //         RtStrOpD:result8[0].RtStrOpD,
                                //         RtStrOpN1:result8[0].RtStrOpN1,
                                //         RtStrOpN2:result8[0].RtStrOpN2,
                                //         RtStrOpN3:result8[0].RtStrOpN3,
                                //         RtLcnTy:result8[0].RtLcnTy,
                                //         RtStrSpl:result8[0].RtStrSpl,
    
                                //         RtMlId:result8[0].RtMlId,                                
                                //         RtPhn:result8[0].RtPhn,
                                //         RtCsMlId:result8[0].RtCsMlId,
                                //         RtCsPhn:result8[0].RtCsPhn,
                                //         RtTy1:result8[0].RtTy1,
                                //         RtBrNm:result8[0].RtBrNm,
                                //         RtTy2:result8[0].RtTy2,
                                //         RtMnLm:result8[0].RtMnLm,
                                //         RtSbLm:result8[0].RtSbLm,
    
                                //         RtStrDt1:result8[0].RtStrDt1,
                                //         RtStrDt2:result8[0].RtStrDt2,
                                //         RtStrDt3:result8[0].RtStrDt3,
                                //         RtExpDt1:result8[0].RtExpDt1,
                                //         RtExpDt2:result8[0].RtExpDt2,
                                //         RtExpDt3:result8[0].RtExpDt3,
                                //         RtPlnTy:result8[0].RtPlnTy,
                                //         RtPlnNm:result8[0].RtPlnNm,
                                //         RtPlnDys:result8[0].RtPlnDys,
                                //         RtPlnAmt:result8[0].RtPlnAmt,
                                //         RtAcnSt:result8[0].RtAcnSt,
                                //         RtLcnNo:result8[0].RtLcnNo,
                                //         RtShImg:result8[0].RtShImg,
    
                                //         RtShCo:result8[0].RtShCo,
                                //         RtShCoCd:result8[0].RtShCoCd,
                                //         RtShCoLn:result8[0].RtShCoLn,
                                //         RtPdAmt:result8[0].RtPdAmt,
                                //         RtPdAmtDt:result8[0].RtPdAmtDt,
                                //         RtPdAmtTm:result8[0].RtPdAmtTm,
                                //         RtRnwSt:result8[0].RtRnwSt,
                                //         RtAdr1:result8[0].RtAdr1,
                                //         RtAdr2:result8[0].RtAdr2,
                                //         RtAdr3:result8[0].RtAdr3,
                                //         RtAdr4:result8[0].RtAdr4,
                                //         RtAdr5:result8[0].RtAdr5,
                                //         RtAdr6:result8[0].RtAdr6,
                                //         RtAdr7:result8[0].RtAdr7,
    
                                //         RtPin:result8[0].RtPin,
                                //         RtSt:result8[0].RtSt,
                                //         RtLdMk:result8[0].RtLdMk,
                                //         RtRefTy:result8[0].RtRefTy,
                                //         RtRefCd:result8[0].RtRefCd,
                                //         RtRefCdUsg:result8[0].RtRefCdUsg,
                                //         RtRegTy:result8[0].RtRegTy,
                                //         RtRegDt1:result8[0].RtRegDt1,
                                //         RtRegDt2:result8[0].RtRegDt2,
                                //         RtSlId:result8[0].RtSlId,
    
                                // }
                                RTregFull.findOneAndDelete({RtId:decoded.payload.id},(err,result27)=>{
                                    if(err){
                                        console.log(err)
                                    }else{
                                        console.log('Removed or Deleted')
                                        res.json('Removed or Deleted')
                                    }
                                })
                                    // res.json(obj2)
                                    console.log('Initial activation not done')
                                }else{
                                    console.log('Account status unknown')
                                }                   
                            }else{
                                console.log('Nothing')
                            }
                            
                        }else{
                            console.log('no JWT result found or same RtId')
                        }
                    }
                })
            }else{
                console.log('No user found or wrong')
            }
        }else{
            console.log('Avoid Twice load')
        }
    }
    catch(error){
        console.log('Error token')
        res.status(401).send(error)
    }

})

RoutesReg.route('/addRtPln').post((req,res)=>{
    
    const data = RtplnTy(req.body)
        data.save()
        .then(response=>{
            console.log(response)
            res.json('Stored in RtPln')
        })
        .catch(err=>{
            console.log(err)
        })
})
RoutesReg.route('/getRtPln').post((req,res)=>{
    console.log(req.body)
    RtplnTy.find({FieldOne:req.body.FieldOne},(err,result)=>{
        if(err){
            console.log(err)
        }else{
            if(result.length > 0){
                console.log(result[0].FieldThree)
                res.json(result[0].FieldThree)
            }
                     
        }
    })
       
})


RoutesReg.route('/addRtPln0').post((req,res)=>{
    const data = Rtpln0(req.body)
        data.save()
        .then(response=>{
            console.log(response)
            res.json('Stored in RtPln0')
        })
        .catch(err=>{
            console.log(err)
        })
})
RoutesReg.route('/getRtPln0').post((req,res)=>{
    Rtpln0.find({FieldOne:req.body.FieldOne},(err,result)=>{
        if(err){
            console.log(err)
        }else{
            if(result.length > 0){
                console.log(result[0].FieldTwo)
                res.json(result[0].FieldTwo)
            }
                     
        }
    })
       
})



RoutesReg.route('/addRtPln2').post((req,res)=>{
    const data = RtplnTy2(req.body)
        data.save()
        .then(response=>{
            console.log(response)
            res.json('Stored in RtPln2')
        })
        .catch(err=>{
            console.log(err)
        })
})

RoutesReg.route('/getRtPln2').post((req,res)=>{
    RtplnTy2.find({FieldOne:req.body.FieldOne},(err,result)=>{
        if(err){
            console.log(err)
        }else{
            if(result.length > 0){
                console.log(result[0].FieldTwo)
                res.json(result[0].FieldTwo)
            }
                     
        }
    })
       
})


RoutesReg.route('/addRtPln3').post((req,res)=>{
    const data = RtplnTy3(req.body)
        data.save()
        .then(response=>{
            console.log(response)
            res.json('Stored in RtPln3')
        })
        .catch(err=>{
            console.log(err)
        })
})
RoutesReg.route('/getRtPln3').post((req,res)=>{
    RtplnTy3.find({FieldOne:req.body.FieldOne},(err,result)=>{
        if(err){
            console.log(err)
        }else{
            if(result.length > 0){
                console.log(result[0].FieldThree)
                res.json(result[0].FieldThree)
            }
                     
        }
    })
       
})


RoutesReg.route('/ActOne1').post((req,res)=>{
    console.log('/ActOne1')
    console.log(req.body)
   
    const TransId = nanoid()
    RTregFull.find({RtId:req.body.RtId},(err,result)=>{
        if(err){
            console.log(err)
        }else{
            RTregFull.find({RtUnm:result[0].RtUnm},(err,result10)=>{
                if(err){
                    console.log(err)
                }else{
                    console.log('result10.length')
                    console.log(result10.length)
                    if(result10.length === 1){
                        RTregFull.find({RtMlId:result[0].RtMlId},(err,result20)=>{
                            if(err){
                                console.log(err)
                            }else{
                                console.log('result20.length')
                                console.log(result20.length)
                                if(result20.length === 1){
                                    // console.log(result[0].RtPlnTy)
                                if(result.length > 0){
                                    if(result[0].RtAcnSt==='NtActv'){
                                        RtplnTy.find({FieldOne:result[0].RtPlnNm},(err,result2)=>{
                                            if(err){
                                                console.log(err)
                                            }else{
                                                // console.log(result2)
                                                var MyDate = new Date();
                                                const date = MyDate.getDate()+ '/'+(MyDate.getMonth()+1)+'/'+MyDate.getFullYear()
                                                const MyDateString = MyDate.getFullYear() + ('0' + (MyDate.getMonth()+1)).slice(-2)  +('0' + MyDate.getDate()).slice(-2);     
                                                const Mydate3 = new Date();         // ISO date 1

                                                function formatAMPM() {
                                                    var hours = MyDate.getHours();
                                                    var minutes = MyDate.getMinutes();
                                                    // var seconds = MyDate2.getSeconds();
                                                    var ampm = hours >= 12 ? 'PM' : 'AM';
                                                    hours = hours % 12;
                                                    hours = hours ? hours : 12; // the hour '0' should be '12'
                                                    minutes = minutes < 10 ? '0'+minutes : minutes;
                                                    // console.log(minutes)
                                                    // seconds = seconds < 10 ? '0'+seconds : seconds; 
                                                    // var strTime = hours + ':' + minutes +  ':' + seconds + ' ' + ampm;
                                                    var strTime = hours + ':' + minutes + ' ' + ampm;
                                                    return strTime;
                                                    }
                                            
                                                    const nan2 = customAlphabet('0123456789',4)
                                                    var MyDate = new Date();
                                                    const receiptGen = (MyDate.getFullYear()-2000) + ('0' + (MyDate.getMonth()+1)).slice(-2)  +('0' + MyDate.getDate()).slice(-2)+('0'+MyDate.getHours()).slice(-2)+('0'+MyDate.getMinutes()).slice(-2)+('0'+MyDate.getSeconds()).slice(-2)+nan2();
                                                
                                                    var instance = new Razorpay({
                                                        key_id : 'rzp_test_e2S1oPV2nG4FbW',
                                                        key_secret : 'NPb4FYnkRWEofFR192zLZow0',
                                                    });
                                                    instance.orders.create({
                                                        amount: (result2[0].FieldThree[0].FAmt)*100,
                                                        currency: 'INR',
                                                        receipt:MyDateString,
                                                        notes:{
                                                            key1:"value2",
                                                            key2:"value4"
                                                        }
                                                    },(err,result3)=>{
                                                        if(err){
                                                            console.log(err)
                                                        }else{

                                                            const obj = {
                                                                RtId:req.body.RtId,
                                                                TranId:TransId,
                                                                OrderId:result3.id,
                                                                DateA1:date,
                                                                DateA2:MyDateString,
                                                                DateA3:Mydate3,
                                                                TimeA1:formatAMPM(),
                                                                TimeA2:'time2',
                                                                Amt:result2[0].FieldThree[0].FAmt,
                                                                PlnNm:result2[0].FieldThree[0].PlNm,
                                                                TranTy:'Activation',
                                                                TranSts:'Ord_Created',
                                                                RecptNo:receiptGen,
                                                                RzPayId:''
                                                            
                                                            }
                                                            const add = transaction(obj)
                                                            add.save()
                                                            .then(response=>{
                                                                // console.log(response)

                                                                var PayData = {
                                                                    id: result3.id,
                                                                    entity: result3.entity,
                                                                    amount: result3.amount,
                                                                    amount_paid: result3.amount_paid,
                                                                    amount_due: result3.amount_due,
                                                                    currency: result3.currency,
                                                                    receipt: result3.receipt,
                                                                    offer_id: result3.offer_id,
                                                                    status: result3.status,
                                                                    attempts: result3.attempts,
                                                                    notes: result3.notes,
                                                                    created_at: result3.created_at,
                                                                    key_id:instance.key_id,
                                                                    Rt_tran_id:TransId,
                                                                    Rt_id:req.body.RtId,
                                                                    RtPlnNm:result2[0].FieldThree[0].PlNm,
                                                                    RecptNo:receiptGen,
                                                                    RtRfCd:result[0].RtRefCd
                                                                }
                                                                // console.log(PayData)
                                                                console.log('Activation Started')
                                                                console.log((result2[0]))
                                                                res.json(PayData)

                                                            })
                                                            .catch(err=>{
                                                                console.log(err)
                                                            })
                                                
                                                        }
                                                    })                         
                                                                            
                                            }

                                        })            
                                    }else if(result[0].RtAcnSt==='Expr'){
                                        console.log('Expired')
                                        res.json('Expired')
                                    }else{
                                        console.log('Already Active one')
                                        res.json('Already Active one')
                                    }
                                }else{
                                    res.json('RTId not found')
                                    console.log('RTId not found')
                                }
                                }else{
                                    res.json('Email exist/deleted')
                                    console.log('Email exists(if length is > 1) or deleted(if length is < 0)')
                                }
                            }
                        })

                    }else{
                        console.log('Unique Name exists(if length is > 1) or deleted(if length is < 0)')
                    }
                }
            })
            
            
        }

    })
       
})



RoutesReg.route('/ActOne2').post((req,res)=>{
    console.log('/ActOne2')
    console.log(req.body)
    var hmacSHA = require('crypto-js/hmac-sha256');
    var Hex = require("crypto-js/enc-hex");
    var secret = 'NPb4FYnkRWEofFR192zLZow0'
    var signature1 = Hex.stringify(hmacSHA(req.body.Rp_ord_id +'|'+req.body.Rp_pym_id,secret))

    if(signature1 === req.body.Rp_sgn_id){
        RTregFull.find({RtId:req.body.Rt_id},(err,result19)=>{
            if(err){
                console.log(err)
            }else{
                if(result19.length > 0){
                    RtplnTy.find({FieldOne:req.body.RtPlnNm},(err,result5)=>{
                        if(err){
                            console.log(err)
                        }else{
                            // console.log(result5[0].length)
            
                            const num1 = result5[0].FieldThree[0].Dys;
                                                    
            
                                                    // console.log(MyDate)
                                                    var MyDate = new Date();
                                                    const date = MyDate.getDate()+ '/'+(MyDate.getMonth()+1)+'/'+MyDate.getFullYear()
                                                    const MyDateString = MyDate.getFullYear() + ('0' + (MyDate.getMonth()+1)).slice(-2)  +('0' + MyDate.getDate()).slice(-2);     
                                                    const Mydate3 = new Date();         // ISO date 1
                                                   
            
                                                    MyDate.setDate(MyDate.getDate() + (num1-1));              
                                                    const date2 = MyDate.getDate()+ '/'+(MyDate.getMonth()+1)+'/'+MyDate.getFullYear()
                                                    const MyDateStringTwo = MyDate.getFullYear() + ('0' + (MyDate.getMonth()+1)).slice(-2)  +('0' + MyDate.getDate()).slice(-2);
            
            
                                                   
                                                    const Mydate4 = new Date();         // ISO date 2
                                                    Mydate4.setDate(Mydate4.getDate()+(num1-1)) 
                                                    Mydate4.setHours(0,0,0,0)
            
                                                    function formatAMPM() {
                                                    var hours = MyDate.getHours();
                                                    var minutes = MyDate.getMinutes();
                                                    // var seconds = MyDate2.getSeconds();
                                                    var ampm = hours >= 12 ? 'PM' : 'AM';
                                                    hours = hours % 12;
                                                    hours = hours ? hours : 12; // the hour '0' should be '12'
                                                    minutes = minutes < 10 ? '0'+minutes : minutes;
                                                    // console.log(minutes)
                                                    // seconds = seconds < 10 ? '0'+seconds : seconds; 
                                                    // var strTime = hours + ':' + minutes +  ':' + seconds + ' ' + ampm;
                                                    var strTime = hours + ':' + minutes + ' ' + ampm;
                                                    return strTime;
                                                    }
                                                    // Date array with plain using for loop condition
            
                                                    var MyDateString1=[];
            
                                                    for(let i=0; i<num1; i++){
                                                    var MyDate2 = new Date();
                                                    var MyDateString3
            
                                                    MyDate2.setDate(MyDate2.getDate() + i);
            
                                                    MyDateString3 = ('0' + MyDate2.getDate()).slice(-2) + ('0' + (MyDate2.getMonth()+1)).slice(-2) + MyDate2.getFullYear();
                                                        //  console.log(MyDateString)
                                                         MyDateString1.push({Dt:MyDateString3})             
                                                        //  console.log(MyDateString1)
                                                    } 
                                                    RTregFull.updateOne({RtId:req.body.Rt_id},{
                                                        $set:{
                                                            RtStrDt1:date,
                                                            RtStrDt2:MyDateString,
                                                            RtStrDt3:Mydate3,
                                                            RtExpDt1:date2,
                                                            RtExpDt2:MyDateStringTwo,
                                                            RtExpDt3:Mydate4,
                                                            RtAcnSt:"Actv",

                                                            RtMnLm:result5[0].FieldThree[0].MnLm,
                                                            RtSbLm:result5[0].FieldThree[0].SbLm,
                                                            RtPlnDys:result5[0].FieldThree[0].Dys, 
                                                            RtPlnNm:result5[0].FieldThree[0].PlNm, 

                                                            RtPdAmt:result5[0].FieldThree[0].FAmt,
                                                            RtPdAmtDt:date,
                                                            RtPdAmtTm:formatAMPM(),
                                                            RtRnwSt:'NtRenewed'
                                                        }
                                                    },(err,result6)=>{
                                                        if(err){
                                                            console.log(err)
                                                        }else{
                                                            // console.log(result5)
                                                            if(result6.modifiedCount === 1){
                                                                transaction.updateOne({TranId:req.body.Rt_tran_id},{
                                                                    $set:{
                                                                        DateB1:date,
                                                                        DateB2:MyDateString,
                                                                        DateB3:Mydate3,
                                                                        TimeB1:formatAMPM(),
                                                                        TimeB2:'Time',
                                                                        TranSts:'Success',
                                                                        RzPayId:req.body.Rp_pym_id
                                                                    }
                                                                },(err,result7)=>{
                                                                    if(err){
                                                                        console.log(err)
                                                                    }else{
                                                                        if(req.body.RtRfCd.length > 0){
                                                                            const objRfRt = {
                                                                                    RtId:req.body.Rt_id,
                                                                                    RtPlNm:result5[0].FieldThree[0].PlNm,
                                                                                    RfRtCd:req.body.RtRfCd,
                                                                                    RfPlCd:result5[0].FieldThree[0].PlCd
                                                                            }
                                                                            const addRtRfCd = RfRtCd(objRfRt)
                                                                                addRtRfCd.save()
                                                                                .then(response15=>{
                                                                                    // console.log(response15)
                                                                                    console.log("Activation Success 1 RfCd")
                                                                                    res.json('Activation Success 1 RfCd')
                                                                                })
                                                                                .catch(err=>{
                                                                                    console.log(err)
                                                                                })
                                                                            
                                                                        }else{
                                                                            console.log("Activation Success 1")
                                                                            res.json('Activation Success 1')
                                                                        }
                                                                        // console.log(result6)
                                                                        
                                                                    }
                                                                })
                                                               
                                                            }else{
                                                                res.json('Error or Already Activated')
                                                            }
                                                        }
                                                    })
                                                  
            
                        }
            
                    }) 



                }else{
                    console.log('Not found')
                }
            }
        })
               
                                                                                            
    }else{
        console.log('Failure')
        res.json('Failure')
    }
})



RoutesReg.route('/ActTwo1').post((req,res)=>{
   console.log(req.body)
    const TransId = nanoid()
    RTregFull.find({RtId:req.body.RtId},(err,result)=>{
        if(err){
            console.log(err)
        }else{
            // console.log(result[0].RtPlnTy)
            if(result.length > 0){
                if(result[0].RtAcnSt==='Expr'){
                    if(result[0].RtRnwSt==='NtRenewed'){
                    RtplnTy3.find({FieldOne:req.body.PlnNm},(err,result2)=>{
                        if(err){
                            console.log(err)
                        }else{
                            // console.log(result2)
                            var MyDate = new Date();
                            const date = MyDate.getDate()+ '/'+(MyDate.getMonth()+1)+'/'+MyDate.getFullYear()
                            const MyDateString = MyDate.getFullYear() + ('0' + (MyDate.getMonth()+1)).slice(-2)  +('0' + MyDate.getDate()).slice(-2);     
                            const Mydate3 = new Date();         // ISO date 1

                            function formatAMPM() {
                                var hours = MyDate.getHours();
                                var minutes = MyDate.getMinutes();
                                // var seconds = MyDate2.getSeconds();
                                var ampm = hours >= 12 ? 'PM' : 'AM';
                                hours = hours % 12;
                                hours = hours ? hours : 12; // the hour '0' should be '12'
                                minutes = minutes < 10 ? '0'+minutes : minutes;
                                // console.log(minutes)
                                // seconds = seconds < 10 ? '0'+seconds : seconds; 
                                // var strTime = hours + ':' + minutes +  ':' + seconds + ' ' + ampm;
                                var strTime = hours + ':' + minutes + ' ' + ampm;
                                return strTime;
                                }
                        
                                const nan2 = customAlphabet('0123456789',4)
                                var MyDate = new Date();
                                const receiptGen = (MyDate.getFullYear()-2000) + ('0' + (MyDate.getMonth()+1)).slice(-2)  +('0' + MyDate.getDate()).slice(-2)+('0'+MyDate.getHours()).slice(-2)+('0'+MyDate.getMinutes()).slice(-2)+('0'+MyDate.getSeconds()).slice(-2)+nan2();
                            
                                var instance = new Razorpay({
                                    key_id : 'rzp_test_e2S1oPV2nG4FbW',
                                    key_secret : 'NPb4FYnkRWEofFR192zLZow0',
                                });
                                instance.orders.create({
                                    amount: (result2[0].FieldThree[0].FAmt)*100,
                                    currency: 'INR',
                                    receipt:MyDateString,
                                    notes:{
                                        key1:"value2",
                                        key2:"value4"
                                    }
                                },(err,result3)=>{
                                    if(err){
                                        console.log(err)
                                    }else{

                                        const obj = {
                                            RtId:req.body.RtId,
                                            TranId:TransId,
                                            OrderId:result3.id,
                                            DateA1:date,
                                            DateA2:MyDateString,
                                            DateA3:Mydate3,
                                            TimeA1:formatAMPM(),
                                            TimeA2:'time2',
                                            Amt:result2[0].FieldThree[0].FAmt,
                                            PlnNm:result2[0].FieldThree[0].PlNm,
                                            TranTy:'Renewal on Expire',
                                            TranSts:'Ord_Created',
                                            RecptNo:receiptGen,
                                            RzPayId:'',
                                        }
                                        const add = transaction(obj)
                                        add.save()
                                        .then(response=>{
                                            // console.log(response)

                                            var PayData = {
                                                id: result3.id,
                                                entity: result3.entity,
                                                amount: result3.amount,
                                                amount_paid: result3.amount_paid,
                                                amount_due: result3.amount_due,
                                                currency: result3.currency,
                                                receipt: result3.receipt,
                                                offer_id: result3.offer_id,
                                                status: result3.status,
                                                attempts: result3.attempts,
                                                notes: result3.notes,
                                                created_at: result3.created_at,
                                                key_id:instance.key_id,
                                                Rt_tran_id:TransId,
                                                Rt_id:req.body.RtId,
                                                RtPlnNm:result2[0].FieldThree[0].PlNm,
                                                RecptNo:receiptGen
                                            }
                                            // console.log(PayData)
                                            console.log('Reactivation started')
                                            res.json(PayData)



                                        })
                                        .catch(err=>{
                                            console.log(err)
                                        })
                            
                                    }
                                })                         
                                                        
                        }

                    })     
                }else{
                    console.log('Already Renewed')
                    res.json('Already Renewed')
                }       
                }else{
                    console.log('Not Expired')
                    res.json('Not Expired')
                }
            }
            
        }

    })
       
})



RoutesReg.route('/ActTwo2').post((req,res)=>{
    console.log(req.body)
    var hmacSHA = require('crypto-js/hmac-sha256');
    var Hex = require("crypto-js/enc-hex");
    var secret = 'NPb4FYnkRWEofFR192zLZow0'
    var signature1 = Hex.stringify(hmacSHA(req.body.Rp_ord_id +'|'+req.body.Rp_pym_id,secret))

    if(signature1 === req.body.Rp_sgn_id){
        RTregFull.find({RtId:req.body.Rt_id},(err,result20)=>{
            if(err){
                console.log(err)
            }else{
                if(result20.length > 0){
                    RtplnTy3.find({FieldOne:req.body.RtPlnNm},(err,result5)=>{
                        if(err){
                            console.log(err)
                        }else{
                            // console.log(result5[0].length)
            
                            const num1 = result5[0].FieldThree[0].Dys;
                                                    
            
                                                    // console.log(MyDate)
                                                    var MyDate = new Date();
                                                    const date = MyDate.getDate()+ '/'+(MyDate.getMonth()+1)+'/'+MyDate.getFullYear()
                                                    const MyDateString = MyDate.getFullYear() + ('0' + (MyDate.getMonth()+1)).slice(-2)  +('0' + MyDate.getDate()).slice(-2);     
                                                    const Mydate3 = new Date();         // ISO date 1
                                                   
            
                                                    MyDate.setDate(MyDate.getDate() + (num1-1));              
                                                    const date2 = MyDate.getDate()+ '/'+(MyDate.getMonth()+1)+'/'+MyDate.getFullYear()
                                                    const MyDateStringTwo = MyDate.getFullYear() + ('0' + (MyDate.getMonth()+1)).slice(-2)  +('0' + MyDate.getDate()).slice(-2);
            
            
                                                   
                                                    const Mydate4 = new Date();         // ISO date 2
                                                    Mydate4.setDate(Mydate4.getDate()+(num1-1)) 
                                                    Mydate4.setHours(0,0,0,0)
            
                                                    function formatAMPM() {
                                                    var hours = MyDate.getHours();
                                                    var minutes = MyDate.getMinutes();
                                                    // var seconds = MyDate2.getSeconds();
                                                    var ampm = hours >= 12 ? 'PM' : 'AM';
                                                    hours = hours % 12;
                                                    hours = hours ? hours : 12; // the hour '0' should be '12'
                                                    minutes = minutes < 10 ? '0'+minutes : minutes;
                                                    // console.log(minutes)
                                                    // seconds = seconds < 10 ? '0'+seconds : seconds; 
                                                    // var strTime = hours + ':' + minutes +  ':' + seconds + ' ' + ampm;
                                                    var strTime = hours + ':' + minutes + ' ' + ampm;
                                                    return strTime;
                                                    }
                                                    // Date array with plain using for loop condition
            
                                                    var MyDateString1=[];
            
                                                    for(let i=0; i<num1; i++){
                                                    var MyDate2 = new Date();
                                                    var MyDateString3
            
                                                    MyDate2.setDate(MyDate2.getDate() + i);
            
                                                    MyDateString3 = ('0' + MyDate2.getDate()).slice(-2) + ('0' + (MyDate2.getMonth()+1)).slice(-2) + MyDate2.getFullYear();
                                                        //  console.log(MyDateString)
                                                         MyDateString1.push({Dt:MyDateString3})             
                                                        //  console.log(MyDateString1)
                                                    } 
                                                    RTregFull.updateOne({RtId:req.body.Rt_id},{
                                                        $set:{
                                                            RtStrDt1:date,
                                                            RtStrDt2:MyDateString,
                                                            RtStrDt3:Mydate3,
                                                            RtExpDt1:date2,
                                                            RtExpDt2:MyDateStringTwo,
                                                            RtExpDt3:Mydate4,
                                                            RtAcnSt:"Actv",

                                                            RtMnLm:result5[0].FieldThree[0].MnLm,
                                                            RtSbLm:result5[0].FieldThree[0].SbLm,
                                                            RtPlnDys:result5[0].FieldThree[0].Dys, 
                                                            RtPlnNm:result5[0].FieldThree[0].PlNm, 


                                                            RtPdAmt:result5[0].FieldThree[0].FAmt,
                                                            RtPdAmtDt:date,
                                                            RtPdAmtTm:formatAMPM(),
                                                            RtRnwSt:'NtRenewed',                                                        
                                                            RtRefCdUsg:'No'//set Yes/No, 'No' = applicable again  or 'Yes' = Not applicable again changed on 28/03/22
            
                                                        }
                                                    },(err,result6)=>{
                                                        if(err){
                                                            console.log(err)
                                                        }else{
                                                            // console.log(result5)
                                                            if(result6.modifiedCount === 1){
                                                                transaction.updateOne({TranId:req.body.Rt_tran_id},{
                                                                    $set:{
                                                                        DateB1:date,
                                                                        DateB2:MyDateString,
                                                                        DateB3:Mydate3,
                                                                        TimeB1:formatAMPM(),
                                                                        TimeB2:'Time',
                                                                        TranSts:'Success',
                                                                        RzPayId:req.body.Rp_pym_id
                                                                    }
                                                                },(err,result7)=>{
                                                                    if(err){
                                                                        console.log(err)
                                                                    }else{
                                                                        RfRtCd.deleteMany({RfRtCd:result20[0].RtUnm},(err,result25)=>{
                                                                            if(err){
                                                                                console.log(err)
                                                                            }else{
                                                                                console.log(result25)
                                                                                console.log("ReActivation Success")
                                                                                res.json('ReActivation Success')
                                                                            }
                                                                        })
                                                                        // console.log(result6)
                                                                       
                                                                    }
                                                                })
                                                               
                                                            }else{
                                                                res.json('Error or Already Activated')
                                                            }
                                                        }
                                                    })
                                                  
            
                        }
            
                    })

                }else{
                    console.log('Not found')
                }
            }
        })
               
                                                                                               
    }else{
        console.log('Failure')
        res.json('Failure')
    }
})



RoutesReg.route('/ActThree1').post((req,res)=>{
    console.log(req.body)
   
    const TransId = nanoid()
    RTregFull.find({RtId:req.body.RtId},(err,result)=>{
        if(err){
            console.log(err)
        }else{
            // console.log(result[0].RtPlnTy)
            if(result.length > 0){
                if(result[0].RtAcnSt==='Actv'){
                    if(result[0].RtRnwSt==='NtRenewed'){
                    RtplnTy3.find({FieldOne:req.body.PlnNm},(err,result2)=>{
                        if(err){
                            console.log(err)
                        }else{
                          if(result[0].RtRefCdUsg==='No'){     

                            RfRtCd.aggregate([{$match:{RfRtCd:result[0].RtUnm}},{$sort:{_id:-1}},{
          
                                $group:{
                                    _id:{RfRtCd:'$RfRtCd'},
                                    RfCdsum:{$sum:'$RfPlCd'}
                                }
                            } 
                        ]).exec(function(err,result){
                            if(err){
                                console.log(err)
                            }else{
                                console.log(result)
                                // console.log(result[0].RfCdsum)
                                // res.json(result)
                                if(result.length >0){
                                    if(result[0].RfCdsum >= 0 && result[0].RfCdsum < 6){
                                      var nm = result[0].RfCdsum
                                    }
                                    else if(result[0].RfCdsum >= 6){
                                        nm = 4
                                    }else{
                                        console.log('nothing')
                                    }
                                    console.log('nothing 2')
                                    console.log(nm)
                                }else{
                                    nm = 0
                                    console.log('nothing 3')
                                    console.log(nm)
                                }
                                console.log('nothing 4')
                                console.log(nm)
                            }
                             
                           // console.log(result2)
                           var MyDate = new Date();
                           const date = MyDate.getDate()+ '/'+(MyDate.getMonth()+1)+'/'+MyDate.getFullYear()
                           const MyDateString = MyDate.getFullYear() + ('0' + (MyDate.getMonth()+1)).slice(-2)  +('0' + MyDate.getDate()).slice(-2);     
                           const Mydate3 = new Date();         // ISO date 1

                           function formatAMPM() {
                               var hours = MyDate.getHours();
                               var minutes = MyDate.getMinutes();
                               // var seconds = MyDate2.getSeconds();
                               var ampm = hours >= 12 ? 'PM' : 'AM';
                               hours = hours % 12;
                               hours = hours ? hours : 12; // the hour '0' should be '12'
                               minutes = minutes < 10 ? '0'+minutes : minutes;
                               // console.log(minutes)
                               // seconds = seconds < 10 ? '0'+seconds : seconds; 
                               // var strTime = hours + ':' + minutes +  ':' + seconds + ' ' + ampm;
                               var strTime = hours + ':' + minutes + ' ' + ampm;
                               return strTime;
                               }
                       
                               const nan2 = customAlphabet('0123456789',4)
                               var MyDate = new Date();
                               const receiptGen = (MyDate.getFullYear()-2000) + ('0' + (MyDate.getMonth()+1)).slice(-2)  +('0' + MyDate.getDate()).slice(-2)+('0'+MyDate.getHours()).slice(-2)+('0'+MyDate.getMinutes()).slice(-2)+('0'+MyDate.getSeconds()).slice(-2)+nan2();
                           
                               var instance = new Razorpay({
                                   key_id : 'rzp_test_e2S1oPV2nG4FbW',
                                   key_secret : 'NPb4FYnkRWEofFR192zLZow0',
                               });
                               instance.orders.create({
                                   amount: ((result2[0].FieldThree[0].FAmt)-nm)*100,
                                   currency: 'INR',
                                   receipt:MyDateString,
                                   notes:{
                                       key1:"value2",
                                       key2:"value4"
                                   }
                               },(err,result3)=>{
                                   if(err){
                                       console.log(err)
                                   }else{

                                       const obj = {
                                           RtId:req.body.RtId,
                                           TranId:TransId,
                                           OrderId:result3.id,
                                           DateA1:date,
                                           DateA2:MyDateString,
                                           DateA3:Mydate3,
                                           TimeA1:formatAMPM(),
                                           TimeA2:'time2',
                                           Amt:result2[0].FieldThree[0].FAmt,
                                           PlnNm:result2[0].FieldThree[0].PlNm,
                                           TranTy:'Renewal',
                                           TranSts:'Ord_Created',
                                           RecptNo:receiptGen,
                                           RzPayId:'',
                                       }
                                       const add = transaction(obj)
                                       add.save()
                                       .then(response=>{
                                           // console.log(response)

                                           var PayData = {
                                               id: result3.id,
                                               entity: result3.entity,
                                               amount: result3.amount,
                                               amount_paid: result3.amount_paid,
                                               amount_due: result3.amount_due,
                                               currency: result3.currency,
                                               receipt: result3.receipt,
                                               offer_id: result3.offer_id,
                                               status: result3.status,
                                               attempts: result3.attempts,
                                               notes: result3.notes,
                                               created_at: result3.created_at,
                                               key_id:instance.key_id,
                                               Rt_tran_id:TransId,
                                               Rt_id:req.body.RtId,
                                               RtPlnNm:result2[0].FieldThree[0].PlNm,
                                               RecptNo:receiptGen
                                           }
                                           // console.log(PayData)
                                             

                                           const obj2 = {
                                               RtId:req.body.RtId,
                                               RtTranId:TransId,
                                               RtPlNm:result2[0].FieldThree[0].PlNm,
                                               RtPlnTy:result2[0].FieldTwo,
                                               RtMLlmt:result2[0].FieldThree[0].MnLm,
                                               RtSLmt:result2[0].FieldThree[0].SbLm,
                                               RtAmt1:result2[0].FieldThree[0].FAmt,
                                               RtAmt2:'',
                                               RtDys:result2[0].FieldThree[0].Dys,
                                               DateA1:date,
                                               DateA2:MyDateString,
                                               DateA3:Mydate3,
                                               DateB1:'',
                                               DateB2:'',
                                               DateB3:'',
                                               RnwlSts:'Started',
                                               RcptId:receiptGen,
                                               RzOrdId:result3.id,
                                               RzPayId:'',
                                            //    RtRefCdUsg:'Yes'
                                              
                                              
                                           }
                                           const AddData2 = RTRnwl(obj2)
                                           AddData2.save()
                                           .then(response3=>{
                                               // console.log(response3)
                                               console.log('Renewal started RfCd')
                                               res.json(PayData) 
                                           })
                                           .catch(err=>{
                                               console.log(err)
                                           })
                                                                        

                                       })
                                       .catch(err=>{
                                           console.log(err)
                                       })
                                       // console.log('glkasdkfla')
                                      
                           
                                   }
                               }) 
                            })

                          }else{

                          
                           
                           // console.log(result2)
                            var MyDate = new Date();
                            const date = MyDate.getDate()+ '/'+(MyDate.getMonth()+1)+'/'+MyDate.getFullYear()
                            const MyDateString = MyDate.getFullYear() + ('0' + (MyDate.getMonth()+1)).slice(-2)  +('0' + MyDate.getDate()).slice(-2);     
                            const Mydate3 = new Date();         // ISO date 1

                            function formatAMPM() {
                                var hours = MyDate.getHours();
                                var minutes = MyDate.getMinutes();
                                // var seconds = MyDate2.getSeconds();
                                var ampm = hours >= 12 ? 'PM' : 'AM';
                                hours = hours % 12;
                                hours = hours ? hours : 12; // the hour '0' should be '12'
                                minutes = minutes < 10 ? '0'+minutes : minutes;
                                // console.log(minutes)
                                // seconds = seconds < 10 ? '0'+seconds : seconds; 
                                // var strTime = hours + ':' + minutes +  ':' + seconds + ' ' + ampm;
                                var strTime = hours + ':' + minutes + ' ' + ampm;
                                return strTime;
                                }
                        
                                const nan2 = customAlphabet('0123456789',4)
                                var MyDate = new Date();
                                const receiptGen = (MyDate.getFullYear()-2000) + ('0' + (MyDate.getMonth()+1)).slice(-2)  +('0' + MyDate.getDate()).slice(-2)+('0'+MyDate.getHours()).slice(-2)+('0'+MyDate.getMinutes()).slice(-2)+('0'+MyDate.getSeconds()).slice(-2)+nan2();
                            
                                var instance = new Razorpay({
                                    key_id : 'rzp_test_e2S1oPV2nG4FbW',
                                    key_secret : 'NPb4FYnkRWEofFR192zLZow0',
                                });
                                instance.orders.create({
                                    amount: (result2[0].FieldThree[0].FAmt)*100,
                                    currency: 'INR',
                                    receipt:MyDateString,
                                    notes:{
                                        key1:"value2",
                                        key2:"value4"
                                    }
                                },(err,result3)=>{
                                    if(err){
                                        console.log(err)
                                    }else{

                                        const obj = {
                                            RtId:req.body.RtId,
                                            TranId:TransId,
                                            OrderId:result3.id,
                                            DateA1:date,
                                            DateA2:MyDateString,
                                            DateA3:Mydate3,
                                            TimeA1:formatAMPM(),
                                            TimeA2:'time2',
                                            Amt:result2[0].FieldThree[0].FAmt,
                                            PlnNm:result2[0].FieldThree[0].PlNm,
                                            TranTy:'Renewal',
                                            TranSts:'Ord_Created',
                                            RecptNo:receiptGen,
                                            RzPayId:'',
                                        }
                                        const add = transaction(obj)
                                        add.save()
                                        .then(response=>{
                                            // console.log(response)

                                            var PayData = {
                                                id: result3.id,
                                                entity: result3.entity,
                                                amount: result3.amount,
                                                amount_paid: result3.amount_paid,
                                                amount_due: result3.amount_due,
                                                currency: result3.currency,
                                                receipt: result3.receipt,
                                                offer_id: result3.offer_id,
                                                status: result3.status,
                                                attempts: result3.attempts,
                                                notes: result3.notes,
                                                created_at: result3.created_at,
                                                key_id:instance.key_id,
                                                Rt_tran_id:TransId,
                                                Rt_id:req.body.RtId,
                                                RtPlnNm:result2[0].FieldThree[0].PlNm,
                                                RecptNo:receiptGen
                                            }
                                            // console.log(PayData)
                                              

                                            const obj2 = {
                                                RtId:req.body.RtId,
                                                RtTranId:TransId,
                                                RtPlNm:result2[0].FieldThree[0].PlNm,
                                                RtPlnTy:result2[0].FieldTwo,
                                                RtMLlmt:result2[0].FieldThree[0].MnLm,
                                                RtSLmt:result2[0].FieldThree[0].SbLm,
                                                RtAmt1:result2[0].FieldThree[0].FAmt,
                                                RtAmt2:'',
                                                RtDys:result2[0].FieldThree[0].Dys,
                                                DateA1:date,
                                                DateA2:MyDateString,
                                                DateA3:Mydate3,
                                                DateB1:'',
                                                DateB2:'',
                                                DateB3:'',
                                                RnwlSts:'Started',
                                                RcptId:receiptGen,
                                                RzOrdId:result3.id,
                                                RzPayId:'',
                                                // RtRefCdUsg:'No'
                                               
                                               
                                            }
                                            const AddData2 = RTRnwl(obj2)
                                            AddData2.save()
                                            .then(response3=>{
                                                // console.log(response3)
                                                console.log('Renewal started')
                                                res.json(PayData) 
                                            })
                                            .catch(err=>{
                                                console.log(err)
                                            })
                                                                         

                                        })
                                        .catch(err=>{
                                            console.log(err)
                                        })
                                        // console.log('glkasdkfla')
                                       
                            
                                    }
                                })   
                            }                     
                                                      
                        }

                    })  
                }else{
                    console.log('Already Renewed')
                    res.json('Already Renewed')
                }          
                }else{
                    console.log('Not Active three')
                    res.json('Not Active three')
                }
            }
            
        }

    })
       
})



RoutesReg.route('/ActThree2').post((req,res)=>{
    console.log(req.body)
    var hmacSHA = require('crypto-js/hmac-sha256');
    var Hex = require("crypto-js/enc-hex");
    var secret = 'NPb4FYnkRWEofFR192zLZow0'
    var signature1 = Hex.stringify(hmacSHA(req.body.Rp_ord_id +'|'+req.body.Rp_pym_id,secret))

    if(signature1 === req.body.Rp_sgn_id){
        RTregFull.find({RtId:req.body.Rt_id},(err,result21)=>{
            if(err){
                console.log(err)
            }else{
                if(result21.length > 0){
                    RtplnTy3.find({FieldOne:req.body.RtPlnNm},(err,result5)=>{
                        if(err){
                            console.log(err)
                        }else{
                            // console.log(result5[0].length)
            
                            const num1 = result5[0].FieldThree[0].Dys;
                                                    
            
                                                    // console.log(MyDate)
                                                    var MyDate = new Date();
                                                    const date = MyDate.getDate()+ '/'+(MyDate.getMonth()+1)+'/'+MyDate.getFullYear()
                                                    const MyDateString = MyDate.getFullYear() + ('0' + (MyDate.getMonth()+1)).slice(-2)  +('0' + MyDate.getDate()).slice(-2);     
                                                    const Mydate3 = new Date();         // ISO date 1
                                                   
            
                                                    MyDate.setDate(MyDate.getDate() + (num1-1));              
                                                    const date2 = MyDate.getDate()+ '/'+(MyDate.getMonth()+1)+'/'+MyDate.getFullYear()
                                                    const MyDateStringTwo = MyDate.getFullYear() + ('0' + (MyDate.getMonth()+1)).slice(-2)  +('0' + MyDate.getDate()).slice(-2);
            
            
                                                   
                                                    const Mydate4 = new Date();         // ISO date 2
                                                    Mydate4.setDate(Mydate4.getDate()+(num1-1)) 
                                                    Mydate4.setHours(0,0,0,0)
            
                                                    function formatAMPM() {
                                                    var hours = MyDate.getHours();
                                                    var minutes = MyDate.getMinutes();
                                                    // var seconds = MyDate2.getSeconds();
                                                    var ampm = hours >= 12 ? 'PM' : 'AM';
                                                    hours = hours % 12;
                                                    hours = hours ? hours : 12; // the hour '0' should be '12'
                                                    minutes = minutes < 10 ? '0'+minutes : minutes;
                                                    // console.log(minutes)
                                                    // seconds = seconds < 10 ? '0'+seconds : seconds; 
                                                    // var strTime = hours + ':' + minutes +  ':' + seconds + ' ' + ampm;
                                                    var strTime = hours + ':' + minutes + ' ' + ampm;
                                                    return strTime;
                                                    }
                                                    // Date array with plain using for loop condition
            
                                                    // var MyDateString1=[];
            
                                                    // for(let i=0; i<num1; i++){
                                                    // var MyDate2 = new Date();
                                                    // var MyDateString3
            
                                                    // MyDate2.setDate(MyDate2.getDate() + i);
            
                                                    // MyDateString3 = ('0' + MyDate2.getDate()).slice(-2) + ('0' + (MyDate2.getMonth()+1)).slice(-2) + MyDate2.getFullYear();
                                                    //     //  console.log(MyDateString)
                                                    //      MyDateString1.push({Dt:MyDateString3})             
                                                    //     //  console.log(MyDateString1)
                                                    // } 
                                                    RTregFull.updateOne({RtId:req.body.Rt_id},{
                                                        $set:{
                                                            // RtStrDt1:date,
                                                            // RtStrDt2:MyDateString,
                                                            // RtStrDt3:Mydate3,
                                                            // RtExpDt1:date2,
                                                            // RtExpDt2:MyDateStringTwo,
                                                            // RtExpDt3:Mydate4,
                                                            // RtAcnSt:"Actv",
                                                            // RtPdAmt:result5[0].FieldThree[0].FAmt,
                                                            // RtPdAmtDt:date,
                                                            // RtPdAmtTm:formatAMPM()
                                                            RtRnwSt:'Renewed',
                                                            RtRefCdUsg:'No'//set Yes/No, 'No' = applicable again  or 'Yes' = Not applicable again changed on 28/03/22
                                                                  
                                                        }
                                                    },(err,result6)=>{
                                                        if(err){
                                                            console.log(err)
                                                        }else{
                                                            
                                                            if(result6.modifiedCount === 1){
                                                                transaction.updateOne({TranId:req.body.Rt_tran_id},{
                                                                    $set:{
                                                                        DateB1:date,
                                                                        DateB2:MyDateString,
                                                                        DateB3:Mydate3,
                                                                        TimeB1:formatAMPM(),
                                                                        TimeB2:'Time',
                                                                        TranSts:'Success',
                                                                        RzPayId:req.body.Rp_pym_id,
                                                                    }
                                                                },(err,result7)=>{
                                                                    if(err){
                                                                        console.log(err)
                                                                    }else{
                                                                        
                                                                        RTRnwl.updateOne({RtTranId:req.body.Rt_tran_id},{
                                                                            $set:{
                                                                                DateB1:date,
                                                                                DateB2:MyDateString,
                                                                                DateB3:Mydate3,
                                                                                TimeB:formatAMPM(),
                                                                                RzPayId:req.body.Rp_pym_id,
                                                                                RnwlSts:'Success'
                                                                            }
                                                                        },(err,result8)=>{
                                                                            if(err){
                                                                                console.log(err)
                                                                            }else{
                                                                                // RfCdStsUsg

                                                                                RfRtCd.deleteMany({RfRtCd:result21[0].RtUnm},(err,result25)=>{
                                                                                    if(err){
                                                                                        console.log(err)
                                                                                    }else{
                                                                                        console.log(result25)
                                                                                        console.log("Renewal Success")
                                                                                        res.json('Renewal Success')
                                                                                    }
                                                                                })
                                                                                // console.log(result7)
                                                                              
                                                                            }
                                                                        })
                                                                      
                                                                    }
                                                                })
                                                               
                                                            }else{
                                                                res.json('Error or Already Activated')
                                                            }
                                                        }
                                                    })
                                                  
            
                        }
            
                    })  

                }else{
                    console.log('Not found')
                }
            }
        })
               
                                                                                              
    }else{
        console.log('Failure')
        res.json('Failure')
    }
})


RoutesReg.route('/TransFail').post((req,res)=>{
    var MyDate = new Date();
    const date = MyDate.getDate()+ '/'+(MyDate.getMonth()+1)+'/'+MyDate.getFullYear()
    const MyDateString = MyDate.getFullYear() + ('0' + (MyDate.getMonth()+1)).slice(-2)  +('0' + MyDate.getDate()).slice(-2);     
    const Mydate3 = new Date();         // ISO date 1
    const Dates = new Date()
    function formatAMPM() {
        var hours = MyDate.getHours();
        var minutes = MyDate.getMinutes();
        // var seconds = MyDate2.getSeconds();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        // console.log(minutes)
        // seconds = seconds < 10 ? '0'+seconds : seconds; 
        // var strTime = hours + ':' + minutes +  ':' + seconds + ' ' + ampm;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
        }
    console.log(req.body)
    const obj20 = {
        RtId:req.body.RtId,
        RtTranId:req.body.RtTranId,
        RtRpPymId:'Fail',
        RtRpOrdId:req.body.RtRpOrdId,
        RtPlnNm:req.body.RtPlnNm,
        RpErrCd:req.body.RpErrCd,
        RpErrDis:req.body.RpErrDis,
        RtTranDate:Dates

    }

    transaction.updateOne({TranId:req.body.RtTranId},{
        $set:{
            DateB1:date,
            DateB2:MyDateString,
            DateB3:Mydate3,
            TimeB1:formatAMPM(),
            TimeB2:'Time',
            TranSts:'Failed'
           
        }
    },(err,result7)=>{
        if(err){
            console.log(err)
        }else{
            const TransactionFail = FailTrans(obj20)
            TransactionFail.save()
            .then(response=>{
                console.log(response)
                res.json('Saved in TransFail DB')
            })
            .catch(err=>{
                console.log(err)
            })
          
            
        }
    })
   
  
  
    
})

RoutesReg.route('/RtRenewalSts').post((req,res)=>{
    RTregFull.find({RtId:req.body.Rt_id},(err,result23)=>{
        if(err){
            console.log(err)
        }else{
            if(result23.length > 0){
                console.log(result23[0].RtRnwSt)
                if(result23[0].RtRnwSt === 'Renewed'){
                    RTRnwl.find({RtId:req.body.Rt_id, RnwlSts:'Success'},(err,result23)=>{
                    if(err){
                        console.log(err)
                    }else{
                        if(result23.length > 0){
                            res.json(result23[0])
                            console.log(result23[0])

                                }

                            }
                    
                    })

                }
            }

        }

    })
})

RoutesReg.route('/RtTransGet').post((req,res)=>{
    transaction.find({RtId:req.body.RtId},(err,result24)=>{
        if(err){
            console.log(err)
        }else{
            if(result24.length > 0){
                res.json(result24)
                console.log(result24)
                // res.json('TrnNotFound')
            
            }else{
                res.json('TrnNotFound')
                console.log('Trn Not Found')
            }

        }

    })
})


// RoutesReg.route('/getfetchformTwo2').post((req,res)=>{
//     console.log(req.body)                             // here component info is called by id 
    
//     var instance = new Razorpay({
//         key_id: 'rzp_test_e2S1oPV2nG4FbW',
//         key_secret: 'NPb4FYnkRWEofFR192zLZow0',
//       });
//     instance.orders.create({
//         amount: 50000,
//         currency: "INR",
//         receipt: "receipt#1",
//         notes: {
//           key1: "value3",
//           key2: "value2"
//         }
//       },(err,result)=>{
//           console.log(result)
//           res.json(result)
//       })

// })





// RoutesReg.route('/UpdateIniReq').post((req,res)=>{
//     RtInireq.findOneAndUpdate({RtId:req.body.RtId},{
//         $set:{
//             RtSts:'ReqRegtrd',
//         }
// },(err,result5)=>{
//     if(err){
//         console.log(err)
//     }else{
//         // console.log('updated success')
//         res.json('UpdateSuccess')
//     }
// }) 
// })


// RoutesReg.route('/AcntStatus').post((req,res)=>{
//     console.log(req.body)

//     var MyDateA = new Date();
//     // const date = MyDate.getDate()+ '/'+(MyDate.getMonth()+1)+'/'+MyDate.getFullYear()
//     const MyDateStringA = MyDateA.getFullYear() + ('0' + (MyDateA.getMonth()+1)).slice(-2)  +('0' + MyDateA.getDate()).slice(-2); 
//     // const MyDateStringA = 20220405
    
//     RTregFull.find({RtId:req.body.RtId},(err,result8)=>{
//         if(err){
//             console.log(err)
//         }else{
//             if(result8.length > 0){
//                 if(result8[0].RtExpDt2 >= MyDateStringA){
//                         if(result8[0].RtAcnSt === 'Actv'){
//                             console.log('Account sts 1')
//                             const obj1 = {
//                                     RtId:result8[0].RtId,
//                                     RtShNm:result8[0].RtShNm,
//                                     RtShBrcNm:result8[0].RtShBrcNm,
//                                     RtUnm:result8[0].RtUnm,
//                                     RtUsrNm:result8[0].RtUsrNm,
//                                     RtUsrTy:result8[0].RtUsrTy,
//                                     RtUsrImg:result8[0].RtUsrImg,

//                                     RtUsrGnd:result8[0].RtUsrGnd,
//                                     RtUsrYob1:result8[0].RtUsrYob1,
//                                     RtUsrYob2:result8[0].RtUsrYob2,
//                                     RtUsrIdImg:result8[0].RtUsrIdImg,
//                                     RtShIdImg:result8[0].RtShIdImg,
//                                     RtLgImg1:result8[0].RtLgImg1,
//                                     RtLgImg2:result8[0].RtLgImg2,
//                                     RtSlOrg:result8[0].RtSlOrg,

//                                     RtStrOpLvTy:result8[0].RtStrOpLvTy,
//                                     RtStrOpLvSt:result8[0].RtStrOpLvSt,
//                                     RtStrOpD:result8[0].RtStrOpD,
//                                     RtStrOpN1:result8[0].RtStrOpN1,
//                                     RtStrOpN2:result8[0].RtStrOpN2,
//                                     RtStrOpN3:result8[0].RtStrOpN3,
//                                     RtLcnTy:result8[0].RtLcnTy,
//                                     RtStrSpl:result8[0].RtStrSpl,

//                                     RtMlId:result8[0].RtMlId,                                
//                                     RtPhn:result8[0].RtPhn,
//                                     RtCsMlId:result8[0].RtCsMlId,
//                                     RtCsPhn:result8[0].RtCsPhn,
//                                     RtTy1:result8[0].RtTy1,
//                                     RtBrNm:result8[0].RtBrNm,
//                                     RtTy2:result8[0].RtTy2,
//                                     RtMnLm:result8[0].RtMnLm,
//                                     RtSbLm:result8[0].RtSbLm,

//                                     RtStrDt1:result8[0].RtStrDt1,
//                                     RtStrDt2:result8[0].RtStrDt2,
//                                     RtStrDt3:result8[0].RtStrDt3,
//                                     RtExpDt1:result8[0].RtExpDt1,
//                                     RtExpDt2:result8[0].RtExpDt2,
//                                     RtExpDt3:result8[0].RtExpDt3,
//                                     RtPlnTy:result8[0].RtPlnTy,
//                                     RtPlnNm:result8[0].RtPlnNm,
//                                     RtPlnDys:result8[0].RtPlnDys,
//                                     RtPlnAmt:result8[0].RtPlnAmt,
//                                     RtAcnSt:result8[0].RtAcnSt,
//                                     RtLcnNo:result8[0].RtLcnNo,
//                                     RtShImg:result8[0].RtShImg,

//                                     RtShCo:result8[0].RtShCo,
//                                     RtShCoCd:result8[0].RtShCoCd,
//                                     RtShCoLn:result8[0].RtShCoLn,
//                                     RtPdAmt:result8[0].RtPdAmt,
//                                     RtPdAmtDt:result8[0].RtPdAmtDt,
//                                     RtPdAmtTm:result8[0].RtPdAmtTm,
//                                     RtRnwSt:result8[0].RtRnwSt,
//                                     RtAdr1:result8[0].RtAdr1,
//                                     RtAdr2:result8[0].RtAdr2,
//                                     RtAdr3:result8[0].RtAdr3,
//                                     RtAdr4:result8[0].RtAdr4,
//                                     RtAdr5:result8[0].RtAdr5,
//                                     RtAdr6:result8[0].RtAdr6,
//                                     RtAdr7:result8[0].RtAdr7,

//                                     RtPin:result8[0].RtPin,
//                                     RtSt:result8[0].RtSt,
//                                     RtLdMk:result8[0].RtLdMk,
//                                     RtRefTy:result8[0].RtRefTy,
//                                     RtRefCd:result8[0].RtRefCd,
//                                     RtRefCdUsg:result8[0].RtRefCdUsg,
//                                     RtRegTy:result8[0].RtRegTy,
//                                     RtRegDt1:result8[0].RtRegDt1,
//                                     RtRegDt2:result8[0].RtRegDt2,
//                                     RtSlId:result8[0].RtSlId,

//                             }
//                             console.log('Send data1')
//                             res.json(obj1)
//                         }else{
                           
//                             console.log(result8)
//                             res.json('Not Active')
//                         }

//                 }else if(result8[0].RtExpDt2 < MyDateStringA){
//                     if(result8[0].RtAcnSt === 'Actv'){
//                         if(result8[0].RtRnwSt === 'Renewed'){
//                             console.log('Account sts 2')
//                             RTRnwl.find({RtId:req.body.RtId},(err,result12)=>{
//                                 if(err){
//                                     console.log(err)
//                                 }else{
//                                     if(result12.length > 0){
//                                         const num1 = result12[0].RtDys;
//                                         var MyDate = new Date();
//                                         const date = MyDate.getDate()+ '/'+(MyDate.getMonth()+1)+'/'+MyDate.getFullYear()
//                                         const MyDateString = MyDate.getFullYear() + ('0' + (MyDate.getMonth()+1)).slice(-2)  +('0' + MyDate.getDate()).slice(-2);     
//                                         const Mydate3 = new Date();

//                                         MyDate.setDate(MyDate.getDate() + (num1-1));              
//                                         const date2 = MyDate.getDate()+ '/'+(MyDate.getMonth()+1)+'/'+MyDate.getFullYear()
//                                         const MyDateStringTwo = MyDate.getFullYear() + ('0' + (MyDate.getMonth()+1)).slice(-2)  +('0' + MyDate.getDate()).slice(-2);
                                
//                                         const Mydate4 = new Date();         // ISO date 2
//                                         Mydate4.setDate(Mydate4.getDate()+(num1-1)) 
//                                         Mydate4.setHours(0,0,0,0)
//                                         RTregFull.updateOne({RtId:req.body.RtId},{
//                                             $set:{
//                                                     RtMnLm:result12[0].RtMLlmt,
//                                                     RtSbLm:result12[0].RtSLmt,
//                                                     RtStrDt1:date,
//                                                     RtStrDt2:MyDateString,
//                                                     RtStrDt3:Mydate3,
//                                                     RtExpDt1:date2,
//                                                     RtExpDt2:MyDateStringTwo,
//                                                     RtExpDt3:Mydate4,
//                                                     RtPlnTy:result12[0].RtPlnTy,
//                                                     RtPlnNm:result12[0].RtPlNm,
//                                                     RtPlnDys:result12[0].RtDys,
//                                                     RtPlnAmt:result12[0].RtAmt1,
//                                                     RtAcnSt:'Actv',
//                                                     RtRnwSt:'NtRenewed'
//                                             }
//                                         },(err,result11)=>{
//                                             if(err){
//                                                 console.log(err)
//                                             }else{
//                                                 RTregFull.find({RtId:req.body.RtId},(err,result14)=>{
//                                                     if(err){
//                                                         console.log(err)
//                                                     }else{
//                                                         if(result14.length > 0){
//                                                             const obj1 = {
//                                                                 RtId:result14[0].RtId,
//                                                                 RtShNm:result14[0].RtShNm,
//                                                                 RtShBrcNm:result14[0].RtShBrcNm,
//                                                                 RtUnm:result14[0].RtUnm,
//                                                                 RtUsrNm:result14[0].RtUsrNm,
//                                                                 RtUsrTy:result14[0].RtUsrTy,
//                                                                 RtUsrImg:result14[0].RtUsrImg,
                            
//                                                                 RtUsrGnd:result14[0].RtUsrGnd,
//                                                                 RtUsrYob1:result14[0].RtUsrYob1,
//                                                                 RtUsrYob2:result14[0].RtUsrYob2,
//                                                                 RtUsrIdImg:result14[0].RtUsrIdImg,
//                                                                 RtShIdImg:result14[0].RtShIdImg,
//                                                                 RtLgImg1:result14[0].RtLgImg1,
//                                                                 RtLgImg2:result14[0].RtLgImg2,
//                                                                 RtSlOrg:result14[0].RtSlOrg,
                            
//                                                                 RtStrOpLvTy:result14[0].RtStrOpLvTy,
//                                                                 RtStrOpLvSt:result14[0].RtStrOpLvSt,
//                                                                 RtStrOpD:result14[0].RtStrOpD,
//                                                                 RtStrOpN1:result14[0].RtStrOpN1,
//                                                                 RtStrOpN2:result14[0].RtStrOpN2,
//                                                                 RtStrOpN3:result14[0].RtStrOpN3,
//                                                                 RtLcnTy:result14[0].RtLcnTy,
//                                                                 RtStrSpl:result14[0].RtStrSpl,
                            
//                                                                 RtMlId:result14[0].RtMlId,                                
//                                                                 RtPhn:result14[0].RtPhn,
//                                                                 RtCsMlId:result14[0].RtCsMlId,
//                                                                 RtCsPhn:result14[0].RtCsPhn,
//                                                                 RtTy1:result14[0].RtTy1,
//                                                                 RtBrNm:result14[0].RtBrNm,
//                                                                 RtTy2:result14[0].RtTy2,
//                                                                 RtMnLm:result14[0].RtMnLm,
//                                                                 RtSbLm:result14[0].RtSbLm,
                            
//                                                                 RtStrDt1:result14[0].RtStrDt1,
//                                                                 RtStrDt2:result14[0].RtStrDt2,
//                                                                 RtStrDt3:result14[0].RtStrDt3,
//                                                                 RtExpDt1:result14[0].RtExpDt1,
//                                                                 RtExpDt2:result14[0].RtExpDt2,
//                                                                 RtExpDt3:result14[0].RtExpDt3,
//                                                                 RtPlnTy:result14[0].RtPlnTy,
//                                                                 RtPlnNm:result14[0].RtPlnNm,
//                                                                 RtPlnDys:result14[0].RtPlnDys,
//                                                                 RtPlnAmt:result14[0].RtPlnAmt,
//                                                                 RtAcnSt:result14[0].RtAcnSt,
//                                                                 RtLcnNo:result14[0].RtLcnNo,
//                                                                 RtShImg:result14[0].RtShImg,
                            
//                                                                 RtShCo:result14[0].RtShCo,
//                                                                 RtShCoCd:result14[0].RtShCoCd,
//                                                                 RtShCoLn:result14[0].RtShCoLn,
//                                                                 RtPdAmt:result14[0].RtPdAmt,
//                                                                 RtPdAmtDt:result14[0].RtPdAmtDt,
//                                                                 RtPdAmtTm:result14[0].RtPdAmtTm,
//                                                                 RtRnwSt:result14[0].RtRnwSt,
//                                                                 RtAdr1:result14[0].RtAdr1,
//                                                                 RtAdr2:result14[0].RtAdr2,
//                                                                 RtAdr3:result14[0].RtAdr3,
//                                                                 RtAdr4:result14[0].RtAdr4,
//                                                                 RtAdr5:result14[0].RtAdr5,
//                                                                 RtAdr6:result14[0].RtAdr6,
//                                                                 RtAdr7:result14[0].RtAdr7,
                            
//                                                                 RtPin:result14[0].RtPin,
//                                                                 RtSt:result14[0].RtSt,
//                                                                 RtLdMk:result14[0].RtLdMk,
//                                                                 RtRefTy:result14[0].RtRefTy,
//                                                                 RtRefCd:result14[0].RtRefCd,
//                                                                 RtRefCdUsg:result14[0].RtRefCdUsg,
//                                                                 RtRegTy:result14[0].RtRegTy,
//                                                                 RtRegDt1:result14[0].RtRegDt1,
//                                                                 RtRegDt2:result14[0].RtRegDt2,
//                                                                 RtSlId:result14[0].RtSlId,
                            
//                                                         }
//                                                         console.log('Send data2')
//                                                         // console.log(obj1)
//                                                         res.json(obj1)
//                                                         }
//                                                     }
//                                                 })
//                                                 console.log(result11)
//                                             }
//                                         })
//                                     }
//                                 }
//                             })
                            
//                             console.log('update')
//                         }else{
//                             console.log('Account sts 3')
//                             RTregFull.updateOne({RtId:req.body.RtId},{
//                                 $set:{
//                                     RtAcnSt:"Expr"
//                                 }
//                             },(err,result10)=>{
//                                 if(err){
//                                     console.log(err)
//                                 }else{
//                                     RTregFull.find({RtId:req.body.RtId},(err,result14)=>{
//                                         if(err){
//                                             console.log(err)
//                                         }else{
//                                             if(result14.length > 0){
//                                                 const obj1 = {
//                                                     RtId:result14[0].RtId,
//                                                     RtShNm:result14[0].RtShNm,
//                                                     RtShBrcNm:result14[0].RtShBrcNm,
//                                                     RtUnm:result14[0].RtUnm,
//                                                     RtUsrNm:result14[0].RtUsrNm,
//                                                     RtUsrTy:result14[0].RtUsrTy,
//                                                     RtUsrImg:result14[0].RtUsrImg,
                
//                                                     RtUsrGnd:result14[0].RtUsrGnd,
//                                                     RtUsrYob1:result14[0].RtUsrYob1,
//                                                     RtUsrYob2:result14[0].RtUsrYob2,
//                                                     RtUsrIdImg:result14[0].RtUsrIdImg,
//                                                     RtShIdImg:result14[0].RtShIdImg,
//                                                     RtLgImg1:result14[0].RtLgImg1,
//                                                     RtLgImg2:result14[0].RtLgImg2,
//                                                     RtSlOrg:result14[0].RtSlOrg,
                
//                                                     RtStrOpLvTy:result14[0].RtStrOpLvTy,
//                                                     RtStrOpLvSt:result14[0].RtStrOpLvSt,
//                                                     RtStrOpD:result14[0].RtStrOpD,
//                                                     RtStrOpN1:result14[0].RtStrOpN1,
//                                                     RtStrOpN2:result14[0].RtStrOpN2,
//                                                     RtStrOpN3:result14[0].RtStrOpN3,
//                                                     RtLcnTy:result14[0].RtLcnTy,
//                                                     RtStrSpl:result14[0].RtStrSpl,
                
//                                                     RtMlId:result14[0].RtMlId,                                
//                                                     RtPhn:result14[0].RtPhn,
//                                                     RtCsMlId:result14[0].RtCsMlId,
//                                                     RtCsPhn:result14[0].RtCsPhn,
//                                                     RtTy1:result14[0].RtTy1,
//                                                     RtBrNm:result14[0].RtBrNm,
//                                                     RtTy2:result14[0].RtTy2,
//                                                     RtMnLm:result14[0].RtMnLm,
//                                                     RtSbLm:result14[0].RtSbLm,
                
//                                                     RtStrDt1:result14[0].RtStrDt1,
//                                                     RtStrDt2:result14[0].RtStrDt2,
//                                                     RtStrDt3:result14[0].RtStrDt3,
//                                                     RtExpDt1:result14[0].RtExpDt1,
//                                                     RtExpDt2:result14[0].RtExpDt2,
//                                                     RtExpDt3:result14[0].RtExpDt3,
//                                                     RtPlnTy:result14[0].RtPlnTy,
//                                                     RtPlnNm:result14[0].RtPlnNm,
//                                                     RtPlnDys:result14[0].RtPlnDys,
//                                                     RtPlnAmt:result14[0].RtPlnAmt,
//                                                     RtAcnSt:result14[0].RtAcnSt,
//                                                     RtLcnNo:result14[0].RtLcnNo,
//                                                     RtShImg:result14[0].RtShImg,
                
//                                                     RtShCo:result14[0].RtShCo,
//                                                     RtShCoCd:result14[0].RtShCoCd,
//                                                     RtShCoLn:result14[0].RtShCoLn,
//                                                     RtPdAmt:result14[0].RtPdAmt,
//                                                     RtPdAmtDt:result14[0].RtPdAmtDt,
//                                                     RtPdAmtTm:result14[0].RtPdAmtTm,
//                                                     RtRnwSt:result14[0].RtRnwSt,
//                                                     RtAdr1:result14[0].RtAdr1,
//                                                     RtAdr2:result14[0].RtAdr2,
//                                                     RtAdr3:result14[0].RtAdr3,
//                                                     RtAdr4:result14[0].RtAdr4,
//                                                     RtAdr5:result14[0].RtAdr5,
//                                                     RtAdr6:result14[0].RtAdr6,
//                                                     RtAdr7:result14[0].RtAdr7,
                
//                                                     RtPin:result14[0].RtPin,
//                                                     RtSt:result14[0].RtSt,
//                                                     RtLdMk:result14[0].RtLdMk,
//                                                     RtRefTy:result14[0].RtRefTy,
//                                                     RtRefCd:result14[0].RtRefCd,
//                                                     RtRefCdUsg:result14[0].RtRefCdUsg,
//                                                     RtRegTy:result14[0].RtRegTy,
//                                                     RtRegDt1:result14[0].RtRegDt1,
//                                                     RtRegDt2:result14[0].RtRegDt2,
//                                                     RtSlId:result14[0].RtSlId,
                
//                                             }
//                                             console.log('Send data3')
//                                             // console.log(obj1)
//                                            console.log('Expired')
//                                             res.json(obj1)
//                                             }
//                                         }
//                                     })
//                                     // console.log(result11)
//                                     // res.json('Expired')
//                                     // console.log(result10)
//                                 }
//                             })
//                         }

//                     }else if(result8[0].RtAcnSt === 'Expr'){
//                         console.log('expired')
//                         res.json('Expired')
//                     }else{
//                         console.log('Nothing 2')
//                     }                   
//                 }else{
//                     console.log('Nothing')
//                 }
                
//             }
//         }
//     })
// })

// RoutesReg.route('/addTwo').post((req,res)=>{
//     const nan2 = customAlphabet('0123456789ABDEFGHJKMNPQRTYabdefghjkmnpqrty',6)
//     const Pw = nan2()

//     console.log(req.body)
// var transport = nodemailer.createTransport({
//     host:'smtp.gmail.com',
//     port:587,
//     secure:false,
//     auth: {
//         user:"ank66145@gmail.com",
//         pass:"nv123456abc#"
//     }

// })
// var mailoption= {
//     from:"ank66145@gmail.com",
//     to:req.body.email,
//     subject:"Registered successfully,Password for Mobile Application",
//     text:`Registered successfully and your password is ${Pw}.`
// }

// transport.sendMail(mailoption,function(error,info){
//     if(error){
        
//         console.log(error);
//     }else{
//         console.log("success"+info.response);
//     }
// })
// })

// RoutesReg.route('/dummy').post((req,res)=>{
//     RfRtCd.aggregate([{$match:{RfRtCd:"bottleneck"}},{$sort:{_id:-1}},{
          
//         $group:{
//             _id:{RfRtCd:'$RfRtCd'},
//             RfCdsum:{$sum:'$RfPlCd'}
//         }
//     } 
// ]).exec(function(err,result){
//     if(err){
//         console.log(err)
//     }else{
//         console.log(result)
//         console.log(result[0].RfCdsum)
//         res.json(result)
//         if(result.length >0){
//             if(result[0].RfCdsum === 0){
//                 var nm = 'abc1'

//             }else if(result[0].RfCdsum > 0 && result[0].RfCdsum < 6){
//                 nm = 'abc2'
//             }
//             else if(result[0].RfCdsum >= 6){
//                 nm = 'abc3'
//             }else{
//                 console.log('nothing')
//             }
//             console.log('nothing 2')
//             console.log(nm)
//         }else{
//             nm = 'abc4'
//             console.log('nothing 3')
//             console.log(nm)
//         }
//         console.log('nothing 4')
//         console.log(nm)
//     }
// })
// })

// RoutesReg.route('/AcntStatus2').post((req,res)=>{
//     RTregFull.find({RtId:req.body.RtId},(err,result15)=>{
//         if(err){
//             console.log(err)
//         }else{
//             const obj1 = {
//                 RtId:result15[0].RtId,
//                 RtShNm:result15[0].RtShNm,
//                 RtShBrcNm:result15[0].RtShBrcNm,
//                 RtUnm:result15[0].RtUnm,
//                 RtUsrNm:result15[0].RtUsrNm,
//                 RtUsrTy:result15[0].RtUsrTy,
//                 RtUsrImg:result15[0].RtUsrImg,

//                 RtUsrGnd:result15[0].RtUsrGnd,
//                 RtUsrYob1:result15[0].RtUsrYob1,
//                 RtUsrYob2:result15[0].RtUsrYob2,
//                 RtUsrIdImg:result15[0].RtUsrIdImg,
//                 RtShIdImg:result15[0].RtShIdImg,
//                 RtLgImg1:result15[0].RtLgImg1,
//                 RtLgImg2:result15[0].RtLgImg2,
//                 RtSlOrg:result15[0].RtSlOrg,

//                 RtStrOpLvTy:result15[0].RtStrOpLvTy,
//                 RtStrOpLvSt:result15[0].RtStrOpLvSt,
//                 RtStrOpD:result15[0].RtStrOpD,
//                 RtStrOpN1:result15[0].RtStrOpN1,
//                 RtStrOpN2:result15[0].RtStrOpN2,
//                 RtStrOpN3:result15[0].RtStrOpN3,
//                 RtLcnTy:result15[0].RtLcnTy,
//                 RtStrSpl:result15[0].RtStrSpl,

//                 RtMlId:result15[0].RtMlId,                                
//                 RtPhn:result15[0].RtPhn,
//                 RtCsMlId:result15[0].RtCsMlId,
//                 RtCsPhn:result15[0].RtCsPhn,
//                 RtTy1:result15[0].RtTy1,
//                 RtBrNm:result15[0].RtBrNm,
//                 RtTy2:result15[0].RtTy2,
//                 RtMnLm:result15[0].RtMnLm,
//                 RtSbLm:result15[0].RtSbLm,

//                 RtStrDt1:result15[0].RtStrDt1,
//                 RtStrDt2:result15[0].RtStrDt2,
//                 RtStrDt3:result15[0].RtStrDt3,
//                 RtExpDt1:result15[0].RtExpDt1,
//                 RtExpDt2:result15[0].RtExpDt2,
//                 RtExpDt3:result15[0].RtExpDt3,
//                 RtPlnTy:result15[0].RtPlnTy,
//                 RtPlnNm:result15[0].RtPlnNm,
//                 RtPlnDys:result15[0].RtPlnDys,
//                 RtPlnAmt:result15[0].RtPlnAmt,
//                 RtAcnSt:result15[0].RtAcnSt,
//                 RtLcnNo:result15[0].RtLcnNo,
//                 RtShImg:result15[0].RtShImg,

//                 RtShCo:result15[0].RtShCo,
//                 RtShCoCd:result15[0].RtShCoCd,
//                 RtShCoLn:result15[0].RtShCoLn,
//                 RtPdAmt:result15[0].RtPdAmt,
//                 RtPdAmtDt:result15[0].RtPdAmtDt,
//                 RtPdAmtTm:result15[0].RtPdAmtTm,
//                 RtRnwSt:result15[0].RtRnwSt,
//                 RtAdr1:result15[0].RtAdr1,
//                 RtAdr2:result15[0].RtAdr2,
//                 RtAdr3:result15[0].RtAdr3,
//                 RtAdr4:result15[0].RtAdr4,
//                 RtAdr5:result15[0].RtAdr5,
//                 RtAdr6:result15[0].RtAdr6,
//                 RtAdr7:result15[0].RtAdr7,

//                 RtPin:result15[0].RtPin,
//                 RtSt:result15[0].RtSt,
//                 RtLdMk:result15[0].RtLdMk,
//                 RtRefTy:result15[0].RtRefTy,
//                 RtRefCd:result15[0].RtRefCd,
//                 RtRegTy:result15[0].RtRegTy,
//                 RtRegDt1:result15[0].RtRegDt1,
//                 RtRegDt2:result15[0].RtRegDt2,
//                 RtSlId:result15[0].RtSlId,

//         }           
//             res.json(obj1)
//         }
//     })


// })


// RoutesReg.route('/GetDistanceTwo').post((req,res)=>{
//     console.log(req.body)
//     distance.find({fieldOne:"XYZ"},(err,result)=>{
//         if(err){
//             console.log(err)
//         }else{
//             // res.json(result)
//             // console.log(result)

//             const DATAARR = result[0].fieldTwo
//             const arr = []
//             // console.log(DATAARR.length)
        
//             for(let i=0;i<DATAARR.length; i++){
//                 const distance2 = getDistance(
//                     { latitude:req.body.latitude, longitude: req.body.longitude },
//                     { latitude: DATAARR[i].latitude, longitude: DATAARR[i].longitude }
//                 );
//                 arr.push([distance2, DATAARR[i].C])
//                 console.log('Distance')
//                 console.log(distance2)
//             }
        
//             // console.log(arr)
//             // console.log(arr[1])
        
//             arr.sort((a,b)=>b[0]-a[0])
//             // console.log(arr[1][1])
        
//             //After sorting array of column value is displaying with array format
//             // const xarray = [];
//            const  xarray = arr.map(function(item){
//                 return item[1]
//             })
//             res.json(xarray)
//             console.log(xarray)
//             console.log(xarray[0])
//         }
//     })



// RoutesReg.route('/RtsearchOne').post((req,res)=>{
//     console.log(req.body)
//     Rupload.find({$text:{$search:req.body.searchip}},{score:{$meta:"textScore"}},(err,result)=>{
//         if(err){
//             console.log(err)
//         }else{
//             if(result.length > 0){
//                 res.json(result)
//                 console.log(result)
//             }else{
//                 res.json('no data found')
//             }
           
//         }
//     }).sort({score:{$meta:"textScore"}})
//     // .skip(req.body.sk*5).limit(5)
// })


module.exports = RoutesReg;



// RoutesReg.route('/Rzrpay').post((req,res)=>{
//     const nan2 = customAlphabet('0123456789',4)
//     var MyDate = new Date();
//     const MyDateString = (MyDate.getFullYear()-2000) + ('0' + (MyDate.getMonth()+1)).slice(-2)  +('0' + MyDate.getDate()).slice(-2)+('0'+MyDate.getHours()).slice(-2)+('0'+MyDate.getMinutes()).slice(-2)+('0'+MyDate.getSeconds()).slice(-2)+nan2();
   
    
//     const id2 = nanoid()
//     var instance = new Razorpay({
//         key_id : 'rzp_test_e2S1oPV2nG4FbW',
//         key_secret : 'NPb4FYnkRWEofFR192zLZow0',
//     });
//     instance.orders.create({
//         amount: 50000,
//         currency: 'INR',
//         receipt:MyDateString,
//         notes:{
//             key1:"value2",
//             key2:"value4"
//         }
//     },(err,result)=>{
//         if(err){
//             console.log(err)
//         }else{
           
//             var PayData = {
//                 id: result.id,
//                 entity: result.entity,
//                 amount: result.amount,
//                 amount_paid: result.amount_paid,
//                 amount_due: result.amount_due,
//                 currency: result.currency,
//                 receipt: result.receipt,
//                 offer_id: result.offer_id,
//                 status: result.status,
//                 attempts: result.attempts,
//                 notes: result.notes,
//                 created_at: result.created_at,
//                 key_id:instance.key_id,
//                 Rt_tran_id:id2,
//                 Rt_id:req.body.Rt_id,
//                 RtPlnTy:req.body.RtPlnTy
//             }
//             console.log(PayData)
//             res.json(PayData)

//         }
//     })

// })
