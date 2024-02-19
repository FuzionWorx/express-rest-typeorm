import { Router } from "express";
  import { UserController } from "../controllers/UserController";
  import { checkJwt } from "../middlewares/checkJwt";
  import { checkRole } from "../middlewares/checkRole";

  const router = Router();

  //Get all users
  // router.get("/", [checkJwt, checkRole(["ADMIN"])], UserController.listAll);
  router.get("/", UserController.listAll);

  // Get one user
  // router.get("/:id([0-9]+)", [checkJwt, checkRole(["ADMIN"])], UserController.getOneById);
  router.get("/:id([0-9]+)", UserController.getOneById);

  //Create a new user
  // router.post("/", [checkJwt, checkRole(["ADMIN"])], UserController.newUser);
  router.post("/", UserController.newUser);

  //Edit one user
  // router.patch("/:id([0-9]+)", [checkJwt, checkRole(["ADMIN"])], UserController.editUser);
  router.patch("/:id([0-9]+)", UserController.editUser);

  //Delete one user
  // router.delete("/:id([0-9]+)", [checkJwt, checkRole(["ADMIN"])], UserController.deleteUser);
  router.delete("/:id([0-9]+)", UserController.deleteUser);

  export default router;