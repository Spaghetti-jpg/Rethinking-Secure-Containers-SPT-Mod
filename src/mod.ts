import { DependencyContainer } from "@spt/models/external/tsyringe";
import { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { StaticRouterModService } from "@spt/services/mod/staticRouter/StaticRouterModService";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ProfileHelper } from "@spt/helpers/ProfileHelper";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import * as config from "../config/config.json";

class RethinkingSecureContainersMod implements IPreSptLoadMod, IPostDBLoadMod {
    private logger: ILogger;
    private waistPouchId = "5732ee6a24597719ae0c0281";
    private alphaContainerId = "544a11ac4bdc2d470e8b456a";
    private gammaContainerId = "5857a8bc2459772bad15db29";

    preSptLoad(container: DependencyContainer): void {
        const staticRMS = container.resolve<StaticRouterModService>("StaticRouterModService");
        const profileHelper = container.resolve<ProfileHelper>("ProfileHelper");
        this.logger = container.resolve<ILogger>("WinstonLogger");

        staticRMS.registerStaticRouter(
            "RethinkingSecureContainersMod_ProfileCreate",
            [
                {
                    url: "/client/game/profile/create",
                    action: async (url, info, sessionID, output) => this.profileAction(profileHelper, sessionID, output, "profile creation")
                }
            ],
            "aki"
        );

        staticRMS.registerStaticRouter(
            "RethinkingSecureContainersMod_GameStart",
            [
                {
                    url: "/client/game/start",
                    action: async (url, info, sessionID, output) => this.profileAction(profileHelper, sessionID, output, "game start")
                }
            ],
            "aki"
        );

    }

    postDBLoad(container: DependencyContainer): void {
        this.logger = container.resolve<ILogger>("WinstonLogger");
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const tables: IDatabaseTables = databaseServer.getTables();

        this.updateWaistPouchSize(tables); 
        this.addWaistPouchToTrader(tables);
        this.updateAlphaContainerBarter(tables);
        this.updateBetaContainerBarter(tables);
        this.addGammaContainerToTrader(tables);
    }

    private logMessage(message: string, color: LogTextColor = LogTextColor.GREEN) {
        this.logger.logWithColor(`[Rethinking Secure Containers Mod] ${message}`, color);
    }

    private async profileAction(profileHelper: ProfileHelper, sessionID: any, output: any, actionName: string): Promise<any> {
        try {
            const pmcProfile = profileHelper.getPmcProfile(sessionID);
            this.removeContainersIfExists(pmcProfile, actionName);
        } catch (error) {
            this.logMessage(`Error during ${actionName}: ${error.message}`, LogTextColor.RED);
        }
        return output;
    }

    private removeContainersIfExists(pmcProfile: any, actionName: string) {
        if (!pmcProfile || !pmcProfile.Encyclopedia) {
            this.logMessage(`PMC Profile or Encyclopedia not available. Skipping container replacement.`, LogTextColor.YELLOW);
            return;
        }

        if (!config.Waist_Pouch.ReplaceSecureContainerWithWaistPouch) return;

        if (!pmcProfile.Encyclopedia[this.waistPouchId]) {
            const containerNames: { [key: string]: string } = {
                "544a11ac4bdc2d470e8b456a": "Secure container Alpha",
                "5857a8b324597729ab0a0e7d": "Secure container Beta",
                "5857a8bc2459772bad15db29": "Secure container Gamma",
                "665ee77ccf2d642e98220bca": "Secure container Gamma Unheard edition"
            };

            Object.keys(containerNames).forEach(containerId => {
                const foundContainerIndex = pmcProfile.Inventory.items.findIndex((item: any) =>
                    item.slotId === "SecuredContainer" && item._tpl === containerId
                );

                if (foundContainerIndex !== -1) {
                    pmcProfile.Inventory.items.splice(foundContainerIndex, 1);
                    this.logMessage(`${containerNames[containerId]} removed.`);
                }
            });

            pmcProfile.Encyclopedia[this.waistPouchId] = true;
            this.logMessage("Waist pouch marked as learned in Encyclopedia.");
        } else {
            this.logMessage("Waist pouch is already learned, skipping removal of containers.");
        }
    }

    private updateWaistPouchSize(tables: IDatabaseTables): void {
        const waistPouch = tables.templates.items[this.waistPouchId];
        if (!waistPouch) {
            this.logMessage("Waist pouch not found in database.", LogTextColor.RED);
            return;
        }

        waistPouch._props.Height = config.Waist_Pouch.WaistPouch_Height;
        waistPouch._props.Width = config.Waist_Pouch.WaistPouch_Width;
        waistPouch._props.sizeHeight = config.Waist_Pouch.WaistPouch_sizeHeight;
        waistPouch._props.sizeWidth = config.Waist_Pouch.WaistPouch_sizeWidth;

        waistPouch._props.Grids[0]._props.cellsH = config.Waist_Pouch.WaistPouch_cellsH;
        waistPouch._props.Grids[0]._props.cellsV = config.Waist_Pouch.WaistPouch_cellsV;

        this.logMessage(
            "Waist pouch size updated",
            LogTextColor.GREEN
        );
    }

