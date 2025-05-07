// https://www.npmjs.com/package/jsonwebtoken
import JWT from 'jsonwebtoken'

// Function tạo mới token - cần 3 tham số đầu vào
// userInfo: thông tin muốn đính kèm trong token
// secretSignature(privateKey): chữ kí bí mật (dang một string ngẫu nhiên)
// tokenLife: thời gian sống của token (thời gian mà token có hiệu lực)
const generateToken = async (userInfo, secretSignature, tokenLife) => {
  try {
    // Hàm sign() của JWT sẽ tạo ra một token mới, thuật toán măc định là HS256
    return JWT.sign(userInfo, secretSignature, { algorithm: 'HS256', expiresIn: tokenLife })
  } catch (error) { throw new Error(error) }
}

// Function kiểm tra token có hợp lệ hay không
// Hợp lệ là token được tạo ra có đúng với chữ kí bí mật hay không
const verifyToken = async (token, secretSignature) => {
  try {
    // Hàm verify() của JWT sẽ kiểm tra token có hợp lệ hay không
    return JWT.verify(token, secretSignature)
  } catch (error) { throw new Error(error) }
}

export const JwtProvider = {
  generateToken,
  verifyToken
}