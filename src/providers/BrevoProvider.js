const SibApiV3Sdk = require('@getbrevo/brevo')
import { env } from '~/config/environment'


let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
let apiKey = apiInstance.authentications['apiKey']
apiKey.apiKey = env.BREVO_API_KEY

const sendEmail = async (recipientEmail, customSubject, customHtmlContent) => {
  // Khởi tạo sendSmtpEmail với các thông tin cần thiết
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

  // Tài khoản gửi email: lưu ý địa chỉ email này phải là địa chỉ email đã được xác thực trong tài khoản Brevo
  sendSmtpEmail.sender = { email: env.ADMIN_EMAIL_ADDRESS, name: env.ADMIN_EMAIL_NAME }

  // Danh sách người nhận email
  // 'to' phải là một array để có thể tùy biến gửi 1 email đến nhiều user
  sendSmtpEmail.to = [{ email: recipientEmail }]

  // Tiêu đề email
  sendSmtpEmail.subject = customSubject

  // Nội dung email dạng html
  sendSmtpEmail.htmlContent = customHtmlContent

  // Gọi hành động gửi email
  // sendTransacEmail của thư viện sẽ trả về một Promise
  return apiInstance.sendTransacEmail(sendSmtpEmail)
}

export const BrevoProvider = {
  sendEmail
}