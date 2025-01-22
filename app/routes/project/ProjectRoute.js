const express=require('express')
const router=express.Router()
const ProjectController=require('../../controller/Project/ProjectController') 
const auth=require('../../middleware/auth')


router.get('/all',ProjectController.AllProject)
router.post('/new',ProjectController.NewProject)
router.post('/update',ProjectController.UpdateProject)
router.get('/delete',ProjectController.DeleteProject)

module.exports=router