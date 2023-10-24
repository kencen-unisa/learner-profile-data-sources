var express = require('express');
var router = express.Router();
const Learner = require('../../models/learner')

/* GET home page. */
router.get('/', async function(req, res, next) {
  let all = await Learner.getAll()
  let learners = all.map(x=>{
    return {
      uuid: x.uuid,
      name: `${x.preferred_first_name} ${x.preferred_last_name}`
    }
  })
  let selected_learner = req.query.uuid ? all.find(x=>x.uuid===req.query.uuid) : null

  res.render('index', {
    title: "Learner Profile",
    all_learners: learners,
    selected_learner: selected_learner
  })

  // let learner = null
  // if(req.query.uuid){
  //   learner = await Learner.findByUuid(req.query.uuid)
  // }
  // res.render('index', { 
  //   title: 'Learner Profile',
  //   learner: learner
  // });
});

module.exports = router;
