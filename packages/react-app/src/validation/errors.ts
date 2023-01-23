import { ValidationError } from "../seaport";

export const UNSUPPORTED_METHOD_ERROR = { error: "UnsupportedMethod" };
export const INTERNAL_SERVER_ERROR = { error: "InternalServerError" };
export const UNAUTHORIZED_ERROR = { error: "Unauthorized" };
export const ILLEGAL_ARGUMENT_ERROR = (message: string) => ({ error: "IllegalArgumentError", message });

export const ORDER_HASHING_ERROR_MESSAGE = (error: ValidationError, orderHash?: string) => {
  switch (error) {
    case ValidationError.WRONG_ORDER_SIGNATURE:
      return `Order signature is invalid for order ${orderHash}`;
    case ValidationError.SIGNER_MISMATCH:
      return `Order signers do not match for order ${orderHash}`;
    case ValidationError.SALT_MISSING:
      return `Mandatory salt is missing for order ${orderHash}`;
    default:
      return "Unknown Error";
  }
};
