import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface ReqProps extends Request {
  userId: string;
}
const auth = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    const isNotGoogleAuth = token!.length < 500;

    let decodedData;

    if (token && isNotGoogleAuth) {
      decodedData = jwt.verify(token, "test") as any;

      req.userId = decodedData?.id;
    } else if (token) {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub;
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
