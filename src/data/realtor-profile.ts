/**
 * RealtorProfile type definition
 * Defines the structure for switchable realtor template data used throughout the site
 */
import portraitImage from "@/assets/Isla/headshot.jpg";

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
    name: "Isla Mills",
    title: "Real Estate Agent",
    location: "Atlanta, GA",
    company: " Re/Max Tru, Inc.",
    phone: "470-513-4507",
    email: "islatheagent@gmail.com",
    bio: "With over 9 years of real estate experience, I am dedicated to delivering exceptional service and results for every client. My approach is built on trust, transparency, and strong communication. Whether you're buying your first home, upgrading to your dream property, or preparing to sell, I provide expert guidance and a tailored strategy to help you navigate every step of the journey with confidence and ease.",
    approach: " Whether you are a first-time buyer, a seller ready for your next chapter, or an investor building your portfolio, I approach every transaction with clarity, compassion, and confidence. Passionate about people and driven by results, I’m here to help you achieve your real estate goals—and to make the journey as rewarding as the destination.",
    portraitImage,
    licenseNumber: "377339",
    socialLinks: {
        facebook: "https://facebook.com/alexandracarter",
        twitter: "https://twitter.com/alexandracarter",
        linkedin: "https://linkedin.com/in/alexandracarter",
        instagram: "https://instagram.com/alexandracarter",
    },
};
