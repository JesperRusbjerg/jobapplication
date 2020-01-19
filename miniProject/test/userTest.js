require('mocha')
const expect = require("chai").expect
const makeData = require("../makeData")
const disconnect = require("../dbConnect").disconnect
const connect = require("../dbConnect").connect

const userFacade = require("../facades/userFacade")
const Position = require("./../models/position")


describe("userFacade", function () {
    before(async function () {
        await connect();
    })

    after(async function () {
        await disconnect()
    })

    beforeEach(async function () {
        await makeData();
    })

    describe("delteUser()", function () {
        it("Should delete one user", async function () {
            let users = await userFacade.getAllUsers()
            let user = users[0]
            let expectedValue = users.length - 1
            
            await userFacade.deleteUser(user._id)
            let res = await userFacade.getAllUsers()
            actualValue = res.length
            expect(expectedValue).to.be.equal(actualValue)
        })
    })

    describe("addUser()", function () {
        it("Should create a new user", async function () {
            let user = {
                firstName: "test",
                lastName: "test",
                userName: "test",
                password: "test",
                email: "test@gmail.com",
                job: [{
                    type: "test",
                    company: "test",
                    companyUrl: "test.net"
                }]
            }
            let beforeUserList = await userFacade.getAllUsers()
            await userFacade.addUser(user);
            let afterUserList = await userFacade.getAllUsers()
            expect(afterUserList.length).to.be.equal(beforeUserList.length + 1);
        })
    })
    describe("getAllUsers()", function () {
        it("Should return all users and be length 3", async function () {
            const userAmount = await userFacade.getAllUsers().then(data => data.length);
            expect(userAmount).to.be.equal(3)
        })
    })

    describe("findByUsername", function () {
        it("should find user with userName Perlt11", async function () {
            const user = await userFacade.findByUserName("Perlt11");
            expect(user.firstName).to.be.equal("Nikolai")
            expect(user.lastName).to.be.equal("Perlt")
        })
    })

    describe("addJobToUser", function () {
        it("Should add job to user", async function () {
            const job = {
                type: "Test",
                company: "Test",
                companyUrl: "Test"
            }
            const user = await userFacade.findByUserName("Perlt11");
            const newUser = await userFacade.addJobToUser(user._id, job);
            expect(newUser.job.length).to.be.equal(2);
        })
    })

    describe("login()", function () {
        it("Should return a list with users friends within radius 1500", async function () {
            const login = await userFacade.login("Perlt11", "sol", 12.557458877563475, 55.77850389183611, 1500);
            expect(login.friends.length).to.be.equal(1)
        })
        it("Should return a list with users friends within radius 3200", async function () {
            const login = await userFacade.login("Perlt11", "sol", 12.557458877563475, 55.77850389183611, 3200);
            expect(login.friends.length).to.be.equal(2)
        })
        it("should return a error with wrong login", async function () {
            try {
                const friends = await userFacade.login("Perlt11", "WRONG", 12.557458877563475, 55.77850389183611, 2000)
            } catch (e) {
                expect(e.msg).to.be.equal("wrong username or password")
                expect(e.status).to.be.equal(403)
            }
        })
        it("Should update user location", async function () {
            await userFacade.login("Perlt11", "sol", 12, 15, 2000);
            const user = await userFacade.findByUserName("Perlt11");
            const pos = await Position.findOne({ user: user._id });
            expect(pos).to.not.be.null;
        })
    })
})