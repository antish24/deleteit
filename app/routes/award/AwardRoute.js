const express=require('express')
const router=express.Router()
const AwardController=require('../../controller/Award/AwardController') 
const auth=require('../../middleware/auth')


router.get('/all',AwardController.AllAward)
router.post('/new',AwardController.NewAward)
router.post('/update',AwardController.UpdateAward)
router.get('/delete',AwardController.DeleteAward)

module.exports=router