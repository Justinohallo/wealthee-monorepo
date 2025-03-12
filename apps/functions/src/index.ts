import * as snapTradeFunctions from "./snaptrade";
import * as clientFunctions from "./users/clients";
import * as portfolioManagerFunctions from "./users/portfolioManager";
import * as adminFunctions from "./users/admin";

export const client = clientFunctions;
export const snaptrade = snapTradeFunctions;
export const portfolioManager = portfolioManagerFunctions;
export const admin = adminFunctions;

