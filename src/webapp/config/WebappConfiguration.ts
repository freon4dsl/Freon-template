import type { FreEnvironment } from "@freon4dsl/core";
import { LanguageInitializer } from "../language/LanguageInitializer";
import type { IServerCommunication } from "../server/IServerCommunication";
// import { ServerCommunication } from "../server/ServerCommunication";
import { IndexedDBCommunication } from "../server/IndexedDBCommunication";

/**
 * The one and only reference to the actual language for which this editor runs
 */
import { MyLanguageEnvironment } from "../../frecode/config/gen/MyLanguageEnvironment";
export const editorEnvironment: FreEnvironment = MyLanguageEnvironment.getInstance();
LanguageInitializer.initialize();

/**
 * The one and only reference to the server on which the models are stored
 */
// export const serverCommunication: IServerCommunication = ServerCommunication.getInstance();
export const serverCommunication: IServerCommunication = IndexedDBCommunication.getInstance();

