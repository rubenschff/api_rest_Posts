import { knex }  from "knex"
import { teste, production, development } from "./enviroments"


const getEnviroment = () =>{
    switch (process.env.NODE_ENV) {
        case 'production': return production;
        case 'teste': return teste;
            
        default: return development;
    }
}


export const Knex = knex(getEnviroment());