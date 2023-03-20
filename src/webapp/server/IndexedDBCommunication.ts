import {
    FreLogger,
    FreModelSerializer,
    FreNamedNode
} from "@freon4dsl/core";
import type { IServerCommunication } from "./IServerCommunication";
import { setUserMessage } from "../components/stores/UserMessageStore";
import { IndexedDBPersistence } from "./IndexedDBPersistence";

const LOGGER = new FreLogger("IndexedDBCommunication"); // .mute();


/**
 * Implementation of {@link IServerCommunication} that persists using {@link IndexedDBPersistence}.
 * That's useful for implementing offline capabilities.
 */
export class IndexedDBCommunication implements IServerCommunication {

    private static instance: IndexedDBCommunication;

    static serial: FreModelSerializer = new FreModelSerializer();
    private readonly persistence: IndexedDBPersistence = new IndexedDBPersistence();

    static getInstance(): IndexedDBCommunication {
        if (!(!!IndexedDBCommunication.instance)) {
            IndexedDBCommunication.instance = new IndexedDBCommunication();
        }
        return IndexedDBCommunication.instance;
    }

    async putModelUnit(modelName: string, unitName: string, piUnit: FreNamedNode) {
        LOGGER.log(`${this.constructor.name}.putModelUnit ${modelName}/${unitName}`);
        if (!!unitName && unitName.length > 0 && unitName.match(/^[a-z,A-Z][a-z,A-Z0-9_\-]*$/)) {
                // TODO  also validate modelName
            const unit = IndexedDBCommunication.serial.convertToJSON(piUnit);
            const unitInterface = IndexedDBCommunication.serial.convertToJSON(piUnit, true);
            await this.persistence.putModelUnit({ modelName, unitName, unit, unitInterface });
            LOGGER.log(`${this.constructor.name}.putModelUnit ${modelName}/${unitName}: transaction completed.`);
        } else {
            LOGGER.error(`Name of Unit '${unitName}' may contain only characters, numbers, '_', or '-', and must start with a character.`);
        }
    }

    async deleteModelUnit(modelName: string, unitName: string) {
        LOGGER.log(`${this.constructor.name}.deleteModelUnit ${modelName}/${unitName}`);
        await this.persistence.deleteModelUnit(modelName, unitName);
    }

    async deleteModel(modelName: string ) {
        LOGGER.log(`${this.constructor.name}.deleteModel ${modelName}`);
        await this.persistence.deleteModel(modelName);
    }

    async loadModelList(modelListCallback: (names: string[]) => void) {
        LOGGER.log(`${this.constructor.name}.loadModelList`);
        modelListCallback(await this.persistence.getModelNames());
    }

    async loadUnitList(modelName: string, unitListCallback: (names: string[]) => void) {
        LOGGER.log(`${this.constructor.name}.loadUnitList`);
        unitListCallback(await this.persistence.getUnitNames(modelName));
    }

    async loadModelUnit(modelName: string, unitName: string, loadCallback: (piUnit: FreNamedNode) => void) {
        LOGGER.log(`${this.constructor.name}.loadModelUnit ${unitName}`);
        const storedUnitContents = await this.persistence.getModelUnitContents(modelName, unitName);
        try {
            const unit = IndexedDBCommunication.serial.toTypeScriptInstance(storedUnitContents);
            loadCallback(unit);
        } catch (e) {
            LOGGER.error("loadModelUnit, " + e.message);
            setUserMessage(e.message);
            console.log(e.stack);
        }
    }

    async loadModelUnitInterface(modelName: string, unitName: string, loadCallback: (piUnitInterface: FreNamedNode) => void) {
        LOGGER.log(`${this.constructor.name}.loadModelUnitInterface for ${modelName}/${unitName}`);
        const storedModelUnitInterface = await this.persistence.getModelUnitInterface(modelName, unitName);
        try {
            const unitInterface = IndexedDBCommunication.serial.toTypeScriptInstance(storedModelUnitInterface);
            loadCallback(unitInterface);
        } catch (e) {
            LOGGER.error("loadModelUnit, " + e.message);
            setUserMessage(e.message);
            console.log(e.stack);
        }
    }

    async renameModelUnit(modelName: string, oldName: string, newName: string, piUnit: FreNamedNode) {
        LOGGER.log(`${this.constructor.name}.renameModelUnit ${modelName}/${oldName} to ${modelName}/${newName}`);
        // put the unit and its interface under the new name:
        await this.putModelUnit(modelName, newName, piUnit);
        // remove the old unit and interface:
        await this.deleteModelUnit(modelName, oldName);
        // TODO  do both things inside a (one & the same) transaction
    }

}
