const express = require('express');
const router = express.Router();
const cors = require('cors');
const user = require('../Schema/Users');
const Story = require('../Schema/Story');
const auth = require('bcryptjs');
const dotenv = require('dotenv').config();
const JWT = require('jsonwebtoken');
const cookie = require('cookie-parser');
const jwtoken = process.env.TOKEN;
const axios = require('axios');
const axiosRetry = require('axios-retry');

const API_KEY = process.env.APIKEY;




router.use(cookie());
router.use(cors({
    origin: 'http://127.0.0.1:5173',
    methods: ['POST', 'PUT', 'GET', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
    credentials: true
}));







//-------------------------------------------add story-------------------------------------------------------------//


router.post('/addstory', async (req, res) => {
    const { story } = req.body


    try {

        const getcookie = await req.cookies.signintoken
        if (!getcookie) {
            return res.status(400).send("you are logged out")
        }
        const check = await JWT.verify(getcookie, jwtoken)
        if (!check) {
            return res.send("you are logged out")
        }
        else {
            
            const find = await user.findById(check)

            const newstory = await new Story({
                userId: check,
                body: story,
                username: find.name,
                upVote: [],
                
            })


            newstory.save().then(() => {



                return res.send(newstory)

            }).catch((e) => {
                return res.send(e)

            })

        }




    } catch (error) {

        console.log(error)


    }



})

// --------------------------------------get all story--------------------------------------------------------//
router.get('/getstories', async (req, res) => {
    try {
        const getcookie = await req.cookies.signintoken
        if (!getcookie) {
            return res.status(400).send("you are logged out")
        }
        const check = await JWT.verify(getcookie, jwtoken)
        if (!check) {
            return res.send("you are logged out")
        }
        else {
            const stotylist = await Story.find({}).sort({ upVote: -1 });
            return res.send(stotylist);

        }

    } catch (error) {
        console.log(error)


    }
})





// --------------------------------------------upvote---------------------------------------------- //

router.patch('/addvote/:id', async (req, res) => {

    const getcookie = await req.cookies.signintoken
    if (!getcookie) {

        return res.status(400).send("Logged out")
    }

    const check = await JWT.verify(getcookie, jwtoken)
    if (!check) {
        return res.send("you are logged out")
    }
    else {
        const updatedStory = await Story.findByIdAndUpdate(
            req.params.id,
            { $push: { upVote: check } },
            { new: true }
        );

        if (!updatedStory) {
            return res.status(400).send('Error')
        }
        return res.send('added')

    }


})


// -------------------------------------------reducevote------------------------------------------------- //

router.patch('/reducevote/:id', async (req, res) => {
    const getcookie = await req.cookies.signintoken
    if (!getcookie) {

        return res.status(400).send("Logged out")
    }

    const check = await JWT.verify(getcookie, jwtoken)
    if (!check) {
        return res.send("you are logged out")
    }
    else {
        const updatedStory = await Story.findByIdAndUpdate(
            req.params.id,
            { $pull: { upVote: check } },
            { new: true }
        );

        if (!updatedStory) {
            return res.status(400).send('Error')
        }
        return res.send('Removed')

    }


})


























module.exports = router;