const express = require("express");
const router = express.Router();
const Posts = require("../data/db");

//get

router.get("/", (req, res) => {
  Posts.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: "the posts information couldn't be retreived" });
    });
});

// router.get("/:id", (req, res) => {
//   const { id } = req.params;
//   Posts.findById(id)
//     .then(posts => {
//       console.log("posts", posts);
//       if (!posts.length)
//         res
//           .status(404)
//           .json({ message: "the post with the specified id doesn't exist" });
//       else res.status(200).json(posts);
//     })
//     .catch(err => {
//       console.log(err);
//       res
//         .status(500)
//         .json({ message: "the post information couldn't be retrieved" });
//     });
// });
router.get(`/:id`, (req, res) => {
    const { id } = req.params
    Posts.findById(id)
      .then(posts => {
        posts
          ? res.status(200).json(posts)
          : res
              .status(404)
              .json({ message: 'The user with the specified ID does not exist.' })
      })
      .catch(err => {
        console.log(err.response)
        res
          .status(500)
          .send({ error: 'The list of users could not be retrieved' })
      })
  })



router.get("/comments/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  Posts.findCommentById(id)
    .then(data => {
      console.log(data);
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(500).json({ message: "couldnt get the comment" });
    });
});

// post

router.post("/", (req, res) => {
  const data = req.body;
  console.log(data);
  if (!data.contents || !data.title)
    res
      .status(400)
      .json({ errorMessage: "Please provide title and contents for the post" });
  Posts.insert(data)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({
          error: "There was an error while saving the post to the database"
        });
    });
});

router.post('/:id/comments', (req, res) => {
    const { text } = req.body
    const post_id = req.params.id

    Posts.findById(req.params.id)
        .then(post => {
            if (!post[0]) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
    if (!req.body.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    } else {
        Posts.insertComment({ text, post_id })
            .then(data => {
                console.log(data.id)
                res.status(201).json(data)
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({ errorMessage: 'Error 500: This is a server side error. If this error persists contact your server admin. '
                })
            })
    }
})





router.put("/:id", (req, res) => {
  const data = req.body;
  const { id } = req.params;
  console.log(data, "req", id);
  if (!data.title && !data.contents)
    res
      .status(400)
      .json({ errorMessage: "Please provide title and contents for the post" });
  Posts.update(id, data)
    .then(updated => {
      //if id doesn't exist
      if (updated === 0)
        res
          .status(404)
          .json({ message: "the post with the specified id doesn't exist" });
      else res.status(200).json(updated);
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: "the post information couldn't be modified" });
    });
});

// delete

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  Posts.remove(id)
    .then(deleted => {
      //if id doesn't exist
      if (deleted === 0)
        res
          .status(404)
          .json({ message: "the post with the specified id doesn't exist" });
      else res.status(200).json(deleted);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "the post coulldn't be removed" });
    });
});

module.exports = router;