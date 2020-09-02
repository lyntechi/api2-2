const express = require("express");

const router = express.Router();

const Posts = require("./postModel");

router.use(express.json());

//GET post request returns all posts
router.get(`/`, (req, res) => {
  Posts.find(req.query)
  .then(posts => {
      res.status(200).json(posts);
  })
  .catch(error => {
      console.log(error);
      res.status(500).json({message: "Error retrieveing posts"})
  })
})

router.get(`/:id`, (req, res) => {
  const id = req.params.id
  Posts.findById(id)
  .then(post => {
    {post 
      ? res.status(200).json(post) 
      : res.status(404).json({error: "The posts information could not be retrieved."}) 
    }
  })
})

router.get(`/:id/comments`, (req, res) => {
  const id = req.params.id
  Posts.findById(id)
  .then(post => {
    if(post.length === 0){
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    } else {
      Posts.findPostComments(id)
      .then(comments =>{
        if(comments) {
          res.status(200).json(comments)
        }else {
          res.status(404).json({error: "no comments found here"})
        }
      }) 
      .catch((error) => {
        console.log("error retrieveing comments", error);
        res.status(500).json({
            errorMessage: "there wasn an error trying to retrieve that comment info"
        })
      })
    }
  })
})

router.post('/', (req, res) => {
  const posts = req.body;
  if(!posts.title || !posts.contents) {
    res.status(400).json({ errorMessage: "Please provide title and contents for the post."})
  } else {
    Posts.insert(posts)
    .then((post) => {
      res.status(201).json(post)
    }).catch((error) => {
      console.log('error saving post');
      res.status(500).json({ error: "There was an error while saving the post to the database" })
    })
  }
})

// router.post("/:id/comments", (req, res) => {
//   const comments = req.body;
//   if (!comments.text) {
//       res.status(400).json({ errorMessage:"you need to provide a text field."})
//   }else {
//       comments.post_id = req.params.id;
//       Posts.insertComment(comments)
//       .then((comments) => {
//           Posts.findPostComments(comments)
//           .then((posts) => {
//               res.status(201).json(posts);
//           })
//       })
//       .catch((error) => {
//           console.log("error on the POST no text field", error);
//           res.status(500).json({
//               errorMessage: " There was an error while saving the comment"
//           })
//       })
//   }
// })
router.post(`/:id/comments`, (req, res) => {
  const id = req.params.id
  Posts.findById(id)
  .then(post => {
    if(post.length === 0){
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    } else {
      const comments = req.body;
      if (!comments.text) {
          res.status(400).json({ errorMessage:"you need to provide a text field."})
      }else {
          comments.post_id = req.params.id;
          Posts.insertComment(comments)
          .then((comments) => {
              Posts.findPostComments(comments)
              .then((posts) => {
                  res.status(201).json(posts);
              })
          })
          .catch((error) => {
              console.log("error on the POST no text field", error);
              res.status(500).json({
                  errorMessage: " There was an error while saving the comment"
              })
          })
      }
    }
  })
})
// router.post(`/:id/comments`, (req, res) => {
//   const id = req.params.id
//   Posts.findById(id) 
//   .then((post) => {
//     if(post.toString() === 0){
//       res.status(404).json({ message: "The post with the specified ID does not exist." })
//     } else {
//       comments.post_id = req.params.id;
//       Posts.insertComment(comments)
//       .then((comments) => {
//           Posts.findPostComments(comments)
//           .then((posts) => {
//               res.status(201).json(posts);
//           })
//       })
//       .catch((error) => {
//           console.log("error on the POST no text field", error);
//           res.status(500).json({
//               errorMessage: " There was an error while saving the comment"
//           })
//       })
//   }
//   })
// })
router.put('/:id', (req, res) => {
  if(!req.body.title || !req.body.contents) {
      res.status(400).json({errorMessage: "please provide title and contents for the post"})
  } 
  Posts
  .update(req.params.id, req.body)
  .then(count => {
      if (count > 0) {
          Posts.findById(req.params.id)
          .then((post) => {
              res.status(200).json(post)
          })  
      }
  })
  .catch(error => {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error updating the post'
      });
  });
});

router.delete("/:id", (req, res) => {
  Posts.remove(req.params.id)
  .then(removed => {
      if(removed) {
          res.status(404).json({message: "post deleted", removed})
      }else{
          res.status(200).json({message: "post not found"})
      }
  })
  
})
module.exports = router;