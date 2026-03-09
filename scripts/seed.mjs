/**
 * Seed script — 10 posts, 10 properties, images, categories
 * Run: node scripts/seed.mjs
 */

const BASE = process.env.BASE_URL || 'http://localhost:3000';

// ─── Auth ────────────────────────────────────────────────────────────────────
async function login() {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@example.com', password: 'admin123' }),
  });
  const data = await res.json();
  if (!data.token) throw new Error('Login failed: ' + JSON.stringify(data));
  console.log('✓ Logged in');
  return data.token;
}

// ─── Upload image from Picsum ─────────────────────────────────────────────────
async function uploadImage(token, seed, alt) {
  const imgRes = await fetch(`https://picsum.photos/seed/${seed}/1200/800`);
  const blob = await imgRes.blob();

  const form = new FormData();
  form.append('file', blob, `${seed}.jpg`);
  form.append('_payload', JSON.stringify({ alt }));

  const res = await fetch(`${BASE}/api/media`, {
    method: 'POST',
    headers: { Authorization: `JWT ${token}` },
    body: form,
  });
  const data = await res.json();
  if (!data.doc?.id) throw new Error('Upload failed: ' + JSON.stringify(data).slice(0, 200));
  console.log(`  ↑ Uploaded image: ${alt}`);
  return data.doc.id;
}

// ─── Create category ──────────────────────────────────────────────────────────
async function createCategory(token, name, slug) {
  const res = await fetch(`${BASE}/api/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify({ name, slug }),
  });
  const data = await res.json();
  if (!data.doc?.id) throw new Error('Category failed: ' + JSON.stringify(data).slice(0, 200));
  console.log(`  + Category: ${name}`);
  return data.doc.id;
}

// ─── Create post ─────────────────────────────────────────────────────────────
async function createPost(token, post) {
  const res = await fetch(`${BASE}/api/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify(post),
  });
  const data = await res.json();
  if (!data.doc?.id) throw new Error('Post failed: ' + JSON.stringify(data).slice(0, 200));
  console.log(`  + Post: ${post.title}`);
  return data.doc.id;
}

