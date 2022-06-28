import { Router } from "express";
import { ensureAuthenticated } from "./middlewares/ensureAuthenticated";
import { AuthenticateUserController } from "./useCases/authenticateUser/AuthenticateUserController";
import { CreateUserController } from "./useCases/createUser/CreateUserController";

const router = Router();

const createUserController = new CreateUserController();
const authenticateUserController = new AuthenticateUserController();

router.post("/users", createUserController.handle);
router.post("/login", authenticateUserController.handle);

router.get("/courses", ensureAuthenticated, (request, response) => {
  return response.json([
    { id: 1, name: "NodeJs" },
    { id: 2, name: "ReactJs" },
    { id: 3, name: "VueJs" },
  ]);
});

export { router };
