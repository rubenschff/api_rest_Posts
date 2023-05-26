import { Router } from "express";
import {  UsuariosController} from "../controllers";
import { autenticateRoutes } from "../shared/middleware";
import {RoutesEnum} from "./routes.enum";
import {PostsTable} from "../database/ETableNames";
import {PostsController} from "../controllers/posts";
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from "../../swagger.json"

const router = Router();

router.get("/", (req, res) => {
  return res.send("Bem vindo!");
});


//------------------------------------------------- API-Document -------------------------------------------------

router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(swaggerDocument));

//-------------------------------------------------Login e Cadastro-------------------------------------------------
router.post(RoutesEnum.cadastrar,UsuariosController.createValidation,UsuariosController.create);
router.post(RoutesEnum.entrar, UsuariosController.loginValidation,UsuariosController.login);


//-------------------------------------------------Rota de usuário-------------------------------------------------
// @ts-ignore
router.get(RoutesEnum.usuario,autenticateRoutes,UsuariosController.getByIdValidation,UsuariosController.getById);
// @ts-ignore
router.patch(RoutesEnum.usuario,autenticateRoutes,UsuariosController.updateByIdValidation,UsuariosController.updateById);
// @ts-ignore
router.delete(RoutesEnum.usuario,autenticateRoutes,UsuariosController.deleteByIdValidation,UsuariosController.deleteById);


//-------------------------------------------------Rota de posts-------------------------------------------------
router.post(RoutesEnum.posts,autenticateRoutes, PostsController.createValidation, PostsController.create)
router.patch(RoutesEnum.posts, autenticateRoutes, PostsController.updateByIdValidation, PostsController.updateById)
router.delete(RoutesEnum.posts, autenticateRoutes, PostsController.deleteByIdValidation, PostsController.deleteById)
router.get(RoutesEnum.posts, autenticateRoutes, PostsController.getAllValidation, PostsController.getAll)




export { router };
 