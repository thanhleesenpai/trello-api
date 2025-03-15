/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'

const createNew = async (reqBody) => {
  try {
    // Xử lí logic dữ liệu tùy đặc thù dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    // Gọi tới tầng model để xử lí lưu bản ghi newBoard vào trong Database
    // ...

    // Làm thêm các xử lí logic khác với các collection khác tùy đặc thù dự án...
    // Bắn email, notification về cho admin khi có một cái board mới được tạo...

    // Trả kết quả về trong Service(luôn phải có return)
    return newBoard
  } catch (error) { throw error }
}

export const boardService = {
  createNew
}