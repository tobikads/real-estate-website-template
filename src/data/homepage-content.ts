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
            "Isla is wonderful to work with. Professional and dedicated to finding your perfect home. She helps you narrow down your vision and provides listing you will enjoy to see. Overall she is wonderful person and provide great experience for her clients.",
        name: "Mandy C.",
    },
    {
        quote:
            "Isla is a dream come true, she was more like part of the family during our house selling and buying process. She took all of wants and needs into consideration and not only sold our home quickly but helped us find out forever home in a great school district with all we needed and more.",
        name: "Erin G.",
    },
    {
        quote:
            "Isla is amazing! She is very professional and knowledgeable. She made our house buying experience fun and easy. I will definitely recommend her to anyone looking to buy or sell.",
        name: "Brandi B.",
    },
];
