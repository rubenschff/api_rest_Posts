import { server } from './server/server';
import * as dotenv from 'dotenv';

dotenv.config();

server.listen(process.env.PORT || 3333, () => {
    console.log(`App rodando na porta ${process.env.PORT || 3333}`);
})