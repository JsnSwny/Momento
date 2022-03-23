const db = require("../models");
const User = db.user;
const Post = db.post;
const Comment = db.comment;
const Followers = db.followers;
const Like = db.like;

exports.getPosts = async (req, res) => {
    try {
        var postsResponse = {
            posts: [],
            likedPosts: []
        };

        var followArray = [];

        if (!req.body.username) {
            var following = await Followers.findAndCountAll({
                where: {
                    userId1: req.userId
                },
                attributes: ['userId2']
            });

            for (let i = 0; i < following.count; i++) {
                followArray.push(following.rows[i].userId2);
            }

            followArray.push(req.userId)
        } else {
            var user = await User.findOne({
                where: {
                    username: req.body.username
                }
            });
            followArray.push(user.id);
        }

        // get all posts
        Post.findAndCountAll({
            where: {
                userId: followArray
            },
            include: Like
        })
        .then(async (posts) => {

            for (let i = 0; i < posts.rows.length; i++) {
                for (let j = 0; j < posts.rows[i].likes.length; j++) {
                    if (posts.rows[i].likes[j].userId === req.userId) {
                        postsResponse.likedPosts.push(posts.rows[i].id);
                    }
                }

                // update views
                posts.rows[i].views = posts.rows[i].views + 1;
                await posts.rows[i].save();

                // structure single post response
                var postData = {
                    id: posts.rows[i].id,
                    title: posts.rows[i].title,
                    description: posts.rows[i].description,
                    imageURL: posts.rows[i].imageURL,
                    likes: posts.rows[i].likes.length,
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
                            username: comments.rows[j].user.username,
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
    
};

exports.addComment = (req, res) => {
    if (!req.body.text) {
        return res.status(418).send({ message: "No comment provided" });
    }
    if (!req.body.postId) {
        return res.status(418).send({ message: "No post id provided" });
    } 
    try {
        Comment.create({
            postId: req.body.postId,
            authorId: req.userId,
            text: req.body.text,
            dateCommented: db.sequelize.fn('NOW')
        })
        .then(() => {
            res.status(200).send({ message: "Comment added" });
        })
    } catch (err) {
        res.status(500).send({ message: "Internal server error when adding a new comment" });
    }
};

exports.likePost = async (req, res) => {
    try {
        Like.findOne({
            where: {
                postId: req.body.postId,
                userId: req.userId
            }
        })
        .then((like) => {
            if (like) {
                return res.status(400).send('Post already liked');
            } else {
                Like.create({
                    postId: req.body.postId,
                    userId: req.userId
                })
                .then((like) => {
                    return res.status(200).send('Post liked successfully');
                })
            }
        })
    } catch (err) {
        return res.status(500).send(err);
    }
};

exports.unlikePost = async (req, res) => {
    try {
        Like.findOne({
            where: {
                postId: req.body.postId,
                userId: req.userId
            }
        })
        .then((like) => {
            if (like) {
                like.destroy();
                return res.status(200).send('Post unliked successfully');
            } else {
                return res.status(400).send('Post not liked');
            }
        })
    } catch (err) {
        return res.status(500).send(err);
    }
}