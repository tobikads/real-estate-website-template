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
            "Johunna is dedicated to her clients. She is knowledgeable, resourceful, and resilient. I have already recommended her to friends. I had an issue last year that delayed my ability to sell my home.",
        name: "Iris D.",
    },
    {
        quote:
            "We interviewed three agents. Johunna was the only one who treated our questions like they mattered. She is patient, deeply informed about the city, and incredibly easy to trust with something this big.",
        name: "Priya & Daniel R.",
    },
    {
        quote:
            "Selling the house I raised my children in was emotional. Johunna handled every detail with such grace that I never once felt rushed. She is a rare professional and an even better person.",
        name: "Eleanor W.",
    },
];
