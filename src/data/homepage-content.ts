/**
 * Homepage-specific template content
 * This file holds switchable content for the homepage that is not strictly realtor identity data.
 * Includes:
 * - Hero carousel images
 * - Section background images (testimonials, work-with sections)
 * - Testimonials (social proof content separated from realtor-profile.ts)
 * 
 * This allows independent updates to homepage visual assets and social proof
 * without touching core realtor profile data or affecting other pages.
 */
import hero1 from "@/assets/Alexandra/hero-1.jpg";
import hero2 from "@/assets/Alexandra/hero-2.jpg";
import hero3 from "@/assets/Alexandra/hero-3.jpg";

export const HOMEPAGE_HERO_IMAGES = [hero1, hero2, hero3];

import testimonialsBg from "@/assets/Alexandra/testimonials-bg.jpg";

export const HOMEPAGE_TESTIMONIALS_BACKGROUND = testimonialsBg;

import workBg from "@/assets/Alexandra/work-with-bg.jpg";

export const HOMEPAGE_WORK_WITH_BACKGROUND = workBg;

export type Testimonial = {
    quote: string;
    name: string;
};

/**
 * HOMEPAGE_TESTIMONIALS constant
 * Placeholder social proof testimonials that can be easily updated to match different realtors
 */
export const HOMEPAGE_TESTIMONIALS: Testimonial[] = [
    {
        quote:
            "Savannah was amazing to work with. She listened to all our needed and directed us accordingly. She gave us advice that turned out to be the reason we got our home! We will always use Savannah and would highly recommend her.",
        name: "Jon G.",
    },
    {
        quote:
            "Savannah Lavender has been very detailed in every aspect of her profession with me and finding a home. I would use her in the future for any real estate deals and I would recommend her to anyone looking for a home.",
        name: "Patty D.",
    },
    {
        quote:
            "Savannah is the best and so great to work with! She is super knowledgeable and is definitely a go getter. We loved working with her and she made our first buying experience great.",
        name: "Kimberly S.",
    },
];
