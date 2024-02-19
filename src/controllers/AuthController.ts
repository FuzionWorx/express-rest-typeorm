import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { validate } from "class-validator";
import { User } from "../entities/User";
import config from "../config/config";

export class AuthController {

  static async login(req: Request, res: Response) {
    //Check if username and password are set
    let { username, password } = req.body;
    console.log("AuthController.login: username: " + username + " and password: " + password);
    if (!(username && password)) {
      res.status(400).send("AuthController.login: username: " + username + " and password: " + password + " are required");
    } else {
      //Get user from database
      const userRepository = AppDataSource.getRepository(User)
      let user: User;
      try {
        console.log("Attempting AppDataSource.getRepository(User).findOneOrFail()");
        user = await userRepository.findOneOrFail({
          where: {
            username: username
          }
        });

        //Check if encrypted password match
        try {
          console.log("Attempting user.checkIfUnencryptedPasswordIsValid()");
          if (!user.checkIfUnencryptedPasswordIsValid(password)) {
            res.status(401).send("AuthController.login: error checking user password");
            return;
          } else {
            //Sign JWT, valid for 1 hour
            const token = jwt.sign(
              { userId: user.id, username: user.username },
                config.jwtSecret,
              { expiresIn: "1h" }
            );
            //Send the jwt in the response
            res.send(token);
          }
        } catch (error) {
          res.status(401).send("AuthController.login: error checking user password: " + error.message);
        }

      } catch (error) {
        console.log("Caught error: " + error.message);
        res.status(401).send("AuthController.login: error searching for user: " + error.message);
      }
    }
  }

  static async changePassword(req: Request, res: Response) {
    //Get ID from JWT
    const uid = res.locals.jwtPayload.userId;

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    //Get user from the database
    const userRepository = AppDataSource.getRepository(User)
    let user: User;
    try {
      user = await userRepository.findOneOrFail(uid);
    } catch (error) {
      res.status(401).send();
    }

    //Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send();
      return;
    }

    //Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    //Hash the new password and save
    user.hashPassword();
    userRepository.save(user);

    res.status(204).send();
  };
}
