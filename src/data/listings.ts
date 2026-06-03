/**
 * Listings data for the realtor website template
 * This file holds switchable property/listing data that changes per realtor or client.
 * We start with homepage featured listings first before wiring the full /listings page.
 * This allows realtors to easily update their property portfolio by changing one file.
 */

import listing1 from "@/assets/Savannah/426-Jim Hood Road-Gainesville.png";
import listing2 from "@/assets/Savannah/855-Peachtree St NE-3503.png";
import listing3 from "@/assets/Savannah/1046-Mayson Turner Rd NW-30314.png";

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
        price: "$750,000",
        neighborhood: "Gainesville, GA",
        beds: 4,
        baths: 2,
        sqft: "2,557",
        blurb: "Modern farmhouse-style acreage listing with mountain views, barn/farm structure, and flexible homestead appeal.",
    },
    {
        image: listing2,
        price: "$518,000",
        neighborhood: "Midtown, Atlanta",
        beds: 2,
        baths: 2,
        sqft: "1,121",
        blurb: "Elegant Atlanta condo offering sweeping skyline views, full laundry, and two coveted parking garage spaces.",
    },
    {
        image: listing3,
        price: "$555,000",
        neighborhood: "Vine City, Atlanta",
        beds: 4,
        baths: 3,
        sqft: "3,984",
        blurb: "Beautifully renovated home with flexible living space, private entrance, and a prime location near Atlanta's top attractions.",
    },
];
