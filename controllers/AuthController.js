const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = class AuthController {

    static login(req,res) {
        res.render('auth/login');
    }

    static register(req,res) {
        res.render('auth/register');
    }

    static async registerPost(req,res) {
        const { name, email, password, confirmpassword } = req.body;
        // Password match validation
        if(password != confirmpassword) {
            req.flash('message','As senhas não conferem, tente novamente.');
            res.render('auth/register');

            return;
        }

        // Check if email already exists
        const checkIfUserExist = await User.findOne({ where: {email: email} });
        if(checkIfUserExist) {
            req.flash('message','E-mail já cadastrado.');
            res.render('auth/register');

            return;
        }

        // Create a Password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        
        const user = {
            name,
            email,
            password: hashedPassword
        };
        try {
            const createdUser = await User.create(user);
            // Inicialização da sessão
            req.session.userid = createdUser.id;
            req.flash('message','Usuário cadastrado com sucesso!');
            req.session.save(() => {
                res.redirect('/');
            });
        } catch (error) {
            console.log(error);
        }
    }

    static logout(req,res) {
        req.session.destroy();
        res.redirect('/login');
    }

    static async loginPost(req,res) {
        const { email, password } = req.body;
        // Check if email exists
        const user = await User.findOne({ where: {email: email} });
        if(!user) {
            req.flash('message','Este usuário não foi cadastrado.');
            res.render('auth/login');
            return;
        }

        // Check if password is correct
        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if(!isPasswordCorrect) {
            req.flash('message','Senha incorreta.');
            res.render('auth/login');
            return;
        }

        // Inicialização da sessão
        req.session.userid = user.id;
        req.flash('message',`Seja bem-vindo(a) ${user.name}!`);
        req.session.save(() => {
            res.redirect('/toughts/dashboard');
        });
    }
}