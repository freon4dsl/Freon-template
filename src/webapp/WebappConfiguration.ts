import { PiEnvironment } from "@projectit/core";

/**
 * The one and only reference to the actual language for which this editor runs
 */

import { EntityEnvironment } from "../picode/environment/gen/EntityEnvironment";
export const editorEnvironment: PiEnvironment = EntityEnvironment.getInstance();

/**
 * The one and only reference to the server on which the models are stored
 */
export const SERVER_URL = "http://127.0.0.1:3001/";
