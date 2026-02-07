export interface City {
    name: string;
}

export interface District {
    name: string;
    cities: string[];
}

export interface Province {
    name: string;
    districts: District[];
}

export const SRI_LANKA_LOCATIONS: Province[] = [
    {
        name: "Western",
        districts: [
            {
                name: "Colombo",
                cities: [
                    "Colombo 1", "Colombo 2", "Colombo 3", "Colombo 4", "Colombo 5", "Colombo 6", "Colombo 7", "Colombo 8", "Colombo 9",
                    "Colombo 10", "Colombo 11", "Colombo 12", "Colombo 13", "Colombo 14", "Colombo 15",
                    "Nugegoda", "Dehiwala", "Mount Lavinia", "Moratuwa", "Kotte", "Battaramulla", "Rajagiriya", "Angoda", "Kaduwela",
                    "Malabe", "Athurugiriya", "Padukka", "Hanwella", "Homagama", "Piliyandala", "Maharagama", "Kesbewa", "Avissawella",
                    "Boralesgamuwa", "Kolonnawa", "Mulleriyawa", "Wellampitiya", "Ratmalana", "Talawatugoda"
                ]
            },
            {
                name: "Gampaha",
                cities: [
                    "Gampaha", "Negombo", "Katunayake", "Biyagama", "Delgoda", "Divulapitiya", "Dompe", "Ja-Ela", "Kandana", "Kelaniya",
                    "Kiribathgoda", "Minuwangoda", "Mirigama", "Nittambuwa", "Ragama", "Veyangoda", "Wattala", "Welisara", "Kadawatha",
                    "Ganemulla"
                ]
            },
            {
                name: "Kalutara",
                cities: [
                    "Kalutara", "Panadura", "Horana", "Matugama", "Bandaragama", "Beruwala", "Aluthgama", "Wadduwa", "Ingiriya", "Bulathsinhala", "Dodangoda"
                ]
            }
        ]
    },
    {
        name: "Central",
        districts: [
            {
                name: "Kandy",
                cities: ["Kandy", "Peradeniya", "Katugastota", "Gampola", "Gelioya", "Kadugannawa", "Akurana", "Wattegama", "Digana", "Kundasale", "Nawalapitiya"]
            },
            {
                name: "Matale",
                cities: ["Matale", "Dambulla", "Sigiriya", "Palapathwela", "Ukuwela", "Rattota"]
            },
            {
                name: "Nuwara Eliya",
                cities: ["Nuwara Eliya", "Hatton", "Ginihathena", "Talawakele", "Walapane", "Hanguranketha", "Agarapatana"]
            }
        ]
    },
    {
        name: "Southern",
        districts: [
            {
                name: "Galle",
                cities: ["Galle", "Ambalangoda", "Hikkaduwa", "Baddegama", "Karapitiya", "Elpitiya", "Bentota", "Ahangama", "Unawatuna"]
            },
            {
                name: "Matara",
                cities: ["Matara", "Weligama", "Akuressa", "Dickwella", "Hakmana", "Kamburupitiya", "Deniyaya"]
            },
            {
                name: "Hambantota",
                cities: ["Hambantota", "Tangalle", "Beliatta", "Ambalantota", "Tissamaharama", "Weeraketiya"]
            }
        ]
    },
    {
        name: "Northern",
        districts: [
            {
                name: "Jaffna",
                cities: ["Jaffna", "Chunnakam", "Chavakachcheri", "Point Pedro", "Nallur", "Karainagar"]
            },
            {
                name: "Kilinochchi",
                cities: ["Kilinochchi", "Pallai"]
            },
            {
                name: "Mannar",
                cities: ["Mannar", "Nanattan"]
            },
            {
                name: "Vavuniya",
                cities: ["Vavuniya", "Cheddikulam"]
            },
            {
                name: "Mullaitivu",
                cities: ["Mullaitivu", "Puthukkudiyiruppu"]
            }
        ]
    },
    {
        name: "Eastern",
        districts: [
            {
                name: "Trincomalee",
                cities: ["Trincomalee", "Kinniya", "Mutur", "Kantale"]
            },
            {
                name: "Batticaloa",
                cities: ["Batticaloa", "Kattankudy", "Eravur", "Valaichchenai"]
            },
            {
                name: "Ampara",
                cities: ["Ampara", "Samanthurai", "Kalmunai", "Akkaraipattu", "Sainthamaruthu"]
            }
        ]
    },
    {
        name: "North Western",
        districts: [
            {
                name: "Kurunegala",
                cities: ["Kurunegala", "Kuliyapitiya", "Narammala", "Pannala", "Wariyapola", "Nikaweratiya", "Mawathagama", "Galgamuwa", "Polgahawela", "Ibbagamuwa"]
            },
            {
                name: "Puttalam",
                cities: ["Puttalam", "Chilaw", "Marawila", "Wennappuwa", "Nattandiya", "Dankotuwa", "Anamaduwa", "Kalpitiya"]
            }
        ]
    },
    {
        name: "North Central",
        districts: [
            {
                name: "Anuradhapura",
                cities: ["Anuradhapura", "Kekirawa", "Eppawala", "Medawachchiya", "Tambuttegama", "Mihintale", "Nochchiyagama", "Galenbindunuwewa"]
            },
            {
                name: "Polonnaruwa",
                cities: ["Polonnaruwa", "Kaduruwela", "Hingurakgoda", "Medirigiriya", "Aralaganwila"]
            }
        ]
    },
    {
        name: "Uva",
        districts: [
            {
                name: "Badulla",
                cities: ["Badulla", "Bandarawela", "Hali-Ela", "Haputale", "Welimada", "Mahiyanganaya", "Passara", "Diyatalawa", "Ella"]
            },
            {
                name: "Moneragala",
                cities: ["Moneragala", "Wellawaya", "Buttala", "Bibile", "Kataragama"]
            }
        ]
    },
    {
        name: "Sabaragamuwa",
        districts: [
            {
                name: "Ratnapura",
                cities: ["Ratnapura", "Balangoda", "Embilipitiya", "Kuruwita", "Pelmadulla", "Eheliyagoda", "Godakawela", "Rakwana"]
            },
            {
                name: "Kegalle",
                cities: ["Kegalle", "Mawanella", "Warakapola", "Rambukkana", "Deraniyagala", "Ruwanwella", "Galigamuwa", "Kitulgala"]
            }
        ]
    }
];

// Flat list for search
export const ALL_CITIES = SRI_LANKA_LOCATIONS.flatMap(province =>
    province.districts.flatMap(district =>
        district.cities.map(city => ({
            cityName: city,
            districtName: district.name,
            provinceName: province.name,
            fullLocation: `${city}, ${district.name}`
        }))
    )
);
