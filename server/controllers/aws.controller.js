const S3 = require("aws-sdk/clients/s3");
const aws_sdk = require("aws-sdk");
const uuid = require("uuid");
const config = require("../config");

const access = new aws_sdk.Credentials({
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
});

const s3 = new S3({
    credentials: access,
    region: "eu-west-2",
    signatureVersion: "v4",
});

const db = require("../models");
const user = db.user;


exports.getSignedUrl = async (req, res) => {
    const fileId = uuid.v4();
    const signedUrlExpireSeconds = 60 * 15;
    
    let fileType = req.body.fileType;

    const url = await s3.getSignedUrlPromise("putObject", {
        Bucket: "momento-s3",
        Key: `${fileId}.${fileType}`,
        ContentType: fileType,
        Expires: signedUrlExpireSeconds,
    });

    res.status(200).send(url);
}

exports.updateProfilePic = (req, res) => {
    if (req.body.url) {
        try {
            user.findOne({
                where: {
                    id: req.userId
                }
            })
            .then(async (foundUser) => {
                if (foundUser.profilePicture !== null) {
                    // delete previous profile pic from S3
                    var key = foundUser.profilePicture.split("/")[3];
                    s3.deleteObject({Bucket: "momento-s3", Key: key}, function(err,data) {
                        if (err) {
                            console.log("Error deleting S3 object");
                        } else {
                            console.log("Object deleted successfully");
                        }
                    })
                }
                foundUser.profilePicture = req.body.url
                await foundUser.save();
                res.status(200).send({ message: "Profile picture updated successfully" });
            })
        } catch (err) {
            return res.status(500).send("Error updating profile picture");
        }
    } else {
        return res.status(404).send({ message: "No url provided" });
    }
}

exports.deleteObject = (req, res) => {
    var params = {
        Bucket: 'momento-s3',
        Key: req.body.objectId
    }
    s3.deleteObject(params, function(err, data) {
        if (err) {
            return res.status(500).send("Error deleting S3 object");
        } else {
            res.status(200).send({ message: "Object deleted successfully" });
        }
    })
}

exports.deleteProfilePicture = (req, res) => {
    try {
        user.findOne({
            where: {
                id: req.userId
            }
        })
        .then(async (foundUser) => {
            if (foundUser.profilePicture !== null) {
                // delete previous profile pic from S3
                var key = foundUser.profilePicture.split("/")[3];
                s3.deleteObject({Bucket: "momento-s3", Key: key}, function(err,data) {
                    if (err) {
                        console.log("Error deleting S3 object");
                    } else {
                        console.log("Object deleted successfully");
                    }
                })
            }
            foundUser.profilePicture = null;
            await foundUser.save();
            res.status(200).send({ message: "Profile picture deleted successfully" });
        })
    } catch (err) {
        return res.status(500).send("Error deleting profile picture");
    }
}