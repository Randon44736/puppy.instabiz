import { getStorageUrl } from '../services/supabaseStorage';

export interface Puppy {
  id: string;
  slug: string;
  name: string;
  fullTitle: string;
  breed: string;
  gender: 'Boy' | 'Girl' | 'Boy & Girl';
  age: string;
  status: 'Available' | 'Reserved' | 'Adopted';
  image: string;
  gallery: string[];
  description: string;
  price: string;
  attributes: {
    vaccination: string;
    microchip: string;
    healthGuarantee: string;
    passport: string;
    origin: string;
    weight: string;
  };
}

const RAW_PUPPIES: Puppy[] = [
  {
    "id": "blue-marle-pomeranian",
    "slug": "blue-marle-pomeranian",
    "name": "Pomeranian",
    "fullTitle": "Pomeranian",
    "breed": "Pomeranian",
    "gender": "Boy & Girl",
    "age": "2.5 - 3 Months",
    "status": "Available",
    "image": "/images/puppies_blue-marle-pomeranian_asset_26b5b7a6af.webp",
    "gallery": [
      "/images/puppies_blue-marle-pomeranian_asset_26b5b7a6af.webp",
      "/images/puppies_blue-marle-pomeranian_asset_6c928b65e0.webp"
    ],
    "description": "2what comes with this Pomeranian",
    "price": "Inquire for VIP Rate",
    "attributes": {
      "vaccination": "Up to date (3/3)",
      "microchip": "Registered UAE/ISO",
      "healthGuarantee": "1 Year Genetic Guarantee",
      "passport": "International Health Passport Included",
      "origin": "Korean Pedigree Certified / Local Showroom",
      "weight": "1.8 \u2013 2.5 kg expected adult"
    }
  },
  {
    "id": "copper-male",
    "slug": "copper-male",
    "name": "Copper",
    "fullTitle": "Copper",
    "breed": "Teacup Breed",
    "gender": "Boy & Girl",
    "age": "2.5 - 3 Months",
    "status": "Available",
    "image": "/images/puppies_copper-male_asset_3b3a1454d2.webp",
    "gallery": [
      "/images/puppies_copper-male_asset_3b3a1454d2.webp",
      "/images/puppies_copper-male_asset_409b8283c9.webp",
      "/images/puppies_copper-male_asset_66640c62ec.webp",
      "/images/puppies_copper-male_asset_7b5538b8fb.webp",
      "/images/puppies_copper-male_asset_80cde637c1.webp",
      "/images/puppies_copper-male_asset_a99954829a.webp",
      "/images/puppies_copper-male_asset_d5025a8fd6.webp"
    ],
    "description": "Tell us which puppy has captured your heart.",
    "price": "Inquire for VIP Rate",
    "attributes": {
      "vaccination": "Up to date (3/3)",
      "microchip": "Registered UAE/ISO",
      "healthGuarantee": "1 Year Genetic Guarantee",
      "passport": "International Health Passport Included",
      "origin": "Korean Pedigree Certified / Local Showroom",
      "weight": "1.8 \u2013 2.5 kg expected adult"
    }
  },
  {
    "id": "korean-teacup-maltipoo-female",
    "slug": "korean-teacup-maltipoo-female",
    "name": "Korean Teacup Maltipoo",
    "fullTitle": "Korean Teacup Maltipoo",
    "breed": "Maltipoo",
    "gender": "Boy & Girl",
    "age": "2.5 - 3 Months",
    "status": "Available",
    "image": "/images/puppies_korean-teacup-maltipoo-female_asset_0cdcc622b6.webp",
    "gallery": [
      "/images/puppies_korean-teacup-maltipoo-female_asset_0cdcc622b6.webp",
      "/images/puppies_korean-teacup-maltipoo-female_asset_1349319e3e.webp",
      "/images/puppies_korean-teacup-maltipoo-female_asset_31b02eea7a.webp",
      "/images/puppies_korean-teacup-maltipoo-female_asset_46cb4207aa.webp",
      "/images/puppies_korean-teacup-maltipoo-female_asset_5985d73eae.webp",
      "/images/puppies_korean-teacup-maltipoo-female_asset_65cab9ff24.webp",
      "/images/puppies_korean-teacup-maltipoo-female_asset_a4164ec9f2.webp",
      "/images/puppies_korean-teacup-maltipoo-female_asset_cf28d66a5d.webp",
      "/images/puppies_korean-teacup-maltipoo-female_asset_ddd05085d6.webp",
      "/images/puppies_korean-teacup-maltipoo-female_asset_e55ec632b7.webp",
      "/images/puppies_korean-teacup-maltipoo-female_asset_e64e36a98a.webp",
      "/images/puppies_korean-teacup-maltipoo-female_asset_e9106557da.webp",
      "/images/puppies_korean-teacup-maltipoo-female_asset_f89ebe6f2e.webp",
      "/images/puppies_korean-teacup-maltipoo-female_asset_fd75fbd14e.webp"
    ],
    "description": "2what comes with this Korean Teacup Maltipoo",
    "price": "Inquire for VIP Rate",
    "attributes": {
      "vaccination": "Up to date (3/3)",
      "microchip": "Registered UAE/ISO",
      "healthGuarantee": "1 Year Genetic Guarantee",
      "passport": "International Health Passport Included",
      "origin": "Korean Pedigree Certified / Local Showroom",
      "weight": "1.8 \u2013 2.5 kg expected adult"
    }
  },
  {
    "id": "korean-teacup-pomeranian-1",
    "slug": "korean-teacup-pomeranian-1",
    "name": "Korean Teacup Pomeranian",
    "fullTitle": "Korean Teacup Pomeranian",
    "breed": "Pomeranian",
    "gender": "Boy & Girl",
    "age": "2.5 - 3 Months",
    "status": "Available",
    "image": "/images/puppies_korean-teacup-pomeranian-1_asset_66ba48bbb0.webp",
    "gallery": [
      "/images/puppies_korean-teacup-pomeranian-1_asset_66ba48bbb0.webp",
      "/images/puppies_korean-teacup-pomeranian-1_asset_7e3fce3f69.webp",
      "/images/puppies_korean-teacup-pomeranian-1_asset_d32459c58a.webp"
    ],
    "description": "2what comes with this Korean Teacup Pomeranian",
    "price": "Inquire for VIP Rate",
    "attributes": {
      "vaccination": "Up to date (3/3)",
      "microchip": "Registered UAE/ISO",
      "healthGuarantee": "1 Year Genetic Guarantee",
      "passport": "International Health Passport Included",
      "origin": "Korean Pedigree Certified / Local Showroom",
      "weight": "1.8 \u2013 2.5 kg expected adult"
    }
  },
  {
    "id": "korean-teacup-pomeranian-male",
    "slug": "korean-teacup-pomeranian-male",
    "name": "Korean Teacup Pomeranian",
    "fullTitle": "Korean Teacup Pomeranian",
    "breed": "Pomeranian",
    "gender": "Boy & Girl",
    "age": "2.5 - 3 Months",
    "status": "Available",
    "image": "/images/puppies_korean-teacup-pomeranian-male_asset_58c7f3698c.webp",
    "gallery": [
      "/images/puppies_korean-teacup-pomeranian-male_asset_58c7f3698c.webp",
      "/images/puppies_korean-teacup-pomeranian-male_asset_a580933437.webp",
      "/images/puppies_korean-teacup-pomeranian-male_asset_acb5ee6860.webp",
      "/images/puppies_korean-teacup-pomeranian-male_asset_da08c1e855.webp"
    ],
    "description": "2what comes with this Korean Teacup Pomeranian",
    "price": "Inquire for VIP Rate",
    "attributes": {
      "vaccination": "Up to date (3/3)",
      "microchip": "Registered UAE/ISO",
      "healthGuarantee": "1 Year Genetic Guarantee",
      "passport": "International Health Passport Included",
      "origin": "Korean Pedigree Certified / Local Showroom",
      "weight": "1.8 \u2013 2.5 kg expected adult"
    }
  },
  {
    "id": "korean-teacup-pomeranian",
    "slug": "korean-teacup-pomeranian",
    "name": "Korean Teacup Pomeranian",
    "fullTitle": "Korean Teacup Pomeranian",
    "breed": "Pomeranian",
    "gender": "Boy & Girl",
    "age": "2.5 - 3 Months",
    "status": "Available",
    "image": "/images/puppies_korean-teacup-pomeranian-1_asset_66ba48bbb0.webp",
    "gallery": [
      "/images/puppies_korean-teacup-pomeranian-1_asset_66ba48bbb0.webp",
      "/images/puppies_korean-teacup-pomeranian-1_asset_7e3fce3f69.webp",
      "/images/puppies_korean-teacup-pomeranian-1_asset_d32459c58a.webp",
      "/images/puppies_korean-teacup-pomeranian-male_asset_58c7f3698c.webp",
      "/images/puppies_korean-teacup-pomeranian-male_asset_a580933437.webp",
      "/images/puppies_korean-teacup-pomeranian-male_asset_acb5ee6860.webp",
      "/images/puppies_korean-teacup-pomeranian-male_asset_da08c1e855.webp",
      "/images/puppies_korean-teacup-pomeranian_asset_0df336f506.webp",
      "/images/puppies_korean-teacup-pomeranian_asset_4855d9179a.webp",
      "/images/puppies_korean-teacup-pomeranian_asset_4fd81885ab.webp",
      "/images/puppies_korean-teacup-pomeranian_asset_717e4f7300.webp",
      "/images/puppies_korean-teacup-pomeranian_asset_d79322c719.webp"
    ],
    "description": "2what comes with this Korean Teacup Pomeranian",
    "price": "Inquire for VIP Rate",
    "attributes": {
      "vaccination": "Up to date (3/3)",
      "microchip": "Registered UAE/ISO",
      "healthGuarantee": "1 Year Genetic Guarantee",
      "passport": "International Health Passport Included",
      "origin": "Korean Pedigree Certified / Local Showroom",
      "weight": "1.8 \u2013 2.5 kg expected adult"
    }
  },
  {
    "id": "korean-teacup-poodle-female",
    "slug": "korean-teacup-poodle-female",
    "name": "Korean Teacup Poodle",
    "fullTitle": "Korean Teacup Poodle",
    "breed": "Poodle",
    "gender": "Boy & Girl",
    "age": "2.5 - 3 Months",
    "status": "Available",
    "image": "/images/puppies_korean-teacup-poodle-female_asset_3fdd483a1f.webp",
    "gallery": [
      "/images/puppies_korean-teacup-poodle-female_asset_3fdd483a1f.webp",
      "/images/puppies_korean-teacup-poodle-female_asset_562e68b15c.webp",
      "/images/puppies_korean-teacup-poodle-female_asset_74390e97f4.webp",
      "/images/puppies_korean-teacup-poodle-female_asset_a7bf437f9e.webp",
      "/images/puppies_korean-teacup-poodle-female_asset_c2e5da5372.webp"
    ],
    "description": "2what comes with this Korean Teacup Poodle",
    "price": "Inquire for VIP Rate",
    "attributes": {
      "vaccination": "Up to date (3/3)",
      "microchip": "Registered UAE/ISO",
      "healthGuarantee": "1 Year Genetic Guarantee",
      "passport": "International Health Passport Included",
      "origin": "Korean Pedigree Certified / Local Showroom",
      "weight": "1.8 \u2013 2.5 kg expected adult"
    }
  },
  {
    "id": "maltipoo-cavapoo-male",
    "slug": "maltipoo-cavapoo-male",
    "name": "Maltipoo & Cavapoo",
    "fullTitle": "Maltipoo & Cavapoo",
    "breed": "Maltipoo & Cavapoo",
    "gender": "Boy & Girl",
    "age": "2.5 - 3 Months",
    "status": "Available",
    "image": "/images/puppies_maltipoo-cavapoo-male_asset_7a4558a042.webp",
    "gallery": [
      "/images/puppies_maltipoo-cavapoo-male_asset_7a4558a042.webp",
      "/images/puppies_maltipoo-cavapoo-male_asset_a1dddd8fcd.webp",
      "/images/puppies_maltipoo-cavapoo-male_asset_d072b0806b.webp",
      "/images/puppies_maltipoo-cavapoo-male_asset_ec24780547.webp"
    ],
    "description": "Maltipoo (Left) & Cavapoo (Right).",
    "price": "Inquire for VIP Rate",
    "attributes": {
      "vaccination": "Up to date (3/3)",
      "microchip": "Registered UAE/ISO",
      "healthGuarantee": "1 Year Genetic Guarantee",
      "passport": "International Health Passport Included",
      "origin": "Korean Pedigree Certified / Local Showroom",
      "weight": "1.8 \u2013 2.5 kg expected adult"
    }
  },
  {
    "id": "maltipoo-female-1",
    "slug": "maltipoo-female-1",
    "name": "Maltipoo",
    "fullTitle": "Maltipoo",
    "breed": "Maltipoo",
    "gender": "Boy & Girl",
    "age": "2.5 - 3 Months",
    "status": "Available",
    "image": "/images/puppies_maltipoo-female-1_asset_06d5856776.webp",
    "gallery": [
      "/images/puppies_maltipoo-female-1_asset_06d5856776.webp",
      "/images/puppies_maltipoo-female-1_asset_135f834aa9.webp",
      "/images/puppies_maltipoo-female-1_asset_1545cdecb3.webp",
      "/images/puppies_maltipoo-female-1_asset_c179591f6c.webp",
      "/images/puppies_maltipoo-female-1_asset_f046a9ca41.webp"
    ],
    "description": "Tell us which puppy has captured your heart.",
    "price": "Inquire for VIP Rate",
    "attributes": {
      "vaccination": "Up to date (3/3)",
      "microchip": "Registered UAE/ISO",
      "healthGuarantee": "1 Year Genetic Guarantee",
      "passport": "International Health Passport Included",
      "origin": "Korean Pedigree Certified / Local Showroom",
      "weight": "1.8 \u2013 2.5 kg expected adult"
    }
  },
  {
    "id": "maltipoo-female-2",
    "slug": "maltipoo-female-2",
    "name": "Maltipoo",
    "fullTitle": "Maltipoo",
    "breed": "Maltipoo",
    "gender": "Boy & Girl",
    "age": "2.5 - 3 Months",
    "status": "Available",
    "image": "/images/puppies_maltipoo-female-2_asset_0c1d399199.webp",
    "gallery": [
      "/images/puppies_maltipoo-female-2_asset_0c1d399199.webp",
      "/images/puppies_maltipoo-female-2_asset_0c24cfc26b.webp",
      "/images/puppies_maltipoo-female-2_asset_11c5ef5fad.webp",
      "/images/puppies_maltipoo-female-2_asset_12a6624109.webp",
      "/images/puppies_maltipoo-female-2_asset_8494e56c29.webp",
      "/images/puppies_maltipoo-female-2_asset_93c62a00a1.webp",
      "/images/puppies_maltipoo-female-2_asset_d1c54c51cc.webp",
      "/images/puppies_maltipoo-female-2_asset_d6f95208d7.webp"
    ],
    "description": "Tell us which puppy has captured your heart.",
    "price": "Inquire for VIP Rate",
    "attributes": {
      "vaccination": "Up to date (3/3)",
      "microchip": "Registered UAE/ISO",
      "healthGuarantee": "1 Year Genetic Guarantee",
      "passport": "International Health Passport Included",
      "origin": "Korean Pedigree Certified / Local Showroom",
      "weight": "1.8 \u2013 2.5 kg expected adult"
    }
  },
  {
    "id": "maltipoo-female",
    "slug": "maltipoo-female",
    "name": "Maltipoo",
    "fullTitle": "Maltipoo",
    "breed": "Maltipoo",
    "gender": "Boy & Girl",
    "age": "2.5 - 3 Months",
    "status": "Available",
    "image": "/images/puppies_maltipoo-female-1_asset_06d5856776.webp",
    "gallery": [
      "/images/puppies_maltipoo-female-1_asset_06d5856776.webp",
      "/images/puppies_maltipoo-female-1_asset_135f834aa9.webp",
      "/images/puppies_maltipoo-female-1_asset_1545cdecb3.webp",
      "/images/puppies_maltipoo-female-1_asset_c179591f6c.webp",
      "/images/puppies_maltipoo-female-1_asset_f046a9ca41.webp",
      "/images/puppies_maltipoo-female-2_asset_0c1d399199.webp",
      "/images/puppies_maltipoo-female-2_asset_0c24cfc26b.webp",
      "/images/puppies_maltipoo-female-2_asset_11c5ef5fad.webp",
      "/images/puppies_maltipoo-female-2_asset_12a6624109.webp",
      "/images/puppies_maltipoo-female-2_asset_8494e56c29.webp",
      "/images/puppies_maltipoo-female-2_asset_93c62a00a1.webp",
      "/images/puppies_maltipoo-female-2_asset_d1c54c51cc.webp",
      "/images/puppies_maltipoo-female-2_asset_d6f95208d7.webp",
      "/images/puppies_maltipoo-female_asset_16dab50b3b.webp",
      "/images/puppies_maltipoo-female_asset_51779d5632.webp",
      "/images/puppies_maltipoo-female_asset_5a96b1d7da.webp",
      "/images/puppies_maltipoo-female_asset_6311437fc5.webp",
      "/images/puppies_maltipoo-female_asset_d0e490d238.webp"
    ],
    "description": "Tell us which puppy has captured your heart.",
    "price": "Inquire for VIP Rate",
    "attributes": {
      "vaccination": "Up to date (3/3)",
      "microchip": "Registered UAE/ISO",
      "healthGuarantee": "1 Year Genetic Guarantee",
      "passport": "International Health Passport Included",
      "origin": "Korean Pedigree Certified / Local Showroom",
      "weight": "1.8 \u2013 2.5 kg expected adult"
    }
  },
  {
    "id": "maltipoo-max-male",
    "slug": "maltipoo-max-male",
    "name": "Max",
    "fullTitle": "Max",
    "breed": "Teacup Breed",
    "gender": "Boy & Girl",
    "age": "2.5 - 3 Months",
    "status": "Available",
    "image": "/images/puppies_maltipoo-max-male_asset_40f37596b3.webp",
    "gallery": [
      "/images/puppies_maltipoo-max-male_asset_40f37596b3.webp",
      "/images/puppies_maltipoo-max-male_asset_52c5c4461a.webp"
    ],
    "description": "Tell us which puppy has captured your heart.",
    "price": "Inquire for VIP Rate",
    "attributes": {
      "vaccination": "Up to date (3/3)",
      "microchip": "Registered UAE/ISO",
      "healthGuarantee": "1 Year Genetic Guarantee",
      "passport": "International Health Passport Included",
      "origin": "Korean Pedigree Certified / Local Showroom",
      "weight": "1.8 \u2013 2.5 kg expected adult"
    }
  },
  {
    "id": "maltipoo-mia-girl",
    "slug": "maltipoo-mia-girl",
    "name": "Mia",
    "fullTitle": "Mia",
    "breed": "Teacup Breed",
    "gender": "Boy & Girl",
    "age": "2.5 - 3 Months",
    "status": "Available",
    "image": "/images/puppies_maltipoo-mia-girl_asset_5a8e65591e.webp",
    "gallery": [
      "/images/puppies_maltipoo-mia-girl_asset_5a8e65591e.webp",
      "/images/puppies_maltipoo-mia-girl_asset_650cd583f0.webp",
      "/images/puppies_maltipoo-mia-girl_asset_6b1940b35a.webp",
      "/images/puppies_maltipoo-mia-girl_asset_8c9f02ae69.webp",
      "/images/puppies_maltipoo-mia-girl_asset_b2b0097fe9.webp",
      "/images/puppies_maltipoo-mia-girl_asset_c49a287b19.webp",
      "/images/puppies_maltipoo-mia-girl_asset_cde14c3eb0.webp"
    ],
    "description": "Leave your details and our team will get back to you promptly \u2014 or message us on WhatsApp for the quickest reply.",
    "price": "Inquire for VIP Rate",
    "attributes": {
      "vaccination": "Up to date (3/3)",
      "microchip": "Registered UAE/ISO",
      "healthGuarantee": "1 Year Genetic Guarantee",
      "passport": "International Health Passport Included",
      "origin": "Korean Pedigree Certified / Local Showroom",
      "weight": "1.8 \u2013 2.5 kg expected adult"
    }
  },
  {
    "id": "maltipoo-sadie-girl",
    "slug": "maltipoo-sadie-girl",
    "name": "Sadie",
    "fullTitle": "Sadie",
    "breed": "Teacup Breed",
    "gender": "Boy & Girl",
    "age": "2.5 - 3 Months",
    "status": "Available",
    "image": "/images/puppies_maltipoo-sadie-girl_asset_012d8b9ac7.webp",
    "gallery": [
      "/images/puppies_maltipoo-sadie-girl_asset_012d8b9ac7.webp",
      "/images/puppies_maltipoo-sadie-girl_asset_1c5aa10f59.webp",
      "/images/puppies_maltipoo-sadie-girl_asset_b67d5a5ca2.webp",
      "/images/puppies_maltipoo-sadie-girl_asset_e728e2a4b8.webp"
    ],
    "description": "Leave your details and our team will get back to you promptly \u2014 or message us on WhatsApp for the quickest reply.",
    "price": "Inquire for VIP Rate",
    "attributes": {
      "vaccination": "Up to date (3/3)",
      "microchip": "Registered UAE/ISO",
      "healthGuarantee": "1 Year Genetic Guarantee",
      "passport": "International Health Passport Included",
      "origin": "Korean Pedigree Certified / Local Showroom",
      "weight": "1.8 \u2013 2.5 kg expected adult"
    }
  },
  {
    "id": "pomeranian-ace-boy",
    "slug": "pomeranian-ace-boy",
    "name": "Ace",
    "fullTitle": "Ace",
    "breed": "Teacup Breed",
    "gender": "Boy & Girl",
    "age": "2.5 - 3 Months",
    "status": "Available",
    "image": "/images/puppies_pomeranian-ace-boy_asset_352fa22f12.webp",
    "gallery": [
      "/images/puppies_pomeranian-ace-boy_asset_352fa22f12.webp",
      "/images/puppies_pomeranian-ace-boy_asset_3659be427e.webp",
      "/images/puppies_pomeranian-ace-boy_asset_53015a196c.webp",
      "/images/puppies_pomeranian-ace-boy_asset_5e6db586ea.webp",
      "/images/puppies_pomeranian-ace-boy_asset_bedf98b222.webp",
      "/images/puppies_pomeranian-ace-boy_asset_f1eaeeffd3.webp"
    ],
    "description": "Leave your details and our team will get back to you promptly \u2014 or message us on WhatsApp for the quickest reply.",
    "price": "Inquire for VIP Rate",
    "attributes": {
      "vaccination": "Up to date (3/3)",
      "microchip": "Registered UAE/ISO",
      "healthGuarantee": "1 Year Genetic Guarantee",
      "passport": "International Health Passport Included",
      "origin": "Korean Pedigree Certified / Local Showroom",
      "weight": "1.8 \u2013 2.5 kg expected adult"
    }
  },
  {
    "id": "pomeranian-female",
    "slug": "pomeranian-female",
    "name": "Pomeranian",
    "fullTitle": "Pomeranian",
    "breed": "Pomeranian",
    "gender": "Boy & Girl",
    "age": "2.5 - 3 Months",
    "status": "Available",
    "image": "/images/puppies_pomeranian-female_asset_6e2ceaaa47.webp",
    "gallery": [
      "/images/puppies_pomeranian-female_asset_6e2ceaaa47.webp",
      "/images/puppies_pomeranian-female_asset_8586e659f8.webp",
      "/images/puppies_pomeranian-female_asset_921d240158.webp"
    ],
    "description": "2what comes with this Pomeranian",
    "price": "Inquire for VIP Rate",
    "attributes": {
      "vaccination": "Up to date (3/3)",
      "microchip": "Registered UAE/ISO",
      "healthGuarantee": "1 Year Genetic Guarantee",
      "passport": "International Health Passport Included",
      "origin": "Korean Pedigree Certified / Local Showroom",
      "weight": "1.8 \u2013 2.5 kg expected adult"
    }
  },
  {
    "id": "poodle-leo-male",
    "slug": "poodle-leo-male",
    "name": "Leo",
    "fullTitle": "Leo",
    "breed": "Teacup Breed",
    "gender": "Boy & Girl",
    "age": "2.5 - 3 Months",
    "status": "Available",
    "image": "/images/puppies_poodle-leo-male_asset_76030dc1f3.webp",
    "gallery": [
      "/images/puppies_poodle-leo-male_asset_76030dc1f3.webp",
      "/images/puppies_poodle-leo-male_asset_77bd9d2f06.webp",
      "/images/puppies_poodle-leo-male_asset_cb530a6094.webp",
      "/images/puppies_poodle-leo-male_asset_e09fc34deb.webp"
    ],
    "description": "Leave your details and our team will get back to you promptly \u2014 or message us on WhatsApp for the quickest reply.",
    "price": "Inquire for VIP Rate",
    "attributes": {
      "vaccination": "Up to date (3/3)",
      "microchip": "Registered UAE/ISO",
      "healthGuarantee": "1 Year Genetic Guarantee",
      "passport": "International Health Passport Included",
      "origin": "Korean Pedigree Certified / Local Showroom",
      "weight": "1.8 \u2013 2.5 kg expected adult"
    }
  },
  {
    "id": "shitzu-female",
    "slug": "shitzu-female",
    "name": "Shih Tzu",
    "fullTitle": "Shih Tzu",
    "breed": "Shih Tzu",
    "gender": "Boy & Girl",
    "age": "2.5 - 3 Months",
    "status": "Available",
    "image": "/images/puppies_shitzu-female_asset_67396e4e73.webp",
    "gallery": [
      "/images/puppies_shitzu-female_asset_67396e4e73.webp",
      "/images/puppies_shitzu-female_asset_f0945a0ec9.webp"
    ],
    "description": "Tell us which puppy has captured your heart.",
    "price": "Inquire for VIP Rate",
    "attributes": {
      "vaccination": "Up to date (3/3)",
      "microchip": "Registered UAE/ISO",
      "healthGuarantee": "1 Year Genetic Guarantee",
      "passport": "International Health Passport Included",
      "origin": "Korean Pedigree Certified / Local Showroom",
      "weight": "1.8 \u2013 2.5 kg expected adult"
    }
  },
  {
    "id": "shitzu-male",
    "slug": "shitzu-male",
    "name": "Shih Tzu",
    "fullTitle": "Shih Tzu",
    "breed": "Shih Tzu",
    "gender": "Boy & Girl",
    "age": "2.5 - 3 Months",
    "status": "Available",
    "image": "/images/puppies_shitzu-male_asset_4507776201.webp",
    "gallery": [
      "/images/puppies_shitzu-male_asset_4507776201.webp",
      "/images/puppies_shitzu-male_asset_47a5df5a3a.webp"
    ],
    "description": "Tell us which puppy has captured your heart.",
    "price": "Inquire for VIP Rate",
    "attributes": {
      "vaccination": "Up to date (3/3)",
      "microchip": "Registered UAE/ISO",
      "healthGuarantee": "1 Year Genetic Guarantee",
      "passport": "International Health Passport Included",
      "origin": "Korean Pedigree Certified / Local Showroom",
      "weight": "1.8 \u2013 2.5 kg expected adult"
    }
  },
  {
    "id": "toy-poodle-male-female",
    "slug": "toy-poodle-male-female",
    "name": "Toy Poodle",
    "fullTitle": "Toy Poodle",
    "breed": "Poodle",
    "gender": "Boy & Girl",
    "age": "2.5 - 3 Months",
    "status": "Available",
    "image": "/images/puppies_toy-poodle-male-female_asset_1736e69998.webp",
    "gallery": [
      "/images/puppies_toy-poodle-male-female_asset_1736e69998.webp",
      "/images/puppies_toy-poodle-male-female_asset_28736508b5.webp",
      "/images/puppies_toy-poodle-male-female_asset_c3dddc8fa7.webp"
    ],
    "description": "2what comes with this Toy Poodle",
    "price": "Inquire for VIP Rate",
    "attributes": {
      "vaccination": "Up to date (3/3)",
      "microchip": "Registered UAE/ISO",
      "healthGuarantee": "1 Year Genetic Guarantee",
      "passport": "International Health Passport Included",
      "origin": "Korean Pedigree Certified / Local Showroom",
      "weight": "1.8 \u2013 2.5 kg expected adult"
    }
  }
];

export const PUPPIES: Puppy[] = RAW_PUPPIES.map((p) => ({
  ...p,
  image: getStorageUrl(p.image),
  gallery: p.gallery.map(getStorageUrl),
}));
