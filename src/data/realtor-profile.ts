/**
 * RealtorProfile type definition
 * Defines the structure for switchable realtor template data used throughout the site
 */
import portraitImage from "@/assets/Savannah/savannah-lavender-headshot.jpg";

export type RealtorProfile = {
    name: string;
    title: string;
    location: string;
    company: string;
    phone: string;
    email: string;
    bio: string;
    approach: string;
    portraitImage: string;
    licenseNumber: string;
    socialLinks: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
        instagram?: string;
    };
};

/**
 * REALTOR_PROFILE constant
 * Centralized placeholder data for Alexandra Carter that can be switched out
 * for different realtor information to reuse the entire site template
 */
export const REALTOR_PROFILE: RealtorProfile = {
    name: "Savannah Lavender",
    title: "Real Estate Agent",
    location: "Atlanta, GA",
    company: "Coldwell Banker Realty.",
    phone: "770-688-0951",
    email: "savannahlavrealtor@gmail.com",
    bio: "As an Atlanta native, I know the city and surrounding areas well, especially North Atlanta. My passion for real estate started when I purchased my own home, and I now love helping others find the perfect place to call home.",
    approach: "My goal is to help you meet your real estate objectives and exceed your expectations so that you feel comfortable and confident to refer me to your family and friends!  I go above and beyond for my clients and would love to help you find your home.",
    portraitImage,
    licenseNumber: "363335",
    socialLinks: {
        facebook: "https://facebook.com/alexandracarter",
        twitter: "https://twitter.com/alexandracarter",
        linkedin: "https://linkedin.com/in/alexandracarter",
        instagram: "https://instagram.com/alexandracarter",
    },
};
