const express=require('express')
const router=express.Router()
const SliderController=require('../../controller/Slider/SliderController') 
const auth=require('../../middleware/auth')


router.get('/all',SliderController.AllSlider)
router.post('/new',SliderController.NewSlider)
router.post('/update',SliderController.UpdateSlider)
router.get('/delete',SliderController.DeleteSlider)

module.exports=router