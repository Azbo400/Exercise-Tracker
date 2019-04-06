const mongoose = require('mongoose');
const UserExercise = mongoose.model('UserExercise');
const shortid = require('shortid');

module.exports = app => {
  app.post('/api/newuser', (req, res) => {
    console.log(req.body);
    // check if the user already exists
    UserExercise.findOne({ username: req.body.username }, async (err, user) => {
      if (user) {
        res.status(401).json('User already exists');
      } else {
        const item = new UserExercise({
          _id: shortid.generate(), 
          username: req.body.username
        });
        await item.save(); 
        res.status(200).json(item); 
      }
    })
  });
  
  app.post('/api/add', (req, res) => {
    var obj = {
      description: req.body.description, 
      duration: req.body.duration,
      date: req.body.date
    }

    UserExercise.findOneAndUpdate({ _id: req.body._id }, {$set: obj}, {new: true}, (err, doc) => {
      if (err) {
        res.status(401).json('Could not update user')
      } else {
        res.status(200).json(doc);
      }
    });
    console.log(req.body);
  });

  app.get('/api/log/:userid', (req, res) => {
    UserExercise.findOne({ _id: req.params.userid }, (err, user) => {
      if (user) {
        // we need to filter more to allow for query strings
        if (req.query.from && req.query.to) {
          var start = new Date(req.query.from);
          var end = new Date(req.query.to);
        
          var currentdate = new Date(user.date);
          var exercises = [];

          if(currentdate <= end && currentdate >= start) {
            if (req.query.limit) {
              if (req.query.limit >= 1) {
                while(exercises.length < req.query.limit) {
                  exercises.push(user);
                }
                res.status(200).json(exercises)
              } else {
                res.status(200).json("No exercises to display with current limit")
              }
            } else {
              exercises.push(user);
              res.status(200).json(exercises)
            }
          } else {
            res.status(200).json("Dates do not match any exercises");
          }
        } else {
          // get users
          res.status(200).json(user);
        }
      } else {
        res.status(401).json('User does not exist');
      }
    });

  });
}