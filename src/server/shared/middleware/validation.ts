import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { SchemaOf, ValidationError } from 'yup';

type TProperty = 'body'|'query'|'header'|'params'; //type das propriedades 

type TGetSchema = <T>(schema: SchemaOf<T>) => SchemaOf<T>;

type TAllSchemas = Record<TProperty,SchemaOf<any>>; //type dos schemas

type TGetAllSchemas = (getSchema: TGetSchema) => Partial<TAllSchemas>;

//partial permite que não sejam passados todos os argumentos
type TValidation = (getAllSchemas: TGetAllSchemas) => RequestHandler; 

export const validation: TValidation = (getAllSchemas) => async (req, res, next) => {
  const schemas = getAllSchemas(schema => schema)

  const errorsResult: Record<string, Record<string,string>> = {};

  //Array do objeto pra testar todas as possiveis entradas
  Object.entries(schemas).forEach(([key,schema]) => {
    try {
         schema.validateSync(req[key as TProperty], { abortEarly: false });
      } catch (err) {
        //tratando o erro como um yup object
        const yupError = err as ValidationError;
        const errors: Record<string, string> = {}; //definindo uma lista de erros vazia para armazenas os logs antes de retornar
    
        //lendo a lista de erros dos yup
        yupError.inner.forEach((error) => {
          if (!error.path) return; //se for undefined aborta
    
          errors[error.path] = error.message;
        });
        
        errorsResult[key] = errors
        
      }
  });

//Se não gerear nenhum erro avança para o próximo handler
  if (Object.entries(errorsResult).length === 0){
    return next();
  }else{
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errorsResult });
  }
  
};
