import nodemailer from 'nodemailer'

console.log('GMAIL_EMAIL:', process.env.GMAIL_EMAIL)
console.log('GMAIL_PASSWORD:', process.env.GMAIL_PASSWORD ? '***set***' : 'undefined')

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user:process.env.GMAIL_EMAIL,
        pass:process.env.GMAIL_PASSWORD
    }
})

transporter.verify()
   .then(()=>{console.log("email transporter is ready to send emails");})
   .catch((err)=>{console.error("email tranporter verification failed:",err)})

export async function   sendEmail({to,subject,html,text}){
    const mailOption= {
        from:process.env.GMAIL_EMAIL,
        to,
        subject,
        html,
        text
    }

    const details = await transporter.sendMail(mailOption);
    console.log('Email sent:',details)
}