    private addWaistPouchToTrader(tables: IDatabaseTables): void {
        if (!config.Waist_Pouch.AvailableToTrader) {
            this.logMessage("Waist Pouch is not set to be available to trader.", LogTextColor.YELLOW);
            return;
        }

        const traderId = "5ac3b934156ae10c4430e83c"; // ID Ragman
        const trader = tables.traders[traderId];

        if (!trader) {
            this.logMessage("Trader Ragman not found in database.", LogTextColor.RED);
            return;
        }

        trader.assort.items.push({
            "_id": "Hacker_waistPouchAssort",
            "_tpl": this.waistPouchId,
            "parentId": "hideout",
            "slotId": "hideout",
            "upd": {
                "UnlimitedCount": true,
                "StackObjectsCount": 9999999,
                "BuyRestrictionMax": 1,
                "BuyRestrictionCurrent": 0
            }
        });

        trader.assort.barter_scheme["Hacker_waistPouchAssort"] = [[
            { "count": 90000, "_tpl": "5449016a4bdc2d6f028b456f" }
        ]];
        trader.assort.loyal_level_items["Hacker_waistPouchAssort"] = config.Waist_Pouch.LoyaltyLevel;

        this.logMessage("Add: Waist Pouch added by trader Ragman");
    }

    private updateAlphaContainerBarter(tables: IDatabaseTables): void {
        const traderId = "5935c25fb3acc3127c3d8cd9"; // ID Peacekeeper
        const trader = tables.traders[traderId];

        if (!trader) {
            this.logMessage("Trader Peacekeeper not found in database.", LogTextColor.RED);
            return;
        }

        const alphaContainerId = "666aa308e8e00edadd0d15df"; // ID Alpha barter

        if (trader.assort.barter_scheme[alphaContainerId]) {
            trader.assort.barter_scheme[alphaContainerId] = config.Alpha_Container.Barter;

            this.logMessage("Secure container Alpha barter scheme updated successfully.");
        } else {
            this.logMessage("Secure container Alpha not found in Peacekeeper's assortment.", LogTextColor.RED);
        }
    }

    private updateBetaContainerBarter(tables: IDatabaseTables): void {
        const traderId = "5935c25fb3acc3127c3d8cd9"; // ID Peacekeeper
        const trader = tables.traders[traderId];

        if (!trader) {
            this.logMessage("Trader Peacekeeper not found in database.", LogTextColor.RED);
            return;
        }

        const betaContainerId = "666aa308e8e00edadd0d15f2"; // ID Beta barter

        if (trader.assort.barter_scheme[betaContainerId]) {
            trader.assort.barter_scheme[betaContainerId] = config.Beta_Container.Barter;

            this.logMessage("Secure container Beta barter scheme updated successfully.");
        } else {
            this.logMessage("Secure container Beta not found in Peacekeeper's assortment.", LogTextColor.RED);
        }
    }

    private addGammaContainerToTrader(tables: IDatabaseTables): void {
        if (!config.Gamma_Container.AvailableToTrader) {
            this.logMessage("Gamma Container is not set to be available to trader.", LogTextColor.YELLOW);
            return;
        }

        const traderId = "5935c25fb3acc3127c3d8cd9"; // ID Peacekeeper
        const trader = tables.traders[traderId];

        if (!trader) {
            this.logMessage("Trader Peacekeeper not found in database.", LogTextColor.RED);
            return;
        }

        trader.assort.items.push({
            "_id": "Hacker_5857a8bc2459772bad15db29",
            "_tpl": this.gammaContainerId,
            "parentId": "hideout",
            "slotId": "hideout",
            "upd": {
                "UnlimitedCount": true,
                "StackObjectsCount": 9999999,
                "BuyRestrictionMax": 1,
                "BuyRestrictionCurrent": 0
            }
        });

        trader.assort.barter_scheme["Hacker_5857a8bc2459772bad15db29"] = config.Gamma_Container.Barter;

        trader.assort.loyal_level_items["Hacker_5857a8bc2459772bad15db29"] = config.Gamma_Container.LoyaltyLevel;

        this.logMessage("Add: Added Secure container Gamma to trader Peacekeeper");
    }

}

module.exports = { mod: new RethinkingSecureContainersMod() };
