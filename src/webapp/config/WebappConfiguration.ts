import type { FreEnvironment, IServerCommunication } from "@freon4dsl/core";
import { LanguageInitializer } from "../language/LanguageInitializer";
import { ServerCommunication } from "@freon4dsl/core";

/**
 * The one and only reference to the actual language for which this editor runs
 */
import { MyModelEnvironment } from "../../picode/config/gen/MyModelEnvironment";
export const editorEnvironment: FreEnvironment = MyModelEnvironment.getInstance();
LanguageInitializer.initialize();

/**
 * The one and only reference to the server on which the models are stored
 */
export const serverCommunication: IServerCommunication = ServerCommunication.getInstance();
// export const serverCommunication: IServerCommunication = MpsServerCommunication.getInstance();
