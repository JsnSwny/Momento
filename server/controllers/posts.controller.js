const db = require("../models");
const User = db.user;
const Post = db.post;
const Comment = db.comment;

exports.getPosts = (req, res) => {
    try {
        var postsResponse = {
            posts: []
        };

        // get all posts
        Post.findAndCountAll()
        .then(async (posts) => {

            for (let i = 0; i < posts.count; i++) {

                // structure single post response
                var postData = {
                    id: posts.rows[i].id,
                    title: posts.rows[i].title,
                    description: posts.rows[i].description,
                    imageURL: posts.rows[i].imageURL,
                    likes: 200, // no likes table yet - to be implemented
                    views: posts.rows[i].views,
                    collaborators: posts.rows[i].collaborators,
                    comments: []
                };

                // get all comments and their author for each post
                await Comment.findAndCountAll({
                    where: {
                        postId: posts.rows[i].id
                    },
                    include: {
                        model: User
                    }
                })
                .then(comments => {

                    for (let j = 0; j < comments.count; j++) {
                        
                        // structure comment response
                        var commentData = {
                            name: comments.rows[j].user.firstName + " " + comments.rows[j].user.lastName,
                            imageURL: comments.rows[j].user.profilePicture,
                            comment: comments.rows[j].text,
                            commented_at: comments.rows[j].dateCommented
                        };

                        postData.comments.push(commentData);

                    }

                })
                postsResponse.posts.push(postData);
            }
            return res.status(200).send(JSON.stringify(postsResponse));
        })
    } catch (err) {
        return res.status(500).send(err);
    }
    
}