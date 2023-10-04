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