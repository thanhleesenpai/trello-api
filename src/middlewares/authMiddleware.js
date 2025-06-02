import { StatusCodes } from 'http-status-codes'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'

// Middleware xác thực JWT access token nhận được từ FE có hợp lệ hay không
const isAuthorized = async (req, res, next) => {
  // Lấy accessToken trong request cookies phía client - withCredentials trong file authoriAxios
  const clientAccessToken = req.cookies?.accessToken

  // Kiểm tra accessToken có tồn tại hay không
  if (!clientAccessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! Token not found.' ))
    return
  }
  try {
    // Thực hiện giải mã accessToken
    const accessTokenDecoded = await JwtProvider.verifyToken(clientAccessToken, env.ACCESS_TOKEN_SECRET_SIGNATURE)
    //console.log('accessTokenDecoded: ', accessTokenDecoded)

    // Nếu token hợp lệ thì lưu thông tin giải mã vào req.jwtDecoded, để sử dung trong các middleware và controller khác
    req.jwtDecoded = accessTokenDecoded

    // Cho phép request đi tiếp
    next()
  } catch (error) {
    //console.log('error: ', error)
    // Nếu accessToken hết hạn thì trả về lỗi GONE - 410 cho FE biết để gọi refresh token
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Access Token expired! Please refresh your token.'))
      return
    }

    // Nếu token không hợp lệ thì trả về lỗi 401 UNAUTHORIZED cho FE để sign out
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! Invalid token.'))
  }
}

export const authMiddleware = {
  isAuthorized
}