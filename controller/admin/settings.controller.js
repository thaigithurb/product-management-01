const SettingsGeneral = require("../../models/settings-general");
const systemConfig = require("../../config/system");

//[GET] /admin/settings/general
module.exports.general = async (req, res) => {

    const settingsGeneral = await SettingsGeneral.findOne({});

    res.render("admin/pages/settings/general.pug", {
        pageTitle: "Cài đặt chung",
        settingsGeneral: settingsGeneral,
    })
}

//[PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) => {

    const settingsGeneral = await SettingsGeneral.findOne({});

    if (settingsGeneral) {
        await SettingsGeneral.updateOne({
            _id: settingsGeneral.id
        }, req.body);
    } else {
        const record = new SettingsGeneral(req.body);
        await record.save();
    }



    res.redirect(`${systemConfig.prefixAdmin}/settings/general`);
}