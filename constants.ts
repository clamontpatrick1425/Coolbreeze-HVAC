
import { Service, Review, ServiceType } from './types';
import { WrenchScrewdriverIcon, ClockIcon, ShieldCheckIcon, StarIcon, AcademicCapIcon, UsersIcon, SunIcon, SnowflakeIcon, SparklesIcon, BuildingOffice2Icon } from './components/icons';

export const services: Service[] = [
    {
        title: ServiceType.EmergencyRepair,
        description: "24/7 immediate response for critical heating and cooling failures.",
        icon: ClockIcon,
    },
    {
        title: ServiceType.ScheduledRepair,
        description: "Reliable diagnostics and repairs for all makes and models of HVAC systems.",
        icon: WrenchScrewdriverIcon,
    },
    {
        title: ServiceType.Maintenance,
        description: "Proactive tune-ups to ensure efficiency, prevent breakdowns, and extend system life.",
        icon: ShieldCheckIcon,
    },
    {
        title: ServiceType.NewInstallation,
        description: "Expert installation of high-efficiency air conditioners, furnaces, and heat pumps.",
        icon: SunIcon,
    },
    {
        title: ServiceType.AirQuality,
        description: "Solutions for cleaner, healthier air, including purifiers, humidifiers, and ventilation.",
        icon: SparklesIcon,
    },
    {
        title: ServiceType.Commercial,
        description: "Specialized HVAC services for businesses, offices, and commercial properties.",
        icon: BuildingOffice2Icon,
    }
];

export const reviews: Review[] = [
    {
        name: "Sarah L.",
        location: "Kansas City",
        rating: 5,
        text: "CoolBreeze HVAC was a lifesaver! Our AC went out on the hottest day of the year, and they had a technician here within 2 hours. Professional, fast, and fair pricing. Highly recommend!",
        avatar: "https://picsum.photos/id/1027/100/100"
    },
    {
        name: "Michael B.",
        location: "Overland Park",
        rating: 5,
        text: "I signed up for their annual maintenance plan, and it's been fantastic. The team is always punctual, thorough, and they explain everything clearly. My energy bills have even gone down!",
        avatar: "https://picsum.photos/id/1005/100/100"
    },
    {
        name: "Jessica P.",
        location: "Lee's Summit",
        rating: 5,
        text: "We needed a full system replacement, which is a huge job. The CoolBreeze team provided a detailed quote, explained our options, and completed the installation flawlessly. The new system is quiet and efficient.",
        avatar: "https://picsum.photos/id/1011/100/100"
    },
];

export const trustBadges = [
    { icon: ShieldCheckIcon, text: "Licensed & Insured" },
    { icon: ClockIcon, text: "24/7 Emergency Service" },
    { icon: StarIcon, text: "5-Star Rated" },
    { icon: AcademicCapIcon, text: "Certified Technicians" },
    { icon: UsersIcon, text: "10,000+ Happy Customers" }
];

// Greater Kansas City Metro Area Zip Codes (Representative List)
export const servicedZips = [
    "64101", "64102", "64105", "64106", "64108", "64109", "64110", "64111", "64112", "64113", "64114", 
    "64127", "64130", "64131", "64133", "64134", "64138", "64150", "64151", "64152", "64153", "64154", 
    "64155", "64157", "64158", "64012", "64014", "64015", "64029", "64030", "64050", "64052", "64055", 
    "64063", "64064", "64081", "64082", "64086", "66101", "66102", "66103", "66104", "66105", "66106", 
    "66109", "66111", "66112", "66202", "66203", "66204", "66205", "66206", "66207", "66208", "66209", 
    "66210", "66211", "66212", "66213", "66214", "66215", "66216", "66217", "66218", "66219", "66220", 
    "66221", "66223", "66224", "66226", "66227"
];

