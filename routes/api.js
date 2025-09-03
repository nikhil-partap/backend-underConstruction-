import express from 'express';

const router = express.Router();

// get a list of ninjas from the database 
router.get('/ninjas', async (req, res, next) => {
    try {
        // below is to identify what type of request user made 
        console.log("Get on /ninjas called")
        res.status(200).json({ type: "GET", data: ["ninja123"], meta: { timestamp: new Date().toISOString() } });
    } catch (error) {
        next(error);
    }
})

// add a new ninja to db
router.post('/ninjas', async (req, res, next) => {
    try {
        // below is to identify what type of request user made 
        console.log('Post /ninja called')
        console.log(req.body)
        res.status(201).json({ type: "POST", data: { name: req.body.name, rank: req.body.rank }, meta: { timestamp: new Date().toISOString() } })
    } catch (error) {
        next(error)
    }
})

// update a ninja in the db
router.put('/ninjas/:id', async (req, res, next) => {
    try {
        // below is to identify what type of request user made 
        console.log('Put /ninja/:id called')
        res.status(200).json({ type: "PUT", data: [avalability = true] })
    } catch (error) {
        next(error)
    }
})

// delete a ninja from the db
router.delete('/ninjas/:id', async (req, res, next) => {
    try {
        // below is to identify what type of request user made 
        console.log("Delete /ninja/:id called")
        res.status(204).json({ type: 'DELETE', data: ["user123"] })
    } catch (error) {
        next(error)
    }
})

// router.delete('/ninjas', async (req, res, next) => {
//     try {
//         // below is to identify what type of request user made 
//         console.log("Delete ALL /ninja called")
//         res.status(200).json({ type: 'DELETE', action: "delete all of /ninjas", data: ["user123"] })     // i have used the 200 html code insted of 204 because i cant recieve responce/data with the 204 code it is only for success not to return after success  
//     } catch (error) {
//         next(error)
//     }
// })




export default router;