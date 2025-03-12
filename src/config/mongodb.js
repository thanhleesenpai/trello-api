/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

// thanhleesenpai
//uOlGkwX79D3oVD2X

const MONGODB_URI = 'mongodb+srv://thanhleesenpai:uOlGkwX79D3oVD2X@cluster0-thanhlee.ibb2t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0-Thanhlee'

const DATABASE_NAME = 'trello-thanhlee-mern-stack'

import { MongoClient, ServerApiVersion } from 'mongodb'

let trelloDatabaseInstance = null

// Khởi tạo một đối tượng MongoClientInstance để connect tới MongoDB
const mongoClientInstance = new MongoClient(MONGODB_URI, {
  //Lưu í cái server API có từ phiên bản MongoDB 5.0.0 trở lên, có thể không cần dùng nó, còn nếu dùng nó là chúng ta sẽ chỉ định một Stable API Vesion của MongoDB
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  // Gọi kết nối tới MongoDB Atlas với URI đã khai báo trong thân của MongoClientInstance
  await mongoClientInstance.connect()

  // Kết nối thành công thì lấy ra Database theo tên và gán ngược nó lại vào biến trelloDatabaseInstance ở trên của chúng ta
  trelloDatabaseInstance = mongoClientInstance.db(DATABASE_NAME)
}

// Đóng kết nối tới Database khi cần
export const CLOSE_DB = async () => {
  console.log('code')
  await mongoClientInstance.close()

}

// Function GET_DB (không async) này có nhiệm vụ ẽport ra cái Trello Database instance sau khi đã connect thành công tới MongoDB để chúng ta sử dụng ở nhiều nơi khác nhau trong code.
// Lưu ý phải đảm bảo chỉ luôn gọi cái GET_DB này sau khi đã kết nối thành công tới MongoDB
export const GET_DB =() => {
  if (!trelloDatabaseInstance) throw new Error('Must connect to Database first!')
  return trelloDatabaseInstance
}
