const express = require("express");
const request = require("supertest");

const authRouter = require("../routes/users");

const app = express();

// app.use(express.json());
app.use("/users", authRouter);

/* Tests:
1) Validation check
- when login and password are correct
- when login is corrrect and password is not correct
- when password is corrrect and login is not correct
- when login is corrrect and there is no password
- when password is corrrect and there is no login
- when {} is sent

2)StatusCode check
- when request is correct (statusCode 200)
- when request is not valid (statusCode 400)
- when there is no user in the database (statusCode 401)
- when there is a user, but given password is not correct (statusCode 401)
- when there is no connection to the database (statusCode 500)

3)Token check
when request is correct
- there is token;
-token is a String type

4)Response data check
- response in given in JSON format
- when request is correct (returned {token: String, user: {email: String, subscription: String}} )
- when request is cont correct ( returned {message: String})

*/

describe("test userLogin controller", () => {
  let server;

  beforeAll(() => {
    server = app.listen(3000);
  });
  afterAll(() => {
    server.close();
  });

  describe("Validation check", () => {
    test("when login and password are correct", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({ email: "myemail@mail.com", password: "qwerty123" })
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(200);
    });
  });

  //   describe("StatusCode check", () => {});

  //   describe("Token check", () => {});

  //   describe("Response data check", () => {});
});
