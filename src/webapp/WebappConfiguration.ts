import { PiEnvironment } from "@projectit/core";

/**
 * The one and only reference to the actual language for which this editor runs
 */

import { MyLanguageEnvironment } from "../picode/environment/gen/MyLanguageEnvironment";
export const editorEnvironment: PiEnvironment = MyLanguageEnvironment.getInstance();

/**
 * The one and only reference to the server on which the models are stored
 */
export const SERVER_URL = "http://127.0.0.1:3001/";
