import * as jwt from 'jsonwebtoken';


interface IJWTData{
    uid: number;
}

const sign = (data: IJWTData) => {
    if (!process.env.JWT_SECRET) return 'JWT_SECRET_NOT_FOUND';
    return jwt.sign(data, process.env.JWT_SECRET, {expiresIn: '24h'});
}

const verify = (token: string) : IJWTData | 'JWT_SECRET_NOT_FOUND' | 'INVALID_TOKEN' => {

    if (!process.env.JWT_SECRET) return 'JWT_SECRET_NOT_FOUND';

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        if(typeof decode === 'string') {
            return 'INVALID_TOKEN';
        };

        return decode as IJWTData;
    } catch (error) {
        return 'INVALID_TOKEN';
    }
}

export const JWTservice = {
    sign,
    verify,
}