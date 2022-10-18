const { Photo } = require("../models");

function authorization(req, res, next) {
    const photoId = req.params.id;
    const authenticatedUser = res.locals.user;

    Photo.findOne({
        where: {
            id: photoId
        }
    })
    .then(photo => {
        if (!photo) {
            return res.status(404).json({
                name: "Data Not Found",
                devMessage: `Photo with id "${photoId}" not found`
            });
        }
        if (photo.UserId === authenticatedUser.id) {
            return next();
        } else {
            return res.status(403).json({
                name: "Authorization Error",
                devMessage: `User with id "${authenticatedUser.id}" does not have permission to acces Photo with id ${photoId}`
            });
        }
    })
    .catch(err => {
        return res.status(500).json(err);
    })
}

module.exports = authorization;