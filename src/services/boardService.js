/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'

const createNew = async (reqBody) => {
  try {
    // Xử lí logic dữ liệu tùy đặc thù dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    // Gọi tới tầng model để xử lí lưu bản ghi newBoard vào trong Database
    const createdBoard = await boardModel.createNew(newBoard)
    console.log(createdBoard)

    // Lấy bản ghi board sau khi gọi (tùy mục đích dự án mà có cần bước này hay không)
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
    console.log(getNewBoard)

    // Làm thêm các xử lí logic khác với các collection khác tùy đặc thù dự án...
    // Bắn email, notification về cho admin khi có một cái board mới được tạo...

    // Trả kết quả về trong Service(luôn phải có return)
    return getNewBoard
  } catch (error) { throw error }
}

export const boardService = {
  createNew
}