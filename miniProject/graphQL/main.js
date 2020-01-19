const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const userFacade = require("./../facades/userFacade")
const cors = require("cors")
const debug = require("debug")("jp-gql")


const schema = buildSchema(`
    type Query {
        getAllUsers: [User]
        findtByUsername(username: String!): User
    }
    
    type Mutation {
        addUser(user: userInput): User
        deleteUser(userId: String!): String
        addJobToUser(userId: String!, job: JobInput!): User
    }

    type User {
        firstName: String
        lastName: String
        userName: String
        email: String
        job: [Job]
        friends: [ID]
        id: String
    }

    input JobInput {
        type: String!
        company: String!
        companyUrl: String!
    }

    input userInput {
        firstName: String!
        lastName: String!
        userName: String!
        password: String!
        email: String!
        job: [JobInput]
    }

    type Job { 
        type: String
        company: String
        companyUrl: String
    }
`)



// Resolver
const root = {
    getAllUsers: async () => {
        users = await userFacade.getAllUsers();
        return users
    },
    findtByUsername: async ({ username }) => {
        return await userFacade.findByUserName(username)
    },
    addUser: async ({ user }) => {
        debug(user)
        return await userFacade.addUser(user)
    },
    deleteUser: async ({userId}) => {
        const success = await userFacade.deleteUser(userId)
        if(success){
            return "User deleted"
        }
        return "Failed to delete user"
    },
    addJobToUser: async ({userId, job}) => {
        debug(job, userId)
        let user = await userFacade.addJobToUser(userId, job);
        return user;
    }
}


function startGraphQL(port = 3001) {
    var app = express();

    app.use((req, res, next) => {
        debug(`Headers: ${req.header("host")} - Gql endpoint`)
        next()
    })

    app.use(cors())

    app.use('/graphql', graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    }));

    app.listen(port, () => debug(`Running a GraphQL API server at localhost:${port}/graphql`));
}

module.exports = { startGraphQL }
