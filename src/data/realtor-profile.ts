/**
 * RealtorProfile type definition
 * Defines the structure for switchable realtor template data used throughout the site
 */
import portraitImage from "@/assets/Johunna/J Headshot 1.jpg";

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
    name: "Johunna Redmond",
    title: "Real Estate Agent",
    location: "Atlanta, GA",
    company: "14th & Luxe Realty",
    phone: "404-516-1175",
    email: "johunnasells@gmail.com",
    bio: "I am a licensed Real Estate Agent helping families gain knowledge, grow wealth and have new conversations about financial literacy through homeownership. I work with investors, first-time home buyers, luxury buyers and sellers. I have been a licensed real estate agent for over 17 years. I began my real estate career in Tennessee as an investor before relocating to Atlanta. My mother was the driving force behind me becoming a real estate agent. She regularly watches HGTV and other home improvement channels and thought with my natural ability as a salesperson that I would be successful in real estate.",
    approach: "I am dedicated to educating individuals on how much shifting your thoughts will affect the other areas in your life. My prayer is that I can create a platform in which I can engage with people around the globe regarding mental stability, best business practices and an overall healthy lifestyle.",
    portraitImage,
    licenseNumber: "000000",
    socialLinks: {
        facebook: "https://facebook.com/alexandracarter",
        twitter: "https://twitter.com/alexandracarter",
        linkedin: "https://linkedin.com/in/alexandracarter",
        instagram: "https://instagram.com/alexandracarter",
    },
};
