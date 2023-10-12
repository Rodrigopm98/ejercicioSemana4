import { DataTypes } from "sequelize";
import db from "../db/connections.js";

const Usuario = db.define("Usuario", {
    nombre : {
        type: DataTypes.STRING
    },
    edad : {
        type: DataTypes.INTEGER
    },
    email : {
        type: DataTypes.STRING
    },
    telefono : {
        type: DataTypes.STRING
    }
},{
    timestamps : false,
    tableName : "usuarios"
})

export default Usuario