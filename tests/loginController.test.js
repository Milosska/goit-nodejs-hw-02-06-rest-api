require("dotenv").config();
const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require("bcrypt");
const { User } = require("../models/users");
const app = require("../app");

const { TEST_DB_URL, PORT = 3000 } = process.env;
const loginRoute = "/users/login";

describe("login controller test", () => {
  const validUser = { email: "myemail@mail.com", password: "qwerty123" };
  let createdUser;

  beforeAll(async () => {
    // establish test-db connection
    mongoose
      .connect(TEST_DB_URL)
      .then(() => {
        console.log("Test database connection successful");
        app.listen(PORT);
      })
      .catch((error) => {
        console.log(error.message);
      });

    // seed db with user
    const hashPassword = await bcrypt.hash(validUser.password, 12);
    createdUser = await User.create({ ...validUser, password: hashPassword });
  });

  afterAll(async () => {
    // remove created user
    await User.findByIdAndDelete(createdUser._id);
  });

  describe("body validation", () => {
    describe("all data is correct", () => {
      it("return 200 OK, if email and password are valid", async () => {
        const validData = { email: "myemail@mail.com", password: "qwerty123" };
        const res = await request(app).post(loginRoute).send(validData);
        expect(res.status).toEqual(200);
      });
    });

    describe("email validation", () => {
      it("return 400 Missing fields, if email is not provided", async () => {
        const invalidData = { password: "qwerty123" };
        const res = await request(app).post(loginRoute).send(invalidData);
        expect(res.status).toEqual(400);
      });

      it("return 400 Missing fields, if email is not a valid email", async () => {
        const invalidData = { email: "testtest", password: "qwerty123" };
        const res = await request(app).post(loginRoute).send(invalidData);

        expect(res.status).toEqual(400);
      });
    });

    describe("password validation", () => {
      it("return 400 Missing fields, if password is not provided", async () => {
        const invalidData = { email: "myemail@mail.com" };
        const res = await request(app).post(loginRoute).send(invalidData);
        expect(res.status).toEqual(400);
      });

      it("return 401 Email or password is wrong, if password is not a valid password", async () => {
        const invalidData = { email: "myemail@mail.com", password: "12345qwe" };
        const res = await request(app).post(loginRoute).send(invalidData);

        expect(res.status).toEqual(401);
      });
    });

    describe("no data is send", () => {
      it("return 400 Missing fields, if {} is send instead of valid data", async () => {
        const invalidData = {};
        const res = await request(app).post(loginRoute).send(invalidData);
        expect(res.status).toEqual(400);
      });

      it("return 400 Missing fields, if empty strings are send instead of valid data", async () => {
        const invalidData = { email: "", password: "" };
        const res = await request(app).post(loginRoute).send(invalidData);
        expect(res.status).toEqual(400);
      });
    });
  });

  describe("response token check", () => {
    it("return some data in token field, if login is successful", async () => {
      const res = await request(app).post(loginRoute).send(validUser);
      expect(res.body).toHaveProperty("token");
    });

    it("return string data type in token field, if login is successful", async () => {
      const res = await request(app).post(loginRoute).send(validUser);
      expect(typeof res.body.token).toEqual("string");
    });
  });

  describe("response userdata check", () => {
    it("return some data in user field, if login is successful", async () => {
      const res = await request(app).post(loginRoute).send(validUser);
      expect(res.body).toHaveProperty("user");
    });

    it("return object data type in user field, if login is successful", async () => {
      const res = await request(app).post(loginRoute).send(validUser);
      expect(typeof res.body.user).toEqual("object");
    });

    it("return only two properties in user field, if login is successful", async () => {
      const res = await request(app).post(loginRoute).send(validUser);
      const props = Object.keys(res.body.user);
      expect(props).toHaveLength(2);
    });

    it("return properties email and subscription in user field, if login is successful", async () => {
      const res = await request(app).post(loginRoute).send(validUser);
      const props = Object.keys(res.body.user);
      expect(props).toContainEqual("email");
      expect(props).toContainEqual("subscription");
    });

    it("return string data type in email and subscription fields of user object, if login is successful", async () => {
      const res = await request(app).post(loginRoute).send(validUser);
      const { email, subscription } = res.body.user;
      expect(typeof email).toEqual("string");
      expect(typeof subscription).toEqual("string");
    });
  });
});
