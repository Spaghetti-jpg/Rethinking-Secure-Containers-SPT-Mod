# Rethinking-Secure-Containers-SPT-Mod
It's not supposed to be easy in Tarkov

<p align="center">
  <img src="https://github.com/Spaghetti-jpg/Rethinking-Secure-Containers-SPT-Mod/blob/main/1.png" alt="alt text">
</p>

![alt text](https://github.com/Spaghetti-jpg/Rethinking-Secure-Containers-SPT-Mod/blob/main/3.png)

![alt text](https://github.com/Spaghetti-jpg/Rethinking-Secure-Containers-SPT-Mod/blob/main/2.png)



## [About](#about)

I decided to rethink safe containers, which is why this mod was created. We're used to relying on a magic container that gives us a chance to get some loot from a raid or save our own, but what if you don't have one, at least at first? 

This mod removes the Secure container from your inventory and revises the barter system for obtaining it. At the beginning of the game, you will no longer have access to Secure container Alpha/Beta/Gamma. Your first Secure container will be the “Waist Pod Pod”, which you can purchase at Loyalty Level 1 from Ragman for 90,000 rubles. It has 2x1 slots instead of 2x2 slots

You will need to decide what to put in it before the raid and what loot to put in it during the raid.

## Note: When you run the mod, all loot from your safe container will be removed! If you need it, just put your loot out of it.

### Barter system

- Secure container Alpha can be obtained by barter from Peacekeeper at loyalty level 1 for 1 Waist_Pouch and 35 M67 grenades
- Secure container Beta can be obtained from the Peacekeeper at loyalty level 2 for 2 Secure container Alpha, 3 Iridium, 3 Virtex and 5 Military cables
- Secure container Gamma can be obtained by barter from Peacekeeper on loyalty level 4 for 2 Secure container Beta, 6 Iridium, 6 Virtex and 10 Military cable

You will no longer have to search for and carry tank batteries

## [Installation](#installation)

1. Drag the `user` folder from the zip archive into the SPT installation folder.


## [How to configure](#how-to-configure)
The mod is configured in the `config.json` file, I tried to make the customization of the mod flexible.

`ReplaceSecureContainerWithWaistPouch` - responsible for replacing secure containers with Waist Pouch, has values `true` and `false`. By default `true`
In the `config.json` file, you will be able to customize the trader's loyalty level, the number of items to barter, and the barter items themselves.

## Vanilla `config.json`


```json{
{
    "Waist_Pouch": {
        "ReplaceSecureContainerWithWaistPouch": true,

        "WaistPouch_Height": 2,
        "WaistPouch_Width": 2,
        "WaistPouch_sizeHeight": 1,
        "WaistPouch_sizeWidth": 2,
        "WaistPouch_cellsH": 1,
        "WaistPouch_cellsV": 2,

        "AvailableToTrader": true,
        "LoyaltyLevel": 1,
        "Barter": [
            [
                {
                    "count": 90000,
                    "_tpl": "5449016a4bdc2d6f028b456f"
                }
            ]
        ]
    },
    "Alpha_Container": {
        "AvailableToTrader": true,
        "LoyaltyLevel": 1,
        "Barter": [
            [
                {
                    "count": 1,
                    "_tpl": "5732ee6a24597719ae0c0281"
                },
                {
                    "count": 35,
                    "_tpl": "58d3db5386f77426186285a0"
                }
            ]
        ]
    },
    "Beta_Container": {
        "AvailableToTrader": true,
        "LoyaltyLevel": 2,
        "Barter": [
            [
                {
                    "count": 2,
                    "_tpl": "544a11ac4bdc2d470e8b456a"
                },
                {
                    "count": 3,
                    "_tpl": "5d0377ce86f774186372f689"
                },
                {
                    "count": 3,
                    "_tpl": "5c05308086f7746b2101e90b"
                },
                {
                    "count": 5,
                    "_tpl": "5d0375ff86f774186372f685"
                }
            ]
        ]
    },
    "Gamma_Container": {
        "AvailableToTrader": true,
        "LoyaltyLevel": 4,
        "Barter": [
            [
                {
                    "count": 2,
                    "_tpl": "5857a8b324597729ab0a0e7d"
                },
                {
                    "count": 6,
                    "_tpl": "5d0377ce86f774186372f689"
                },
                {
                    "count": 6,
                    "_tpl": "5c05308086f7746b2101e90b"
                },
                {
                    "count": 10,
                    "_tpl": "5d0375ff86f774186372f685"
                }
            ]
        ]
    }    
}
```
