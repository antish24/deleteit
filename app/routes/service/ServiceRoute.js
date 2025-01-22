const express=require('express')
const router=express.Router()
const ServiceController=require('../../controller/Service/ServiceController') 
const auth=require('../../middleware/auth')


router.get('/all',ServiceController.AllService)
router.post('/new',ServiceController.NewService)
router.post('/update',ServiceController.UpdateService)
router.get('/delete',ServiceController.DeleteService)

module.exports=router