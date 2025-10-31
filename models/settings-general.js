const mongoose = require('mongoose');

const settinsgGeneralSchema = new mongoose.Schema({
    websiteName: String,
    logo: String,
    phone: String,
    email: String,
    address: String,
    copyright: String,
}, {
    timestamps: true
})

const SettingsGeneral = mongoose.model('SettingsGeneral', settinsgGeneralSchema, "settings-general");

module.exports = SettingsGeneral;