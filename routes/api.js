import express from 'express';

const router = express.Router();

// get a list of ninjas from the database 
router.get('/ninjas', async (req, res, next) => {
    try {
        // below is to identify what type of request user made 
        console.log("Get on /ninjas called")
        res.status(200).json({ type: "GET", data: ["ninja123"] });
    } catch (error) {
        next(error);
    }
})

// add a new ninja to db
router.post('/ninjas', async (req, res, next) => {
    try {
        // below is to identify what type of request user made 
        console.log('Post /ninja called')
        res.status(201).json({ tyoe: "POST", data: [added_ninja123] })
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
router.delete('/ninjas/:id', async (req, res) => {
    try {
        // below is to identify what type of request user made 
        console.log("Delete /ninja/:id called")
        res.status(204).json({ type: 'DELETE', data: [user123] })
    } catch (error) {
        next(error)
    }
})

1


export default router;