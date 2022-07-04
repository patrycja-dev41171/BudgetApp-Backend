import { genSaltSync, hashSync } from "bcrypt";

export function cipher(data: string): string {
  const salt = genSaltSync(10);
  const hashData = hashSync(data, salt);
  return hashData;
}
