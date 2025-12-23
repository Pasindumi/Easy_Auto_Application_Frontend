import { Comparison } from "../../types/compare.types";

export const SAMPLE_COMPARISONS: Comparison[] = [
    {
        id: "1",
        left: { name: "Nissan Juke", year: "2020", img: require("@/assets/images/car.jpg") },
        right: { name: "Mitsubishi Pajero", year: "2021", img: require("@/assets/images/car.jpg") },
    },
    {
        id: "2",
        left: { name: "Toyota Hilux", year: "2022", img: require("@/assets/images/car.jpg") },
        right: { name: "Ford Ranger", year: "2022", img: require("@/assets/images/car.jpg") },
    },
    {
        id: "3",
        left: { name: "Nissan GTR", year: "R34", img: require("@/assets/images/car.jpg") },
        right: { name: "Nissan GTR", year: "R35", img: require("@/assets/images/car.jpg") },
    },
];
