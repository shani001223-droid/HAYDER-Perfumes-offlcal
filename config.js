/*
  HAYDER PERFUMES — EDIT THIS FILE TO CHANGE STORE DETAILS.
  PRICE GUIDE: Change `price: 2499` or `oldPrice: 3499` for any product.
  WhatsApp: Enter digits only, including the country code (92 for Pakistan).
  Instagram/TikTok: Add your real public links, or leave as empty strings.
  Reviews: Samples below are DESIGN PLACEHOLDERS, not real customer feedback.
*/
window.HAYDER_CONFIG = {
  brand: 'HAYDER PERFUMES',
  tagline: 'SMELL LIKE A KING',
  whatsapp: '923373764975', // Existing website number. Confirm this belongs to HAYDER before launch.
  instagram: '',
  tiktok: '',
  shipping: 'FREE DELIVERY ALL OVER PAKISTAN',
  cashOnDelivery: 'CASH ON DELIVERY AVAILABLE',
  products: [
    {
      id: 'bad-habit', name: 'BAD HABIT', tagline: 'THE MAFIA SCENT',
      description: 'Bold. Magnetic. Unapologetically confident.',
      image: 'assets/bad-habit.webp', price: 2499, oldPrice: 3499,
      volume: '50 ML', category: 'Men · Bold', bestseller: true,
      accent: '#b95556'
    },
    {
      id: 'blue-venom', name: 'BLUE VENOM', tagline: 'THE COLD POWER',
      description: 'A cool presence that never goes unnoticed.',
      image: 'assets/blue-venom.webp', price: 2499, oldPrice: 3499,
      volume: '50 ML', category: 'Men · Fresh', bestseller: false,
      accent: '#77aaca'
    },
    {
      id: 'love-bite', name: 'LOVE BITE', tagline: 'THE ADDICTIVE SCENT',
      description: 'An unforgettable impression of modern romance.',
      image: 'assets/love-bite.webp', price: 2499, oldPrice: 3499,
      volume: '50 ML', category: 'Women · Romantic', bestseller: false,
      accent: '#c9899e'
    },
    {
      id: 'dark-empire', name: 'DARK EMPIRE', tagline: 'THE ROYAL OUD',
      description: 'A rich, commanding signature of quiet power.',
      image: 'assets/dark-empire.webp', price: 2499, oldPrice: 3499,
      volume: '50 ML', category: 'Unisex · Oud', bestseller: false,
      accent: '#d5b987'
    }
  ],
  /* Turn on only when you have GENUINE ratings/review data and permission to display it. */
  showVerifiedRatings: false,
  rating: 5.0,
  reviewCount: 120,
  /* Replace these demo samples with authentic customer reviews and approved photos. */
  reviews: [
    { name: 'Ahmed', city: 'Lahore', initials: 'A', photo: '', text: 'The presentation feels luxurious, and BAD HABIT makes a bold first impression.' },
    { name: 'Ayesha', city: 'Karachi', initials: 'A', photo: '', text: 'LOVE BITE has the romantic character I was looking for. The packaging looks beautiful.' },
    { name: 'Bilal', city: 'Islamabad', initials: 'B', photo: '', text: 'DARK EMPIRE is an elegant choice for those who love a deeper oud character.' }
  ],
  reviewsAreVerified: false
};
