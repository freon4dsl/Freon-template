import { FreLogger } from "@freon4dsl/core";

const LOGGER = new FreLogger("IndexedDBPersistence"); // .mute();


export type ModelUnitDTO = {
    modelName: string;
    unitName: string;
    unit: object;
    unitInterface: object;
}
// TODO  separate persistence of model unit's contents from its interface, so we can load the interface separately


// identifier strings re: IndexedDB:
const modelUnits = "modelUnits";
const modelNameKey = "modelName";
const unitNameKey = "unitName";


/**
 * @return the unique members of the provided arrays, using its canonical notion of equality.
 */
const unique = <T>(ts: T[]): T[] =>
    [...new Set(ts)];


/**
 * Provides model unit persistence using the {@link https://w3c.github.io/IndexedDB/ IndexedDB API} for offline apps.
 */
export class IndexedDBPersistence {

    private database: IDBDatabase;

    private async getDatabase(): Promise<IDBDatabase> {

        if (!("indexedDB" in window)) {
            throw new Error("This browser doesn't support IndexedDB.");
        }

        if (this.database) {
            return Promise.resolve(this.database);
        }

        return new Promise((resolve, reject) => {

            const openRequest = indexedDB.open("Freon-models", 1);

            openRequest.onupgradeneeded = (event) => {
                const db = openRequest.result
                LOGGER.log(`Opening IndexedDB database with version ${event.oldVersion} (expecting ${event.newVersion}).`);
                switch (event.oldVersion) {
                    case 0: {
                        db.createObjectStore(modelUnits, { keyPath: [modelNameKey, unitNameKey] });
                        LOGGER.log("Initialized IndexedDB database.");
                        break;
                    }
                    default: {
                        const message = `Can't handle migration from version ${event.oldVersion}.`;
                        LOGGER.error(message);
                        reject(message);
                    }
                }
            }

            openRequest.onerror = () => {
                LOGGER.error("Couldn't connect to IndexedDB database.");
                reject(openRequest.error);
            }

            openRequest.onsuccess = () => {
                const db = openRequest.result;
                this.database = db;
                resolve(db);
                LOGGER.log("Connection to IndexedDB database established.");
                db.onversionchange = function () {
                    db.close();
                    reject("IndexedDB database is outdated - please reload the page.");
                };
            }

            openRequest.onblocked = () => {
                reject("Another running instance of this app is outdated, and must either be closed or updated (reloaded) for this instance to proceed.");
            }

        })

    }

    private async doOnDb(methodName: keyof IDBObjectStore, doesWrites: boolean, ...args: unknown[]) {
        const db = await this.getDatabase();
        const store = db
            .transaction(modelUnits, doesWrites ? "readwrite" : "readonly")
            .objectStore(modelUnits);
        if (typeof store[methodName] !== "function") {
            return Promise.reject(`${methodName} is not a method on IDBObjectStore`);
        }
        return new Promise((resolve, reject) => {
            const request = (store[methodName] as Function)(...args);
            request.onsuccess = () => {
                resolve(request.result);
            }
            request.onerror = () => {
                reject(request.error);
            }
        })
    }


    async getModelNames(): Promise<string[]> {
        return unique(
            (await this.doOnDb("getAllKeys", false) as string[][])
                .map((key) => key[0])
        );
    }

    async getUnitNames(modelName: string): Promise<string[]> {
        return unique(
            (await this.doOnDb("getAll", false) as ModelUnitDTO[])
                .filter((modelUnit) => modelUnit.modelName === modelName)
                .map((modelUnit) => modelUnit.unitName)
        );
    }

    async putModelUnit(modelUnitDTO: ModelUnitDTO) {
        await this.doOnDb("put", true, modelUnitDTO);
    }

    async deleteModelUnit(modelName: string, unitName: string) {
        await this.doOnDb("delete", true, [modelName, unitName]);
    }

    async deleteModel(modelName: string) {
        const unitNames = await this.getUnitNames(modelName);
        await unitNames.forEach((unitName) => this.deleteModelUnit(modelName, unitName));
    }

    async getModelUnitContents(modelName: string, unitName: string) {
        return (await this.doOnDb("get", false, [modelName, unitName]) as ModelUnitDTO).unit;
    }

    async getModelUnitInterface(modelName: string, unitName: string) {
        return (await this.doOnDb("get", false, [modelName, unitName]) as ModelUnitDTO).unitInterface;
    }

}
