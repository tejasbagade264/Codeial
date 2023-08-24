const nodeMailer = require('../config/nodemailer');

exports.newComment= (comment) => {
    console.log('inside newComment mailer');

    nodeMailer.transporter.sendMail({
        from: 'tejasbagade264@gmail.com', // sender address
        to: comment.user.email, // list of receivers
        subject: "New Comment Published ✔", // Subject line
       
        html: "<h1>Hello world?</h1>", // html body


      }, (err, info) => {

        if(err){
            console.log('Error in sending mail',err);
            return;
        }
      });
    }
