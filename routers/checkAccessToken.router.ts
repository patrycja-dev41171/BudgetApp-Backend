// import { Router } from "express";
// import { LoginRecord } from "../records/login.record";
// import jwt from "jsonwebtoken";
// import { ValidationError } from "../utils/error";
// import { LoggedIn } from "../types";
//
// export const checkAccessTokenRouter = Router().get("/", async (req, res) => {
//   const authHeader = req.headers["authorization"];
//
//   const accessToken = authHeader && authHeader.split(" ")[1];
//   const refreshToken: string = req.cookies.refreshToken;
//
//   if (!accessToken || !refreshToken) {
//     console.log("Użytkownik niezalogowany, brak jakiegoś tokena");
//     const result = await LoginRecord.getOneByToken(refreshToken);
//     if (result !== null) {
//       console.log("usunięcie danych logowania z bazy");
//       await LoginRecord.deleteOneByToken(refreshToken);
//     }
//     res.clearCookie("refreshToken");
//     res.json({
//       loggedIn: false,
//     } as LoggedIn);
//   } else {
//     console.log("weryfikacja tokenu access");
//     jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY, (err, decoded) => {
//       if (err) {
//         throw new ValidationError("Nieprawidłowy token. Błąd w weryfikacji");
//       }
//       console.log("Użytkownik zalogowanyy i autoryzowny, ma dostęp");
//       res.json({
//         loggedIn: true,
//       } as LoggedIn);
//     });
//   }
// });
