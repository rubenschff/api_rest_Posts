# api_rest_Posts


Foi usado banco de dados PostgresSQL. 

É preciso criar uma database e configurar a conexão no seguinte 
path `\src\server\database\knex\enviroments.ts`

Para criar as tabelas do banco é só rodar `pnpm knex:migrate` após configurar a conexão com o banco.

Criar um arquivo `.env` no diretório `root` do projeto com os seguintes dados

`PORT= //Porta que a API vai ficar disponível`

`NODE_ENV=develop  //enviroment`

`JWT_SECRET= //adicionar um hash ou uma string, dado necessário pra gerar os tokens`