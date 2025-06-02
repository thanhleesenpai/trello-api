/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import { corsOptions } from './config/cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import cookieParser from 'cookie-parser'

const START_SERVER = () => {
  const app = express()
  // Fix Cache from disk của ExpressJS
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  // Cấu hình cookie-parser
  app.use(cookieParser())

  // Xử lý cors
  app.use(cors(corsOptions))

  //enable req.body json data
  app.use(express.json())

  //Use APIs V1
  app.use('/v1', APIs_V1)

  //Middleware xử lí lỗi tập trung
  app.use(errorHandlingMiddleware)

  // Môi trường production (đang support Render.com)
  if (env.BUILD_MODE === 'production') {
    app.listen(process.env.PORT, () => {
      console.log(`3. Production: Hello ${env.AUTHOR}, Backend server is running at Port: ${ process.env.PORT }`)
    })
  } else {
    // Môi trường local dev
    app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      console.log(`3. Hello ${env.AUTHOR}, Backend server is running at Host: ${ env.LOCAL_DEV_APP_HOST } and Port: ${ env.LOCAL_DEV_APP_PORT }`)
    })
  }

  // Thực hiện các tác vụ cleanup trước khi dùng server
  exitHook(() => {
    console.log('4. Server is shutting down')
    CLOSE_DB()
    console.log('5. Disconnected from MongoDB Cloud Atlas')
  })
}

//Chỉ khi kết nối tới Database thành công thì mới Start Server Backend lên
// Immediately-invoked / Anonymous AsyncFunctions (IIFE)
(async () => {
  try {
    console.log('1. Connecting to MongoDB Cloud Atlas...')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB Cloud Atlas!')

    //Khởi động Server Back-end sau khi Connect Database thành công
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()
// //Chỉ khi kết nối tới Database thành công thì mới Start Server Backend lên
// console.log('1. Connecting to MongoDB Cloud Atlas...')
// CONNECT_DB()
//   .then(() => console.log('Connected to MongoDB Cloud Atlas!'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.error(error)
//     process.exit(0)
//   })