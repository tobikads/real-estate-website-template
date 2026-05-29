/**
 * Listings data for the realtor website template
 * This file holds switchable property/listing data that changes per realtor or client.
 * We start with homepage featured listings first before wiring the full /listings page.
 * This allows realtors to easily update their property portfolio by changing one file.
 */

import listing1 from "@/assets/Alexandra/listing-1.jpg";
import listing2 from "@/assets/Johunna/3157-woodrow-way.png";
import listing3 from "@/assets/Johunna/2742-alpine-road.png";
import listing4 from "@/assets/Johunna/1958-saxon-valley.png";

export type FeaturedListing = {
    image: string;
    price: string;
    neighborhood: string;
    beds: number;
    baths: number;
    sqft: string;
    blurb: string;
};

/**
 * FEATURED_LISTINGS constant
 * Placeholder featured listings for the homepage that can be easily updated
 * to match different realtors' current active properties
 */
export const FEATURED_LISTINGS: FeaturedListing[] = [
    {
        image: listing1,
        price: "$2,450,000",
        neighborhood: "Buckhead, Atlanta",
        beds: 5,
        baths: 6,
        sqft: "6,400",
        blurb: "Modern stone-and-glass estate on a quiet tree-lined street.",
    },
    {
        image: listing2,
        price: "$4,800,000",
        neighborhood: "Brookhaven, Atlanta",
        beds: 6,
        baths: 9,
        sqft: "8,900",
        blurb: "Custom luxury estate with a resort-style pool and chef’s kitchen.",
    },
    {
        image: listing3,
        price: "$635,000",
        neighborhood: "Brookhaven, Atlanta",
        beds: 4,
        baths: 4,
        sqft: "3,079",
        blurb: "Gated Brookhaven townhome with four finished levels.",
    },
    {
        image: listing4,
        price: "$975,000",
        neighborhood: "Garden Hills",
        beds: 3,
        baths: 2,
        sqft: "1,200",
        blurb: "Rare Garden Hills lot with redevelopment potential in Buckhead.",
    },
];
