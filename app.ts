import Express, {Request, Response} from "express";

// const express: Express = require('express')
const app: Express.Application = Express()
const port: number = 3000

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
