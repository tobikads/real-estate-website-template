/**
 * RealtorProfile type definition
 * Defines the structure for switchable realtor template data used throughout the site
 */
import portraitImage from "@/assets/Daryl/daryl-wheeler.png";

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
    name: "Daryl Wheeler",
    title: "Real Estate Agent",
    location: "Atlanta, GA",
    company: "D.R. Horton Realty.",
    phone: "770-722-5068",
    email: "darylwsells@bellsouth.net",
    bio: "I know how personal buying a home can feel, especially when you're trying to balance location, price, timing, and the details that matter most to your family. My goal is to make that process feel clear and manageable, whether you're comparing new-construction options, narrowing down communities, or deciding which home truly fits your next chapter.",
    approach: "I take time to listen first, answer questions honestly, and move at a pace that respects your schedule. You should never feel rushed or left guessing, so I focus on steady communication, patient guidance, and helping you feel confident before every decision.",
    portraitImage,
    licenseNumber: "273593",
    socialLinks: {},
};
