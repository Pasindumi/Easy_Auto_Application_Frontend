export interface VehicleInfo {
    name: string;
    year?: string;
    img: any;
}

export interface Comparison {
    id: string;
    left: VehicleInfo;
    right: VehicleInfo;
}
