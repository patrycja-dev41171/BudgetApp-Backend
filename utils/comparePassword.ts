import { compareSync } from "bcrypt";

export function comparePassword(password: string, hash: string): boolean {
  return compareSync(password, hash);
}
