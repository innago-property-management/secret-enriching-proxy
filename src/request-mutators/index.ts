// request-mutators/index.ts

import { addHeader, AddHeaderArg } from "./header/index.ts";
import { modifyBody, ModifyBodyArg} from "./body/index.ts";

export { addHeader, modifyBody };
export type { AddHeaderArg, ModifyBodyArg };
