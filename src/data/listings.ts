/**
 * Listings data for the realtor website template
 * This file holds switchable property/listing data that changes per realtor or client.
 * We start with homepage featured listings first before wiring the full /listings page.
 * This allows realtors to easily update their property portfolio by changing one file.
 */

import listing1 from "@/assets/Daryl/1050-Trident Maple- Chase.png";
import listing2 from "@/assets/Daryl/2077-Winged Elm Way-30045.png";
import listing3 from "@/assets/Daryl/2066-Winged Elm Way-30045.png";
import listing4 from "@/assets/Alexandra/listing-1.jpg";

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
        price: "$599,385",
        neighborhood: "Water Oak Estates, Lawrenceville",
        beds: 5,
        baths: 4,
        sqft: "3,000",
        blurb: "Beautiful new construction home offering 5 bedrooms, modern finishes, and access to premier Water Oak Estates amenities.",
    },
    {
        image: listing2,
        price: "$537,490",
        neighborhood: "Water Oak Estates, Lawrenceville",
        beds: 5,
        baths: 4,
        sqft: "2,500",
        blurb: "Move-in-ready new construction just minutes from downtown Lawrenceville, Mall of Georgia, and everyday conveniences.",
    },
    {
        image: listing3,
        price: "$551,365",
        neighborhood: "Water Oak Estates, Lawrenceville",
        beds: 4,
        baths: 3,
        sqft: "2,800",
        blurb: "Versatile Hampshire floor plan featuring spacious living areas, modern finishes, and access to exceptional community amenities.",
    },
    {
        image: listing4,
        price: "$2,450,000",
        neighborhood: "Buckhead, Atlanta",
        beds: 5,
        baths: 6,
        sqft: "6,400",
        blurb: "Modern stone-and-glass estate on a quiet tree-lined street.",
    },
];
