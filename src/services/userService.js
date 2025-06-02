import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { BrevoProvider } from '~/providers/BrevoProvider'
import { env } from '~/config/environment'
import { JwtProvider } from '~/providers/JwtProvider'

const createNew = async (reqBody) => {
  try {
    // Kiểm tra xem email đã tồn tại trong hệ thống chưa
    const existUser = await userModel.findOneByEmail(reqBody.email)
    if (existUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exists!')
    }
    // Tạo data để lưu vào Database
    // Nếu email là abc@gmail.com thì nameFromEmail sẽ là abc
    const nameFromEmail = reqBody.email.split('@')[0]
    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8), // Mã hóa password(8 là số lần mã hóa)
      username: nameFromEmail,
      displayName: nameFromEmail, // Mặc định để giống username khi user đăng ký mới
      verifyToken: uuidv4() // Tạo một mã xác thực ngẫu nhiên
    }
    // Thực hiện lưu thông tin user vào database
    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)

    // Gửi email cho người dùng xác thực tài khoản
    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
    const customSubject = 'Trello MERN Stack: Please verify your email before using our service!'
    const htmlContent = `
      <h3>Here is your verification link:</h3>
      <h3>${verificationLink}</h3>
      <h3>Sincerely,<br/> - Thanhlee -</h3>
    `
    // Gọi tới Provider gửi email
    await BrevoProvider.sendEmail(getNewUser.email, customSubject, htmlContent)

    // return trả về dữ liệu cho phía Controller
    return pickUser(getNewUser)

  } catch (error) { throw error }
}

const verifyAccount = async (reqBody) => {
  try {
    //Query thông tin user trong DB
    const existUser = await userModel.findOneByEmail(reqBody.email)
    // Các bước kiểm tra cần thiết
    if (!existUser) { throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!') }
    if (existUser.isActive) { throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Account already activated!') }
    if (existUser.verifyToken !== reqBody.token) { throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Token is not correct!') }

    // Nếu mọi thứ đều ok thì update lại thông tin user để verify account
    const updateData = {
      isActive: true,
      verifyToken: null // Xóa token đi
    }
    // Cập nhật lại thông tin user trong DB
    const updatedUser = await userModel.update(existUser._id, updateData)

    return pickUser(updatedUser)
  } catch (error) { throw error }
}
const login = async (reqBody) => {
  try {
    //Query thông tin user trong DB
    const existUser = await userModel.findOneByEmail(reqBody.email)
    // Các bước kiểm tra cần thiết
    if (!existUser) { throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!') }
    if (!existUser.isActive) { throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Account is not active!') }
    if (!bcryptjs.compareSync(reqBody.password, existUser.password)) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Email or Password is not correct!')
    }

    // Nếu mọi thứ đều ok thì bắt đầu tạo Tokens đăng nhập để trả về cho phía FE
    // Tạo thông tin để đính kèm trong JWT Token bao gồm _id và email của user
    const userInfo = { _id: existUser._id, email: existUser.email }

    // Tạo ra 2 loại token: accessToken và refreshToken để trả về cho phía FE
    const accessToken = await JwtProvider.generateToken(userInfo, env.ACCESS_TOKEN_SECRET_SIGNATURE,
      //5 //5 giây
      env.ACCESS_TOKEN_LIFE

    )
    const refreshToken = await JwtProvider.generateToken(userInfo, env.REFRESH_TOKEN_SECRET_SIGNATURE, env.REFRESH_TOKEN_LIFE)

    // Trả về thông tin của user kèm theo 2 cái token vừa tạo
    return { accessToken, refreshToken, ...pickUser(existUser) }
  } catch (error) { throw error }
}

const refreshToken = async (clientRefreshToken) => {
  try {
    // Verify/ giải mã refreshToken xem có hợp lệ không
    const refreshTokenDecoded = await JwtProvider.verifyToken(clientRefreshToken, env.REFRESH_TOKEN_SECRET_SIGNATURE)

    console.log('refreshTokenDecoded', refreshTokenDecoded)
    const userInfo = { _id: refreshTokenDecoded._id, email: refreshTokenDecoded.email }

    // Tạo accessToken mới
    const accessToken = await JwtProvider.generateToken(userInfo, env.ACCESS_TOKEN_SECRET_SIGNATURE, env.ACCESS_TOKEN_LIFE)

    return { accessToken}
  } catch (error) { throw error }
}

export const userService = {
  createNew,
  verifyAccount,
  login,
  refreshToken
}