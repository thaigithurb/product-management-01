const SettingsGeneral = require("../../models/settings-general");

module.exports.settingsGeneral = async (req, res, next) => {

    const settingsGeneral = await SettingsGeneral.findOne({});

    res.locals.settingsGeneral = settingsGeneral

    next();
}