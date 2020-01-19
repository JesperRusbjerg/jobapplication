require('mocha')
const expect = require("chai").expect
const makeData = require("../makeData")
const dbDisconnect = require("../dbConnect").disconnect
const dbConnect = require("../dbConnect").connect
const restStart = require("./../rest/mainRest").start
const restStop = require("./../rest/mainRest").stop
const fetch = require("node-fetch")
const userModel = require("./../models/user")
const nock = require("nock")
const debug = require("debug")("jp-userRestTest")

describe("Test user rest endpoints", function () {
    before(async function () {
        await dbConnect();
        await restStart();
    })

    after(async function () {
        await restStop();
        await dbDisconnect();
    })

    beforeEach(async function () {
        await makeData();
    })

    describe("Get all users from MOCK with NOCK", function () {
        it("Should return a list of users", async function () {
            nock('https://swapi.co')
                .get("/api/people/1")
                .reply(200, {
                    "name": "Luke Skywalker",
                    "height": "172",
                    "mass": "77",
                    "hair_color": "blond",
                    "skin_color": "fair",
                    "eye_color": "blue",
                    "birth_year": "19BBY",
                    "gender": "male",
                    "homeworld": "https://swapi.co/api/planets/1/",
                    "films": [
                        "https://swapi.co/api/films/2/",
                        "https://swapi.co/api/films/6/",
                        "https://swapi.co/api/films/3/",
                        "https://swapi.co/api/films/1/",
                        "https://swapi.co/api/films/7/"
                    ],
                    "species": [
                        "https://swapi.co/api/species/1/"
                    ],
                    "vehicles": [
                        "https://swapi.co/api/vehicles/14/",
                        "https://swapi.co/api/vehicles/30/"
                    ],
                    "starships": [
                        "https://swapi.co/api/starships/12/",
                        "https://swapi.co/api/starships/22/"
                    ],
                    "created": "2014-12-09T13:50:51.644000Z",
                    "edited": "2014-12-20T21:17:56.891000Z",
                    "url": "https://swapi.co/api/people/1/"
                });
            let starWars = await fetch("https://swapi.co/api/people/1").then(e => e.json())
            expect(starWars.name).to.be.equal("Luke Skywalker");
        })
    })

    describe("DELTE: user/", function () {
        it("Should delete a user", async function () {
            const { _id } = await userModel.findOne({});
            const url = "http://localhost:3001/api/user"
            let response = await fetch(url, {
                method: "DELETE",
                body: JSON.stringify({ id: _id }),
                headers: {
                    "Content-Type": "application/json",
                }
            })
            response = await response.json()
            expect(response.status).to.be.equal("Good")
        })
    })

    describe("POST: user/login", function () {
        it("Should login", async function () {
            const url = "http://localhost:3001/api/user/login"
            let user = {
                username: "Perlt11",
                password: "sol",
                lat: 12.557458877563475,
                lon: 55.77850389183611,
                radius: 1500000000
            }
            let res = await fetch(url, {
                method: "POST",
                body: JSON.stringify(user),
                headers: {
                    "Content-Type": "application/json",
                }
            }).then((res) => res.json())
            expect(res).to.not.be.null

        })
    })

    describe("GET: user/all", function () {
        it("Should return return 3 users", async function () {
            const url = "http://localhost:3001/api/user/all";
            const response = await fetch(url);
            const data = await response.json();
            expect(data.length).to.be.equal(3)
        })
    })
    describe("GET: user/:username", function () {
        it("Should return user with username Perlt11", async function () {
            const url = "http://localhost:3001/api/user/Perlt11";
            const response = await fetch(url);
            const data = await response.json();
            expect(data.firstName).to.be.equal("Nikolai")
            expect(data.lastName).to.be.equal("Perlt")
        })
    })
    describe("POST: /", function () {
        it("Should post a new user", async function () {
            const url = "http://localhost:3001/api/user"
            const user = {
                firstName: "TEST",
                lastName: "TEST",
                userName: "TEST",
                password: "TEST",
                email: "TEST@gmail.com",
                job: [{
                    type: "TEST",
                    company: "TEST",
                    companyUrl: "TEST.net"
                }]
            }

            await fetch(url, {
                method: "POST",
                body: JSON.stringify(user),
                headers: {
                    "Content-Type": "application/json",
                }
            })
            const userList = await userModel.find({});
            expect(userList.length).to.be.equal(4)
        })
    })

    describe("PUT: /job", async function () {
        it("Should create job on user", async function () {
            const url = "http://localhost:3001/api/user/job";
            const userId = await userModel.findOne({ userName: "Perlt11" }).then(user => user._id);
            const body = {
                job: {
                    type: "TEST",
                    company: "TEST",
                    companyUrl: "TESt.net"
                },
                id: userId
            }
            await fetch(url, {
                method: "PUT",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                }
            })
            const user = await userModel.findById(userId);
            expect(user.job.length).to.be.equal(2);
        })
    })
})