// ─── Create property ─────────────────────────────────────────────────────────
async function createProperty(token, property) {
  const res = await fetch(`${BASE}/api/properties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify(property),
  });
  const data = await res.json();
  if (!data.doc?.id) throw new Error('Property failed: ' + JSON.stringify(data).slice(0, 200));
  console.log(`  + Property: ${property.title}`);
  return data.doc.id;
}

// ─── Lexical content helper ───────────────────────────────────────────────────
function lexicalDoc(...paragraphs) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        children: [{ type: 'text', format: 0, style: '', mode: 'normal', text, version: 1 }],
        direction: 'ltr',
        textFormat: 0,
        textStyle: '',
      })),
      direction: 'ltr',
    },
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const token = await login();

  // Upload 20 images
  console.log('\nUploading images...');
  const imageSeeds = [
    'architecture', 'nature', 'city', 'interior', 'travel',
    'food', 'technology', 'business', 'lifestyle', 'design',
    'house1', 'house2', 'house3', 'house4', 'house5',
    'apartment1', 'apartment2', 'villa1', 'villa2', 'studio1',
  ];
  const imageAlts = [
    'Modern architecture', 'Nature landscape', 'City skyline', 'Interior design', 'Travel destination',
    'Food photography', 'Technology workspace', 'Business meeting', 'Lifestyle photography', 'Design inspiration',
    'Charming family home', 'Spacious townhouse', 'Contemporary residence', 'Victorian terrace', 'Garden cottage',
    'City centre apartment', 'Riverside flat', 'Luxury villa', 'Countryside villa', 'Studio apartment',
  ];
  const imageIds = [];
  for (let i = 0; i < 20; i++) {
    const id = await uploadImage(token, imageSeeds[i], imageAlts[i]);
    imageIds.push(id);
  }

  // Create categories
  console.log('\nCreating categories...');
  const categories = [
    { name: 'Architecture', slug: 'architecture' },
    { name: 'Interior Design', slug: 'interior-design' },
    { name: 'Lifestyle', slug: 'lifestyle' },
    { name: 'Travel', slug: 'travel' },
    { name: 'Technology', slug: 'technology' },
  ];
  const categoryIds = [];
  for (const cat of categories) {
    const id = await createCategory(token, cat.name, cat.slug);
    categoryIds.push(id);
  }

  // Create 10 blog posts
  console.log('\nCreating posts...');
  const posts = [
    {
      title: 'The Future of Sustainable Architecture',
      slug: 'future-of-sustainable-architecture',
      excerpt: 'How eco-friendly design is reshaping the built environment and reducing our carbon footprint.',
      content: lexicalDoc(
        'Sustainable architecture is no longer a niche movement — it is becoming the standard for how we build. From passive solar design to living walls, architects worldwide are rethinking what it means to create structures that work with nature rather than against it.',
        'The integration of solar panels, green roofs, and natural ventilation systems is driving a new era of buildings that produce as much energy as they consume. Net-zero buildings, once aspirational, are increasingly achievable with today\'s materials and technologies.',
        'Beyond energy efficiency, sustainable architecture considers water usage, biodiversity, and the long-term wellbeing of occupants. Biophilic design — incorporating natural light, plants, and organic materials — has been shown to improve productivity and mental health.',
        'As climate pressures intensify, the industry faces both a challenge and an opportunity. The decisions made in design studios today will shape the resilience of our cities for generations to come.'
      ),
      featuredImage: imageIds[0],
      categories: [categoryIds[0]],
      status: 'published',
      publishedAt: new Date('2026-02-01').toISOString(),
    },
    {
      title: 'Minimalism in Modern Homes: Less Really Is More',
      slug: 'minimalism-modern-homes',
      excerpt: 'The enduring appeal of clutter-free living and the design principles that make it work.',
      content: lexicalDoc(
        'Minimalist design has permeated every corner of contemporary interiors. The philosophy, rooted in the idea that objects should serve a purpose, has become synonymous with calm, considered living.',
        'The key to successful minimalism is not emptiness but intentionality. Every piece of furniture, every fixture, every surface material earns its place by contributing to the overall harmony of the space.',
        'Neutral palettes of white, grey, and natural timber create a sense of continuity and light. Storage is hidden, surfaces are clear, and the eye is allowed to rest — a rare luxury in an overstimulated world.',
        'Critics argue that minimalism is a privilege of the wealthy, requiring expensive custom joinery to conceal the mess of everyday life. But at its core, minimalism is about editing — choosing fewer, better things — an aspiration that transcends budget.'
      ),
      featuredImage: imageIds[3],
      categories: [categoryIds[1]],
      status: 'published',
      publishedAt: new Date('2026-02-05').toISOString(),
    },
    {
      title: 'Living on the Edge: Cliffside Homes Around the World',
      slug: 'cliffside-homes-around-the-world',
      excerpt: 'A tour of the world\'s most dramatic residences perched above oceans, gorges, and valleys.',
      content: lexicalDoc(
        'There is something primal about building at the edge of a cliff. These are homes that offer uninterrupted views of the world below, where the boundary between architecture and landscape dissolves completely.',
        'From the white-washed villages of Santorini to the timber chalets of the Norwegian fjords, cliffside living demands both engineering ingenuity and a certain fearlessness from its inhabitants.',
        'Modern cliffside homes often use cantilevered structures — extensions that project out over the void — to maximise the drama of their position. Floor-to-ceiling glazing brings the horizon inside.',
        'The challenges are significant: access, foundation stability, building material delivery, and protection from the elements. Yet for those who live in these extraordinary places, the rewards are beyond measure.'
      ),
      featuredImage: imageIds[4],
      categories: [categoryIds[3]],
      status: 'published',
      publishedAt: new Date('2026-02-10').toISOString(),
    },
    {
      title: 'Smart Home Technology: What\'s Worth the Investment',
      slug: 'smart-home-technology-investment',
      excerpt: 'Separating the genuinely useful smart home upgrades from the expensive gimmicks.',
      content: lexicalDoc(
        'The smart home market has exploded with devices promising to automate every aspect of domestic life. But which upgrades genuinely add value, and which are solutions looking for problems?',
        'Smart thermostats consistently top the list of worthwhile investments. Systems that learn your schedule and adjust heating and cooling automatically can cut energy bills by 20–30% with minimal effort.',
        'Smart lighting offers both convenience and energy savings, particularly when paired with occupancy sensors. The ability to set scenes and schedules transforms how we experience our homes after dark.',
        'On the other end of the spectrum, internet-connected fridges and voice-activated kettles rarely justify their premium. The sweet spot lies in automation that removes genuine friction — locking doors, monitoring security, managing energy — rather than novelty for its own sake.'
      ),
      featuredImage: imageIds[6],
      categories: [categoryIds[4]],
      status: 'published',
      publishedAt: new Date('2026-02-14').toISOString(),
    },
    {
      title: 'The Art of the Open Plan: Making Large Spaces Feel Like Home',
      slug: 'art-of-open-plan-spaces',
      excerpt: 'Design strategies to give vast open-plan layouts warmth, purpose, and a sense of belonging.',
      content: lexicalDoc(
        'Open-plan living has dominated residential design for two decades, but the pandemic prompted many to reconsider the format. When home became office, classroom, and sanctuary simultaneously, the lack of defined spaces began to show its limits.',
        'The answer is not to abandon open plan but to design within it more thoughtfully. Zone definition — using rugs, furniture arrangement, and changes in ceiling height — creates distinct areas without erecting walls.',
        'Acoustic design is increasingly important in open-plan homes. Soft furnishings, bookshelves, and textured wall treatments absorb sound and prevent the echo-chamber effect common in hard-finished open spaces.',
        'Lighting is the most powerful zoning tool available. A pendant over the dining table, recessed spots in the kitchen, and floor lamps in the living area create distinct atmospheres within a single volume.'
      ),
      featuredImage: imageIds[1],
      categories: [categoryIds[1]],
      status: 'published',
      publishedAt: new Date('2026-02-18').toISOString(),
    },
    {
      title: 'Concrete: The Material That Divides Opinion',
      slug: 'concrete-material-that-divides-opinion',
      excerpt: 'Why brutalism\'s favourite material is having a renaissance in residential architecture.',
      content: lexicalDoc(
        'Few materials provoke as strong a reaction as exposed concrete. For its detractors, it evokes the bleak housing estates of post-war social housing. For its admirers, it represents honesty, permanence, and a kind of raw beauty that no other material can replicate.',
        'The residential comeback of concrete is being led by a generation of architects who grew up admiring the work of Le Corbusier, Tadao Ando, and Paul Rudolph. In their hands, concrete is warmed by wood, softened by light, and given texture through careful formwork.',
        'Concrete\'s thermal mass makes it an excellent partner for passive design strategies. It absorbs heat during the day and releases it slowly at night, reducing reliance on mechanical heating and cooling.',
        'Polished concrete floors, board-formed walls, and concrete countertops have all found their way into mainstream residential design. What was once considered cold and industrial is increasingly seen as sophisticated and timeless.'
      ),
      featuredImage: imageIds[2],
      categories: [categoryIds[0]],
      status: 'published',
      publishedAt: new Date('2026-02-22').toISOString(),
    },
    {
      title: 'Biophilic Design: Bringing Nature Indoors',
      slug: 'biophilic-design-bringing-nature-indoors',
      excerpt: 'How incorporating natural elements into interiors can improve wellbeing and productivity.',
      content: lexicalDoc(
        'Biophilic design is built on a simple premise: humans evolved in nature and thrive when surrounded by it. By incorporating natural light, plants, water features, and organic materials into our interiors, we can create spaces that genuinely nourish those who inhabit them.',
        'The evidence is compelling. Studies consistently show that access to natural light improves sleep quality and mood. Views of greenery reduce stress. The sound of water lowers blood pressure.',
        'In practice, biophilic design ranges from the grand — double-height spaces filled with trees — to the modest: a well-placed houseplant, a timber feature wall, a window positioned to frame a garden view.',
        'The most successful biophilic interiors work with the existing landscape rather than importing it wholesale. In cities, this might mean maximising existing daylight with strategic mirror placement or choosing materials that reference nature without replicating it literally.'
      ),
      featuredImage: imageIds[9],
      categories: [categoryIds[1]],
      status: 'published',
      publishedAt: new Date('2026-02-26').toISOString(),
    },
    {
      title: 'The Return of Colour: Moving Beyond All-White Interiors',
      slug: 'return-of-colour-beyond-white-interiors',
      excerpt: 'After a decade of white walls and grey kitchens, designers are embracing bold, expressive colour.',
      content: lexicalDoc(
        'For the better part of a decade, the dominant aesthetic in residential interiors could be described in three words: white, grey, and greige. Safe, photographable, and endlessly Pinterest-able, these non-colours dominated every property listing and design magazine.',
        'Something has shifted. Perhaps driven by a collective desire for warmth and personality after years of sanitised minimalism, colour is making a powerful return to domestic spaces.',
        'Deep greens, terracotta, burnt orange, and inky blues are appearing in kitchens, living rooms, and bedrooms. The all-white ceiling is being challenged by painted ceilings in contrasting or complementary tones.',
        'The key to working with bold colour is confidence. Half-measures rarely succeed. A fully committed deep teal kitchen will always outshine a hesitant sage — and the rooms that take the leap are inevitably the ones that feel most alive.'
      ),
      featuredImage: imageIds[8],
      categories: [categoryIds[1]],
      status: 'published',
      publishedAt: new Date('2026-03-01').toISOString(),
    },
    {
      title: 'City Living in 2026: How Urban Homes Are Adapting',
      slug: 'city-living-2026-urban-homes-adapting',
      excerpt: 'The design trends reshaping apartments and terraces as urban populations continue to grow.',
      content: lexicalDoc(
        'The urban home is under more pressure than ever. Rising land values, shrinking floor plates, and changing work patterns are forcing both architects and residents to rethink what city living can and should offer.',
        'Multifunctional furniture — beds that fold into walls, dining tables that expand from a console, sofas with integrated storage — has evolved from a student necessity to a design statement in its own right.',
        'The home office is now a permanent fixture rather than an afterthought. Developers are dedicating space to dedicated work zones, and retrofit solutions — from barn doors to acoustic curtains — are helping existing homes adapt.',
        'Communal amenities are increasingly part of the urban residential offer. Shared roof terraces, co-working spaces, and communal kitchens are blurring the line between private home and urban hotel, offering amenities that individual units could never provide.'
      ),
      featuredImage: imageIds[7],
      categories: [categoryIds[2]],
      status: 'published',
      publishedAt: new Date('2026-03-03').toISOString(),
    },
    {
      title: 'Renovation vs Relocation: How to Make the Right Decision',
      slug: 'renovation-vs-relocation-right-decision',
      excerpt: 'A practical guide to weighing up whether to improve your existing home or move somewhere new.',
      content: lexicalDoc(
        'Every homeowner faces it eventually: the moment when the current home no longer quite fits. The question of whether to renovate or relocate is one of the most significant financial and personal decisions many people will ever make.',
        'The case for renovating is strong when you love your location, neighbourhood, and community. Moving means leaving behind school catchments, friendships, and the familiarity that makes a place feel like home. Renovation allows you to build on what you already have.',
        'The case for moving becomes compelling when the fundamentals cannot be changed. If you need more bedrooms and there is simply no room to extend, or if the floor plan is structurally impossible to improve, no amount of money spent on renovation will solve the problem.',
        'Stamp duty, legal fees, removal costs, and agent commissions can easily reach 5–10% of the property value. This is money that cannot be recouped through sale — and it represents a significant investment in renovation that would remain in the property.'
      ),
      featuredImage: imageIds[5],
      categories: [categoryIds[2]],
      status: 'published',
      publishedAt: new Date('2026-03-04').toISOString(),
    },
  ];

  for (const post of posts) {
    await createPost(token, post);
  }

  // Create 10 properties
  console.log('\nCreating properties...');
  const properties = [
    {
      title: 'The Larchwood — 4-Bed Detached Family Home',
      slug: 'the-larchwood-4-bed-detached',
      description: lexicalDoc(
        'A beautifully presented four-bedroom detached home set in a quiet residential street, moments from excellent schools and local amenities. The ground floor offers a generous open-plan kitchen and dining room, a separate living room with feature fireplace, and a utility room.',
        'Upstairs, the principal bedroom benefits from an en-suite and built-in wardrobes. Three further bedrooms share a well-appointed family bathroom. The landscaped rear garden is south-facing and fully enclosed — ideal for families.',
        'Double garage, driveway parking for three vehicles, and recently upgraded heating system. Ready to move in.'
      ),
      images: [{ image: imageIds[10] }, { image: imageIds[11] }],
      price: 685000,
      bedrooms: 4,
      bathrooms: 2,
      location: 'Chiswick, London W4',
      propertyType: 'sale',
      status: 'published',
    },
    {
      title: 'Harbourside Apartment — 2 Bed with Terrace',
      slug: 'harbourside-apartment-2-bed-terrace',
      description: lexicalDoc(
        'A stunning two-bedroom apartment on the fifth floor of a modern harbourside development, offering panoramic water views from every principal room. The open-plan living and dining space opens directly to a private wraparound terrace.',
        'The kitchen is fully fitted with integrated appliances and stone worktops. The principal bedroom features floor-to-ceiling glazing framing the harbour view, with an en-suite shower room. The second bedroom is well-proportioned and served by a family bathroom.',
        'Allocated underground parking, concierge service, and residents\' gym included in the service charge. An exceptional waterfront opportunity.'
      ),
      images: [{ image: imageIds[12] }, { image: imageIds[15] }],
      price: 2750,
      bedrooms: 2,
      bathrooms: 2,
      location: 'Bristol Harbourside, BS1',
      propertyType: 'rent',
      status: 'published',
    },
    {
      title: 'Thornfield House — Edwardian Villa',
      slug: 'thornfield-house-edwardian-villa',
      description: lexicalDoc(
        'An exceptional Edwardian villa retaining a wealth of period features including original fireplaces, ornate cornicing, and stained glass windows. Substantially extended to the rear, the house now offers over 2,800 sq ft of flexible family accommodation.',
        'The ground floor includes a bespoke kitchen with handcrafted cabinetry, a formal dining room, a study, and a large reception room with original bay window. A rear extension provides a casual family room with direct garden access.',
        'Five bedrooms across two upper floors, including a principal suite with dressing room and en-suite. The mature rear garden features a summerhouse, kitchen garden, and established fruit trees. Rare opportunity in a highly sought-after location.'
      ),
      images: [{ image: imageIds[13] }, { image: imageIds[10] }],
      price: 1250000,
      bedrooms: 5,
      bathrooms: 3,
      location: 'Clifton, Bristol BS8',
      propertyType: 'sale',
      status: 'published',
    },
    {
      title: 'Penthouse Studio — City Centre',
      slug: 'penthouse-studio-city-centre',
      description: lexicalDoc(
        'A beautifully designed top-floor studio apartment in the heart of the city, offering intelligent use of space and exceptional specification throughout. The open-plan living area maximises the available footprint with clever built-in storage and a Juliet balcony.',
        'The kitchen is fully integrated with induction hob, oven, and dishwasher. The sleeping area is defined by a custom-built partition with integrated lighting. Wet room bathroom with rainfall shower.',
        'Perfect for a professional seeking a city-centre base. Bills included in the rental figure. Available immediately.'
      ),
      images: [{ image: imageIds[19] }, { image: imageIds[15] }],
      price: 1450,
      bedrooms: 0,
      bathrooms: 1,
      location: 'Northern Quarter, Manchester M4',
      propertyType: 'rent',
      status: 'published',
    },
    {
      title: 'Orchard Gate — New Build 3-Bed Semi',
      slug: 'orchard-gate-3-bed-semi',
      description: lexicalDoc(
        'A brand new three-bedroom semi-detached home forming part of an exclusive development of just 12 properties. Built to an exceptional standard with an A-rated energy performance certificate, the home benefits from underfloor heating throughout the ground floor and a heat pump system.',
        'The open-plan kitchen and family room is the heart of the home, with bi-fold doors opening to the private rear garden. A separate sitting room provides a quieter retreat. Utility room with space for appliances.',
        'Three bedrooms on the first floor, including a principal room with en-suite. Large family bathroom. Driveway parking for two vehicles. 10-year NHBC warranty. Help to Buy and part-exchange considered.'
      ),
      images: [{ image: imageIds[14] }, { image: imageIds[11] }],
      price: 425000,
      bedrooms: 3,
      bathrooms: 2,
      location: 'Witney, Oxfordshire OX28',
      propertyType: 'sale',
      status: 'published',
    },
    {
      title: 'Millrace Loft — Converted Textile Mill',
      slug: 'millrace-loft-converted-mill',
      description: lexicalDoc(
        'An extraordinary conversion within a Grade II listed Victorian textile mill, combining industrial heritage with contemporary living. Original exposed brickwork, cast iron columns, and timber beams sit alongside bespoke joinery, polished concrete floors, and cutting-edge home technology.',
        'The vast open-plan living space occupies an entire floor of the mill, with ceiling heights exceeding 4.5 metres. A mezzanine level provides a private sleeping area and study. The kitchen is a statement in itself, with a 4-metre island in honed marble.',
        'Two bathrooms, including a principal en-suite with freestanding bath positioned beneath a vaulted skylight. Private parking, secure entry, and a roof terrace shared among four residents.'
      ),
      images: [{ image: imageIds[16] }, { image: imageIds[12] }],
      price: 3200,
      bedrooms: 1,
      bathrooms: 2,
      location: 'Ancoats, Manchester M4',
      propertyType: 'rent',
      status: 'published',
    },
    {
      title: 'Rosewater Lodge — Rural Retreat',
      slug: 'rosewater-lodge-rural-retreat',
      description: lexicalDoc(
        'A rare opportunity to acquire a substantial country home set within 1.5 acres of private grounds, offering complete privacy and breathtaking views across open farmland. The property has been meticulously renovated over the past three years to create a home of exceptional quality.',
        'Six bedrooms across two floors, including a master suite occupying the entire east wing with dressing room, en-suite, and private terrace. The ground floor offers formal and informal reception rooms, a chef\'s kitchen, a snug, and a boot room.',
        'The grounds include a heated swimming pool, a detached two-bedroom cottage for guest accommodation or rental income, a walled kitchen garden, and established woodland. Viewing is essential to appreciate the scale and quality of this exceptional property.'
      ),
      images: [{ image: imageIds[17] }, { image: imageIds[13] }],
      price: 2800000,
      bedrooms: 6,
      bathrooms: 4,
      location: 'Near Cirencester, Gloucestershire GL7',
      propertyType: 'sale',
      status: 'published',
    },
    {
      title: 'The Ironworks — 2-Bed Industrial Apartment',
      slug: 'the-ironworks-2-bed-industrial',
      description: lexicalDoc(
        'A dramatic two-bedroom apartment within a converted Victorian ironworks, offering industrial-chic aesthetics in a sought-after urban location. Exposed steel I-beams, original factory windows, and polished concrete floors create a distinctive backdrop for contemporary living.',
        'The open-plan kitchen and living area benefits from double-height windows flooding the space with natural light. The kitchen features custom steel-framed cabinetry with integrated appliances. Both bedrooms are well-proportioned with ample storage.',
        'The development offers a communal courtyard with seating, secure cycle storage, and a residents\' lounge. Excellent transport links with three bus routes and a tram stop within five minutes\' walk.'
      ),
      images: [{ image: imageIds[18] }, { image: imageIds[16] }],
      price: 1800,
      bedrooms: 2,
      bathrooms: 1,
      location: 'Kelham Island, Sheffield S3',
      propertyType: 'rent',
      status: 'published',
    },
    {
      title: 'Meridian House — Georgian Town House',
      slug: 'meridian-house-georgian-town-house',
      description: lexicalDoc(
        'A magnificent late-Georgian town house arranged over four floors, situated on one of the city\'s most prestigious residential streets. Extensively renovated to the highest standards while preserving every significant period feature, this is a home of rare distinction.',
        'Six reception rooms, a formal dining room, a study, and a spectacular kitchen and breakfast room with bespoke painted cabinetry opening to a walled courtyard garden. Six bedrooms, four bathrooms, including a principal suite of exceptional scale.',
        'A self-contained lower ground floor maisonette, currently generating rental income, may be incorporated into the main house if required. Wine cellar, utility room, and a further roof terrace. Freehold. A truly outstanding acquisition.'
      ),
      images: [{ image: imageIds[10] }, { image: imageIds[17] }],
      price: 3750000,
      bedrooms: 6,
      bathrooms: 4,
      location: 'Bath, Somerset BA1',
      propertyType: 'sale',
      status: 'published',
    },
    {
      title: 'Skylark — Modern 3-Bed Riverside Apartment',
      slug: 'skylark-3-bed-riverside-apartment',
      description: lexicalDoc(
        'A luminous three-bedroom apartment on the ninth floor of a contemporary riverside tower, offering unobstructed views of the river and city beyond. Floor-to-ceiling glazing throughout draws the outside in, while a large private balcony provides outdoor living space.',
        'The kitchen and living area is open plan and beautifully appointed with integrated appliances, stone worktops, and engineered oak flooring. All three bedrooms have fitted wardrobes; the principal benefits from an en-suite bathroom with heated floor.',
        'The development includes a 24-hour concierge, residents\' lounge, gym, and rooftop terrace. Two allocated parking spaces in the underground garage. A short walk from the financial district and excellent public transport.'
      ),
      images: [{ image: imageIds[15] }, { image: imageIds[18] }],
      price: 2950,
      bedrooms: 3,
      bathrooms: 2,
      location: 'Vauxhall, London SE11',
      propertyType: 'rent',
      status: 'published',
    },
  ];

  for (const property of properties) {
    await createProperty(token, property);
  }

  console.log('\n✅ Seed complete! 10 posts + 10 properties + 5 categories + 20 images.');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
