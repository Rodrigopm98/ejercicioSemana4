import { Sequelize } from "sequelize";

const db = new Sequelize("esugbqwv", "esugbqwv", "UjOXyHo8NyVDEmzxlaBRDRmo_5lhjIRU", {
    host: "silly.db.elephantsql.com",
    dialect: 'postgres',
    logging: true
})

export default db