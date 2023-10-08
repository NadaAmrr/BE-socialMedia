import jwt from 'jsonwebtoken'

//Generate Token
export const generateToken = ({ payload = {}, signature = '', expiresIn = 60 * 60 } = {}) => {
    const token = jwt.sign(payload, signature, { expiresIn: parseInt(expiresIn) });
    return token
}

export const verifyToken = ({ token, signature = '' } = {}) => {
    const decoded = jwt.verify(token, signature);
    return decoded
}
//======================  ======================
// generate access token
export const accessTokenFun = ({id,email}={}) => {
    return generateToken({
      payload: { id, isLogged: true, email },
      signature: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: 60 * 60,
    });
  }
  // generate refresh token
export const refreshTokenFun = ({id,email}={})=>{
    return generateToken({
      payload: { id, isLogged: true, email },
      signature: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: 60 * 60 * 24 * 30 * 6 ,
    });
  }
