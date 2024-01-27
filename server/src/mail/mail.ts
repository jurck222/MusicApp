import EmailVerificationToken from '#/models/emailVerificationToken';
import nodemailer from 'nodemailer';
import { MAILTRAP_PASS, MAILTRAP_USER, SIGN_IN_URL, VERIFICATION_EMAIL } from "#/utils/variables";
import { generateToken } from "#/utils/helper";
import { generateTemplate } from "#/mail/template";
import path from 'path';
import User from '#/models/user';
import { CreateUser } from "#/@types/user";
const generateMailTransporter = () => {
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: MAILTRAP_USER,
          pass: MAILTRAP_PASS
        }
      });
    return transport;
}

interface Profile{
    name: string;
    email: string;
    userId: string;
}

interface Options{
    email: string;
    link: string;
}

export const sendVerificationMail = async (token: string, profile: Profile) => {
    const transport = generateMailTransporter();
    const {name, email, userId} = profile;
    
    const welcomeMessage = `Hi ${name}, welcome! There are so many things that we do for verified users. use the given OTP to verify your email.`;
    transport.sendMail({
        to: email,
        from: VERIFICATION_EMAIL,
        subject: "Welcome",
        html: generateTemplate({
        title: "Welcome",
        message: welcomeMessage,
        logo: "cid:logo",
        banner: "cid:welcome",
        link: "#",
        btnTitle: token
        }),
        attachments: [
        {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/attachments/logo.png"),
        cid: "logo"
        },
        {
        filename: "welcome.png",
        path: path.join(__dirname, "../mail/attachments/welcome.png"),
        cid: "welcome"
        }
    ]
    });
}
export const sendForgetPasswordLink =async (options: Options) => {
    const transport = generateMailTransporter();
    const {email, link} = options;
    
    const message = `We received a request for passowrd reset. Please follow the link bellow to change your password`;
    transport.sendMail({
        to: email,
        from: VERIFICATION_EMAIL,
        subject: "Reset passowrd link",
        html: generateTemplate({
        title: "Forget passowrd",
        message,
        logo: "cid:logo",
        banner: "cid:forget_password",
        link,
        btnTitle: "Reset password"
        }),
        attachments: [
        {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/attachments/logo.png"),
        cid: "logo"
        },
        {
        filename: "forget_password.png",
        path: path.join(__dirname, "../mail/attachments/forget_password.png"),
        cid: "forget_password"
        }
    ]
    });
};
export const sendPassResetSuccessEmail = async (name: string, email: string ) => {
    const transport = generateMailTransporter();
    
    const message = `Your password was successfully updated`;
    transport.sendMail({
        to: email,
        from: VERIFICATION_EMAIL,
        subject: "Password reset successfull",
        html: generateTemplate({
        title: "Password reset successfull",
        message,
        logo: "cid:logo",
        banner: "cid:forget_password",
        link : SIGN_IN_URL,
        btnTitle: "Log in"
        }),
        attachments: [
        {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/attachments/logo.png"),
        cid: "logo"
        },
        {
        filename: "forget_password.png",
        path: path.join(__dirname, "../mail/attachments/forget_password.png"),
        cid: "forget_password"
        }
    ]
    });
};