import { PiEnvironment } from "@projectit/core";
import { IServerCommunication } from "./server/IServerCommunication";
import { ServerCommunication } from "./server/ServerCommunication";

/**
 * The one and only reference to the actual language for which this editor runs
 */
import { MyLanguageEnvironment } from "../picode/environment/gen/MyLanguageEnvironment";
export const editorEnvironment: PiEnvironment = MyLanguageEnvironment.getInstance();

/**
 * The one and only reference to the server on which the models are stored
 */
export const serverCommunication: IServerCommunication = ServerCommunication.getInstance();
