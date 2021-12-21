import * as admin from 'firebase-admin';


export type allTrapPositionsType = {
    [key: number]: trapPositionType;
}

export type allTrapItemsType = {
    [key in trapType]: trapItemType;
}

export type trapItemType = {
    TrapLevel: number;
    UpgradingBool: boolean;
    TimeStampFinishedUpgrading: admin.firestore.Timestamp;
}

export type trapType =
"Urchin" | "Muscle" | "StaticCanon" | "ElectroRock" | "Tentacle" | "Dropper" | "Piranha" | "Start" | "Exit";

export type trapPositionType = {
    Type: trapType;
    PosX: number;
    PosY: number;
    RotZ: number;
    FlipX: number;
}
