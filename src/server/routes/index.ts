import { Router } from "express";
import {  UsuariosController} from "../controllers";
import { autenticateRoutes } from "../shared/middleware";
import {RoutesEnum} from "./routes.enum";
import {PostsTable} from "../database/ETableNames";
import {PostsController} from "../controllers/posts";

const router = Router();

router.get("/", (req, res) => {
  return res.send("Bem vindo!");
});


//-------------------------------------------------Login e Cadastro-------------------------------------------------
router.post(RoutesEnum.cadastrar,UsuariosController.createValidation,UsuariosController.create);
router.post(RoutesEnum.entrar, UsuariosController.loginValidation,UsuariosController.login);


//-------------------------------------------------Rota de usuário-------------------------------------------------
// @ts-ignore
router.get(RoutesEnum.usuario,autenticateRoutes,UsuariosController.getByIdValidation,UsuariosController.getById);
// @ts-ignore
router.put(RoutesEnum.usuario,autenticateRoutes,UsuariosController.updateByIdValidation,UsuariosController.updateById);
// @ts-ignore
router.delete(RoutesEnum.usuario,autenticateRoutes,UsuariosController.deleteByIdValidation,UsuariosController.deleteById);


//-------------------------------------------------Rota de posts-------------------------------------------------
router.post(RoutesEnum.posts,autenticateRoutes, PostsController.createValidation, PostsController.create)
router.put(RoutesEnum.posts, autenticateRoutes, PostsController.updateByIdValidation, PostsController.updateById)
router.delete(RoutesEnum.posts, autenticateRoutes, PostsController.deleteByIdValidation, PostsController.deleteById)




export { router };
 