const express=require('express')
const router=express.Router()
const NewsController=require('../../controller/News/NewsController') 
const auth=require('../../middleware/auth')


router.get('/all',NewsController.AllNews)
router.post('/new',NewsController.NewNews)
router.post('/update',NewsController.UpdateNews)
router.get('/delete',NewsController.DeleteNews)

module.exports=router