import { compare, genSalt, hash } from 'bcryptjs';


const SALT_RAMDOM = 8;

const hashPassword =async (password:string) => {
    const saltGenerate = await genSalt(SALT_RAMDOM);
    return await hash(password, saltGenerate);
};

const verifyPassword =async (password:string, hashedPassword: string) => {
   return await compare(password, hashedPassword);
};


export const passwordCrypto = {
    hashPassword,
    verifyPassword,
};