export const mockPortalData = {
    customer: {
        name: "Michael B.",
        address: "123 Main St, Overland Park",
        memberSince: "2021",
    },
    equipment: [
        { id: 1, name: "Trane XR16 Air Conditioner", installDate: "2021-06-15", lastService: "2023-10-05" },
        { id: 2, name: "Lennox SLP98V Furnace", installDate: "2021-06-15", lastService: "2024-04-20" },
    ],
    serviceHistory: [
        { id: 1, date: "2024-04-20", service: "Spring AC Maintenance", tech: "David R.", status: "Completed" },
        { id: 2, date: "2023-10-05", service: "Fall Furnace Tune-Up", tech: "David R.", status: "Completed" },
        { id: 3, date: "2023-01-12", service: "Ignitor Replacement", serviceType: ServiceType.ScheduledRepair, tech: "John S.", status: "Completed" },
        { id: 4, date: "2022-10-03", service: "Fall Furnace Tune-Up", tech: "David R.", status: "Completed" },
    ],
    upcomingMaintenance: {
        // Use a dynamic date for today to ensure the tracker always shows up in the demo
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        rawDate: new Date().toISOString().split('T')[0],
        service: "Fall Furnace Tune-Up",
    },
    technician: {
        name: "David R.",
        eta: "10:45 AM - 11:15 AM",
        status: "Finishing a job nearby and will head your way shortly.",
        avatar: "https://picsum.photos/id/1015/100/100"
    },
    invoices: [
        { id: "INV-0876", date: "2024-04-20", amount: "$129.00", status: "Paid" },
        { id: "INV-0751", date: "2023-10-05", amount: "$129.00", status: "Paid" },
        { id: "INV-0688", date: "2023-01-12", amount: "$345.50", status: "Paid" },
    ]
};

export const faqData = [
    {
        question: "How do I know if I need to repair or replace my HVAC system?",
        answer: "If you’re experiencing frequent breakdowns, uneven temperatures, rising utility bills, or if your system is over 10–15 years old, it might be time to evaluate replacement. We can come out and do a quick, no-pressure inspection to help you decide what makes the most sense."
    },
    {
        question: "How often should I service my HVAC system?",
        answer: "Ideally twice a year — once before summer and once before winter. Regular maintenance helps keep your system efficient and reduces unexpected repairs."
    },
    {
        question: "How long does an HVAC system last?",
        answer: "Most systems last around 12–20 years, depending on usage and maintenance. Well-maintained systems tend to last longer and run more efficiently."
    },
    {
        question: "What size HVAC system do I need?",
        answer: "Sizing depends on home size, insulation, layout, and more. We’ll perform a load calculation to ensure your system is properly sized — not too big and not too small."
    },
    {
        question: "Why is my AC blowing warm air?",
        answer: "This can happen for several reasons — low refrigerant, dirty filters, thermostat issues, or clogged condenser coils. We can schedule a diagnostic visit to pinpoint the cause."
    },
    {
        question: "Why is my furnace making strange noises?",
        answer: "Noises like banging, whistling, or rattling could mean loose components, ignition issues, or airflow problems. It’s best to have a technician take a look before the issue worsens."
    },
    {
        question: "Why are some rooms hotter or colder than others?",
        answer: "This is often related to airflow or duct design. We can evaluate your ductwork and system settings to balance the temperature throughout your home."
    },
    {
        question: "Do you work on heat pumps and mini-splits?",
        answer: "Yes — we repair, maintain, and install heat pumps, mini-splits, furnaces, central AC units, and more."
    },
    {
        question: "How can I improve my indoor air quality?",
        answer: "We offer solutions like advanced filters, UV lights, air purifiers, dehumidifiers, and duct cleaning. We’ll recommend what fits your home and budget."
    },
    {
        question: "How often should I change my air filter?",
        answer: "Every 1–3 months depending on your filter type, pets, and dust levels."
    },
    {
        question: "Do you offer maintenance membership plans?",
        answer: "Yes — our maintenance plans include seasonal tune-ups, priority service, and discounts on repairs. It helps extend the life of your system and avoid emergencies."
    },
    {
        question: "Do you provide emergency HVAC service?",
        answer: "Yes — we offer quick response service to restore heating or cooling as soon as possible."
    },
    {
        question: "How long does a new HVAC installation take?",
        answer: "Most installations are completed in one day. Larger setups may take slightly longer, but we’ll let you know ahead of time."
    },
    {
        question: "Do you offer financing?",
        answer: "Yes — we have flexible financing options with affordable monthly payments. We’ll go over options during your estimate."
    },
    {
        question: "Are you licensed and insured?",
        answer: "Yes — we are fully licensed, insured, and local."
    },
    {
        question: "Do you provide warranties?",
        answer: "Yes — equipment comes with manufacturer warranties and we provide workmanship guarantees for added peace of mind."
    }
];
