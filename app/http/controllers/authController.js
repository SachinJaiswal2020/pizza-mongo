const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')
const sgMail = require("@sendgrid/mail");
const API = sgMail.setApiKey(process.env.MAIL_KEY);

function authController() {

    const _getRedirectUrl = (req) =>{
        return req.user.role === 'admin' ? '/admin/orders' : '/customers/orders' 
       }

    return{
        login(req,res) {
            res.render('auth/login')
        },
        postLogin(req, res, next){

            const { email, password } = req.body

            //VALIDATING REQUESTS
            if(!email || !password){
                req.flash('error', 'All fields are required')
                return res.redirect('/login')
            }

            passport.authenticate('local', (err, user,info) =>{
                if(err){
                    req.flash('error', info.message)
                    return next(err)
                }
                if(!user){
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }
                req.logIn(user, (err) =>{
                    if(err){
                        req.flash('error', info.message)
                        return next(err)
                    }
                    
                    return res.redirect(_getRedirectUrl(req))
                })
            })(req, res, next)
        },
         register(req,res) {
            res.render('auth/register')
        },
        async postRegister(req,res){
            const { name, email, password } = req.body

            //VALIDATING REQUESTS
            if(!name || !email || !password){
                req.flash('error', 'All fields are required')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/register')
            }

            User.exists({email: email}, (err, result) =>{
                if(result){
                req.flash('error', 'Email already Exist')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/register')
                }
            })

            //HASHING PASSWORD
            const hashPassword = await bcrypt.hash(password, 10)

            //CREATING USER IN DB
            const user = new User({
                name,
                email,
                password: hashPassword
            })

            const Message = {
              to: ["sachin.jayswal2020@gmail.com", email],
              from: {
                name: "Sachin Jaiswal",
                email: "sachin.jayswal2020@gmail.com",
              },
              subject: "Registration",
              text: `Thank You For Registering ${name} , Let Order Some Pizza`,
              html: `<h3>Thank You For Registering ${name}.</h3>
                        <h3>Let's Order Some Pizza</h3>`,
            };

            user.save().then(() =>{
                sgMail.send(Message);
                return res.redirect('/login')
            }).catch(err =>{
                req.flash('error', 'Something went wrong')
                return res.redirect('/register')
            })

            // console.log(req.body)
        },
        logout(req, res){
            req.logout()
            return res.redirect('/login')
        }
    }
}

module.exports = authController