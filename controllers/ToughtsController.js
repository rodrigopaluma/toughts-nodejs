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

    static async createTought(req, res) {
        res.render('toughts/create');
    }

    static async createToughtSave(req, res) {
        const tought = {
            title: req.body.title,
            UserId: req.session.userid
        };
        try {
            await Tought.create(tought);
            req.flash('message', 'Pensamento criado com sucesso!');
            req.session.save(() => {
                res.redirect('/toughts/dashboard');
            })
        } catch (error) {
            console.log(error);
        }
    }
}