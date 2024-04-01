const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
    teams: Number,
    favorites: Number,
    userId: Number,
    createdAt: Date,
}, { timestamps: true });

const Stat = mongoose.model('Stat', statSchema)

const defaultStat = {
    teams: 0,
    favorites: 0,
    userId: ""
}

const getStat = async (userId) => {
    const selectedStat = await Stat.findOne({ userId }, { _id: 0 , teams: 1, favorites: 1})
    if (selectedStat) { return selectedStat }
    else return defaultStat
}

module.exports = { getStat, Stat };