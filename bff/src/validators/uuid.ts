import { validate as uuidValidate } from "uuid";

export function isUUID(id: string): boolean {
  return uuidValidate(id);
}
