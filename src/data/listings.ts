/**
 * Listings data for the realtor website template
 * This file holds switchable property/listing data that changes per realtor or client.
 * We start with homepage featured listings first before wiring the full /listings page.
 * This allows realtors to easily update their property portfolio by changing one file.
 */

import listing1 from "@/assets/Alexandra/listing-1.jpg";
import listing2 from "@/assets/Isla/1710-Winter-Jasmine-Drive.jpg";
import listing3 from "@/assets/Isla/2220-Davis-Oaks-Court.jpg";
import listing4 from "@/assets/Isla/775-Martin-Field-Drive.jpg";

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
        price: "$799,500",
        neighborhood: "Hamilton Mill, Dacula",
        beds: 6,
        baths: 5,
        sqft: "4,600",
        blurb: "Large Hamilton Mill traditional on a corner lot with a finished terrace level and resort-style neighborhood amenities.",
    },
    {
        image: listing3,
        price: "$519,000",
        neighborhood: "St. Martin, Lawrenceville",
        beds: 5,
        baths: 4,
        sqft: "3,491",
        blurb: "St. Martin home with a flexible multi-generational layout, refreshed kitchen, sunroom, and new deck.",
    },
    {
        image: listing4,
        price: "$319,000",
        neighborhood: "Davis Oaks, Stone Mountain",
        beds: 3,
        baths: 2,
        sqft: "2,270",
        blurb: "Move-in-ready split-level with bright living spaces, updated kitchen, sunroom, and Gwinnett County school positioning.",
    },
];
