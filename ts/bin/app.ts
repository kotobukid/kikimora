import Express, {Request, Response} from "express";

const app: Express.Application = Express()
const port: number = 3000

import db from '../models'

app.get('/', (req: Request, res: Response): void => {
    res.send('Hello World!')
})

app.listen(port, (): void => {
    console.log(`Example app listening at http://localhost:${port}`)
})
