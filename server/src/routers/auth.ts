import { CreateUser } from '#/@types/user';
import { validate } from '#/middleware/validator';
import User from '#/models/user';
import { CreateUserSchema, SignInValidationSchema, TokenAndIdValidation, UpdatePasswordSchema } from '#/utils/validationSchema';
import { error } from 'console';
import { create, generateForgetPassowrdLink, grantValid, sendReVerificationToken, signIn, updatePassword, verifyEmail } from '#/controllers/user';
import {Router} from 'express';
import { isValidPassResetToken, mustAuth } from '#/middleware/auth';
import { JWT_SECRET } from '#/utils/variables';
import { JwtPayload, verify } from 'jsonwebtoken';
import formidable from 'formidable';

const router = Router();

router.post("/create", validate(CreateUserSchema), create)
router.post("/verify-email", validate(TokenAndIdValidation), verifyEmail)
router.post("/re-verify-email", sendReVerificationToken);
router.post("/forget-password", generateForgetPassowrdLink);
router.post("/verify-pass-reset-token",validate(TokenAndIdValidation), isValidPassResetToken, grantValid);
router.post('/update-password', validate(UpdatePasswordSchema), isValidPassResetToken, updatePassword);
router.post('/sign-in', validate(SignInValidationSchema), signIn);
router.post('/update-profile', (req, res) => {
    const form = formidable();
    form.parse(req, (err, fields, files) => {
        console.log("fields: ", fields);
        console.log("files: ", files);

        res.json({uploaded: true});
    });
});


router.get('/is-auth', mustAuth, (req, res) => {res.json({profile: req.user})});
router.get('/public', (req, res) => {res.json({message: "You are in public route!"})});
router.get('/private', mustAuth, (req, res) => {res.json({message: "You are in private route!"})});
export default router;