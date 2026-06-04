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
            "Daryl was very respectful of our needs and paid close attention to the location and price point that mattered to us. He was always prompt, patient, polite, and honest when answering our questions. We highly recommend him.",
        name: "Buyer Client",
    },
    {
        quote:
            "Daryl made the process feel organized from start to finish. He helped us compare options clearly, stayed focused on what we needed, and made sure we understood each step before moving forward.",
        name: "Demo Client",
    },
    {
        quote:
            "We appreciated Daryl's calm communication and attention to detail. He listened first, answered questions honestly, and helped us feel confident about the home we chose.",
        name: "Demo Client",
    },
];
