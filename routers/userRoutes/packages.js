
const express = require("express");
const packageRouter = express.Router();
const Packages = require("../../model/admin/packages")

packageRouter.get('/', async (req, res) => {
    try {
        const packages= await Packages.find();
        console.log('Packages data:', packages);
        res.status(500).json({packages});
    } catch (err) {
        console.log("Error getting packages",err.message);
        res.status(400).json({ error: `Package fetching error: ${err.message}` });
    }
});

module.exports =packageRouter;