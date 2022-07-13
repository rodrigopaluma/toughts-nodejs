const Tought = require('../models/Tought');
const User = require('../models/User');


module.exports = class ToughtController {
    static async showToughts(req, res) {
        res.render('toughts/home')
    }

    static async dashboard(req, res) {
        /* const user = await User.findByPk(req.session.userid);
        const toughts = await Tought.findAll({ where: { userId: req.session.userid } }); */
        res.render('toughts/dashboard');
    }
}