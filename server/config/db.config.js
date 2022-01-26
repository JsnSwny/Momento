module.exports = {
    HOST: "momento.clkmzqnzhe8z.eu-west-2.rds.amazonaws.com",
    USER: "mementouser",
    PASSWORD: "Memento2022",
    DB: "memento",
    dialect: "mysql",
    pool: {
        max: 20,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}