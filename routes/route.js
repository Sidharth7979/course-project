const express = require('express');
const session = require('express-session');
const router = express.Router();


router.get('/', (req, res) => {
    
    res.render('add_user', {title:"add_user" }); 
});

router.post ('/add',async(req,res)=>{})



    



    module.exports = router;

  

 











