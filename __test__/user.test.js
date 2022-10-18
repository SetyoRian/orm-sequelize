const request = require('supertest');
const app = require ('../app');
const { sequelize } = require ('../models');
const jsonwebtoken = require("jsonwebtoken");

const userData = {
    username: "user_pertama",
    email: "user-pertama@mail.com",
    password: "12345678"
};

const wrongUser = {
    username: "wrong_user",
    email: "wronuser@mail.com",
    password: "123456"
};

const imageData = {
    title: "Test Photo",
    caption: "This is Photo Test",
    image_url: "http://testphoto.com"
}
const auth = {};
let photoId = null;


describe('POST /users/register', () => {
    it("should send response with 201 status code", (done) => {
        request(app)
        .post('/users/register')
        .send(userData)
        .end(function(err, res) {
            if(err) {
                done(err);
            }
            expect(res.status).toEqual(201);
            expect(typeof res.body).toEqual("object");
            expect(res.body).toHaveProperty("id");
            expect(res.body).toHaveProperty("username");
            expect(res.body).toHaveProperty("email");
            expect(res.body.username).toEqual(userData.username);
            expect(res.body.email).toEqual(userData.email);
            done();
        })
    })
});

describe('POST /users/login', () => {
    it("should send response with 200 status code", (done) => {
        request(app)
        .post('/users/login')
        .send(userData)
        .end(function (err, res) {
            if(err) {
                done(err);
            }
            expect(res.status).toEqual(200);
            expect(typeof res.body).toEqual("object");
            expect(res.body).toHaveProperty("token");
            expect(typeof res.body.token).toEqual("string");
            auth.token = res.body.token;
            auth.current_user_id = jsonwebtoken.decode(auth.token).id;
            done();
        })
    })
});

describe('POST /users/login', () => {
    it("should send response with 401 status code", (done) => {
        request(app)
        .post('/users/login')
        .send(wrongUser)
        .end(function (err, res) {
            if(err) {
                done(err);
            }
            expect(res.status).toEqual(401);
            expect(typeof res.body).toEqual("object");
            expect(res.body).toHaveProperty("name");
            expect(res.body).toHaveProperty("devMessage");
            expect(res.body.name).toEqual("User Login Error");
            done();
        })
    })
});

const manyImageData = [
    {
        title: 'Foto pertama Milik UserID 1',
        caption: 'Ini foto pertama milik UserID 1',
        image_url: 'https://photopertama.com',
        UserId: auth.current_user_id,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        title: 'Foto kedua Milik UserID 1',
        caption: 'Ini foto kedua milik UserID 1',
        image_url: 'https://photokedua.com',
        UserId: auth.current_user_id,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        title: 'Foto ketiga Milik UserID 1',
        caption: 'Ini foto ketiga milik UserID 1',
        image_url: 'https://photoketiga.com',
        UserId: auth.current_user_id,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
]

describe('POST /photos', () => {
    beforeAll((done) => {
        sequelize.queryInterface.bulkInsert('Photos',manyImageData, {})
        .then(() => {
            return done();
        })
        .catch(err => {
            done(err);
        })
    });
    it("should send response with 201 status code", (done) => {
        request(app)
        .post('/photos')
        .set('token', auth.token)
        .send(imageData)
        .end(function(err, res) {
            if(err) done(err);
            expect(res.status).toEqual(201);
            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty("id");
            expect(res.body).toHaveProperty("title");
            expect(res.body).toHaveProperty("caption");
            expect(res.body).toHaveProperty("image_url");
            expect(res.body).toHaveProperty("UserId");
            expect(res.body).toHaveProperty("updatedAt");
            expect(res.body).toHaveProperty("createdAt");
            expect(res.body.title).toEqual(imageData.title);
            expect(res.body.caption).toEqual(imageData.caption);
            expect(res.body.image_url).toEqual(imageData.image_url);
            expect(res.body.UserId).toEqual(auth.current_user_id);
            photoId = res.body.id;
            done();
        });
    });
});


describe('POST /photos', () => {
    it("should send response with 401 status code", (done) => {
        request(app)
        .post('/photos')
        .send(imageData)
        .end(function(err, res) {
            if(err) done(err);
            expect(res.status).toEqual(401);
            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty("name");
            expect(res.body).toHaveProperty("message");
            expect(res.body.name).toEqual("JsonWebTokenError");
            expect(res.body.message).toEqual("jwt must be provided");
            done();
        });
    });
});

describe('GET /photos', () => {
    it('shold send response with 200 status code and array of json', (done) => {
        request(app)
        .get('/photos')
        .set('token', auth.token)
        .end(function(err, res) {
            if(err) done(err);
            expect(res.status).toEqual(200);
            expect(typeof res.body).toEqual("object");
            expect(res.body.length).toBe(4);
            expect(typeof res.body[0]).toEqual("object")
            expect(res.body[0]).toHaveProperty("id")
            expect(res.body[0]).toHaveProperty("title");
            expect(res.body[0]).toHaveProperty("caption")
            expect(res.body[0]).toHaveProperty("image_url");
            expect(res.body[0]).toHaveProperty("UserId")
            expect(res.body[0]).toHaveProperty("User");
            expect(typeof res.body[0].User).toEqual("object");
            expect(res.body[3].User).toHaveProperty("id");
            expect(res.body[3].User).toHaveProperty("username");
            expect(res.body[3].User).toHaveProperty("email");
            done();
        });
    });
});

describe('GET /photos', () => {
    it("should send response with 401 status code", (done) => {
        request(app)
        .get('/photos')
        .end(function(err, res) {
            if(err) done(err);
            expect(res.status).toEqual(401);
            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty("name");
            expect(res.body).toHaveProperty("message");
            expect(res.body.name).toEqual("JsonWebTokenError");
            expect(res.body.message).toEqual("jwt must be provided");
            done();
        });
    });
});

describe('GET /photos/:id', () => {
    it("should send response with 200 status code", (done) => {
        request(app)
        .get(`/photos/${photoId}`)
        .set('token', auth.token)
        .end(function(err, res) {
            if(err) done(err);
            expect(res.status).toEqual(200);
            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty("id");
            expect(res.body).toHaveProperty("title");
            expect(res.body).toHaveProperty("caption");
            expect(res.body).toHaveProperty("image_url");
            expect(res.body).toHaveProperty("UserId");
            expect(res.body).toHaveProperty("updatedAt");
            expect(res.body).toHaveProperty("createdAt");
            expect(res.body.title).toEqual(imageData.title);
            expect(res.body.caption).toEqual(imageData.caption);
            expect(res.body.image_url).toEqual(imageData.image_url);
            expect(res.body.UserId).toEqual(auth.current_user_id);
            done();
        });
    });
});

describe('GET /photos/:id', () => {
    it("should send response with 401 status code", (done) => {
        request(app)
        .get(`/photos/${photoId}`)
        .end(function(err, res) {
            if(err) done(err);
            expect(res.status).toEqual(401);
            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty("name");
            expect(res.body).toHaveProperty("message");
            expect(res.body.name).toEqual("JsonWebTokenError");
            expect(res.body.message).toEqual("jwt must be provided");
            done();
        });
    });
});

afterAll((done) => {
    sequelize.queryInterface.bulkDelete('Users', {})
    .then(() => {
        return done();
    })
    .catch(err => {
        done(err);
    })
    sequelize.queryInterface.bulkDelete('Photos', {})
    .then(() => {
        return done();
    })
    .catch(err => {
        done(err);
    })
});