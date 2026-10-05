// WisdomUp SEO copy for the listing pages (All Products, each department, each product type, New / Best sellers).
// Used by products.js for the page title, H1, meta description, the "Buying guide" block and FAQ rich results.
// Wording follows what people in Pakistan actually type into Google (see SEO-REPORT.md for the keyword research).
// Rules: facts only — every product claim must match js/catalog.js. {n}, {min}, {max} and {year} are filled in from
// the live catalogue, so prices and counts can never go stale. No ratings, discounts or "best in Pakistan" claims.
window.WU_SEO = {
  all: {
    name: 'Mobile Accessories',
    h1: 'Mobile Accessories in Pakistan',
    title: 'Mobile Accessories Online in Pakistan — Prices {year} | WisdomUp',
    guide: 'Buy mobile accessories online in Pakistan',
    intro: [
      'Shop {n} WisdomUp mobile accessories online in Pakistan, priced from {min} to {max}: true wireless and open-ear earbuds, neckbands, handsfree, headphones, Bluetooth and party speakers, fast chargers, power banks, charging cables, car mobile holders, keyboards and mice, memory cards, and shavers and hair clippers.',
      'Every order is delivered nationwide with Cash on Delivery, JazzCash, EasyPaisa or bank transfer, and comes with a 7-day money-back guarantee and WisdomUp brand warranty.',
    ],
    faqs: [
      ['How do I buy mobile accessories online in Pakistan with Cash on Delivery?', 'Add products to your cart, choose Cash on Delivery at checkout and pay the rider in cash when your order arrives. JazzCash, EasyPaisa and bank transfer are also available.'],
      ['Does WisdomUp deliver to my city?', 'Yes. WisdomUp delivers to every city in Pakistan. Standard delivery takes 3–5 working days and express delivery 1–2 working days.'],
      ['Do WisdomUp products come with a warranty?', 'Yes. Every WisdomUp product carries a brand warranty, and every order has a 7-day money-back guarantee.'],
    ],
  },
  filters: {
    new: { name: 'New Arrivals', h1: 'New Mobile Accessories in Pakistan', title: 'New Arrivals {year} — Latest Mobile Accessories in Pakistan | WisdomUp', intro: ['The newest WisdomUp launches in Pakistan: {n} products from {min} to {max}, including Bluetooth 6.0 earbuds, party speakers, wireless neckbands, handsfree and fast charging cables.'] },
    best: { name: 'Best Sellers', h1: 'Best-Selling WisdomUp Products in Pakistan', title: 'Best Sellers — Most Popular WisdomUp Products in Pakistan | WisdomUp', intro: ['The WisdomUp products customers buy most: {n} best sellers from {min} to {max}, delivered across Pakistan with Cash on Delivery.'] },
  },
  depts: {
    audio: {
      name: 'Earbuds, Headphones & Speakers',
      guide: 'Earbuds, handsfree, headphones and speakers in Pakistan',
      intro: [
        'Browse {n} WisdomUp audio products in Pakistan from {min} to {max}: true wireless and open-ear earbuds, wireless neckbands, Type-C, 3.5mm and Lightning handsfree, wireless and gaming headphones, Bluetooth and party speakers, and clip-on wireless microphones for mobile video.',
        'Everything pairs with iPhone and Android, and is delivered across Pakistan with Cash on Delivery and brand warranty.',
      ],
      faqs: [
        ['Which is better: earbuds, a neckband or handsfree?', 'Wireless earbuds are the smallest and easiest to carry. A neckband is harder to lose and suits long calls. A wired handsfree needs no charging and costs the least.'],
        ['Do WisdomUp earbuds and speakers work with iPhone and Android?', 'Yes. All WisdomUp Bluetooth earbuds, neckbands, headphones, speakers and mics pair with iPhone, Android, Windows and macOS.'],
      ],
    },
    charging: {
      name: 'Chargers & Power Banks',
      guide: 'Mobile chargers, power banks and wireless chargers in Pakistan',
      intro: [
        'Compare {n} WisdomUp charging products in Pakistan from {min} to {max}: 10W to 20W mobile chargers with the cable included, 18W Quick Charge and 20W PD fast chargers, 5,000mAh and 10,000mAh power banks, 15W wireless chargers, car chargers up to 33W, and power strips with USB ports.',
        'Wall chargers come with an EU 2-pin or UK 3-pin plug and a USB-C, Lightning or Micro-USB cable, so you can match your phone.',
      ],
      faqs: [
        ['Which charger does my phone need?', 'Most new phones charge fastest with a 20W PD USB-C charger. Choose the Lightning cable option for iPhone 14 and older, and USB-C for iPhone 15 and newer and for Android phones.'],
        ['How many times will a 10,000mAh power bank charge my phone?', 'About two full charges for a phone with a 4,000–5,000mAh battery, because some energy is lost as heat while charging.'],
      ],
    },
    cables: {
      name: 'Cables & Adapters',
      guide: 'Charging cables, AUX cables and adapters in Pakistan',
      intro: [
        'Shop {n} WisdomUp cables and adapters in Pakistan from {min} to {max}: USB-C, Lightning and Micro-USB fast charging cables up to 240W, 3-in-1 cables, AUX and car audio cables, OTG and headphone adapters, USB-C to HDMI 4K cables, and Bluetooth receivers.',
      ],
      faqs: [
        ['Which cable do I need for fast charging?', 'Match the cable to your charger and phone: USB-C to USB-C for fast-charging Android phones, laptops and iPhone 15 and newer, and USB-C to Lightning for iPhone 14 and older.'],
        ['What is an OTG adapter?', 'An OTG adapter lets you plug a USB flash drive, mouse or keyboard into the USB-C or Lightning port of your phone or tablet.'],
      ],
    },
    car: {
      name: 'Car Mobile Accessories',
      guide: 'Car mobile holders, car chargers and Bluetooth FM transmitters in Pakistan',
      intro: [
        'Find {n} WisdomUp car accessories in Pakistan from {min} to {max}: magnetic, clamp and one-touch car mobile holders, dual USB and PD fast car chargers up to 33W, Bluetooth FM transmitters that add hands-free calls and music to any car stereo, and 15W wireless car chargers.',
      ],
      faqs: [
        ['How do I add Bluetooth to an old car stereo?', 'Plug a Bluetooth FM transmitter into the car’s 12V socket, tune the radio to the same FM frequency and pair your phone. Most models also charge your phone.'],
        ['Does a car charger drain the car battery?', 'Not while you are driving. If your car’s socket stays on when the engine is off, unplug the charger when you park for a long time.'],
      ],
    },
    stands: {
      name: 'Mobile Stands & Mounts',
      guide: 'Mobile stands, bike mobile holders and selfie sticks in Pakistan',
      intro: [
        'Choose from {n} WisdomUp stands and mounts in Pakistan from {min} to {max}: foldable desk phone stands, laptop and tablet stands, handlebar and waterproof bike mobile holders, and Bluetooth selfie sticks.',
      ],
      faqs: [
        ['Which mobile holder is best for a motorbike?', 'A handlebar mount keeps the phone in view for maps, a mirror mount fits bikes without free handlebar space, and a waterproof bag mount protects the phone from rain and dust.'],
      ],
    },
    computer: {
      name: 'Keyboards & Mice',
      guide: 'Keyboards, mice and mouse pads in Pakistan',
      intro: [
        'Shop {n} WisdomUp computer accessories in Pakistan from {min} to {max}: wired, wireless and Bluetooth keyboard and mouse sets, RGB and backlit gaming sets, wireless mice, and wrist-rest mouse pads.',
      ],
      faqs: [
        ['Is a wireless keyboard and mouse set good for office work?', 'Yes. A wireless set keeps the desk clear of cables and works with one small USB receiver. Choose a wired or backlit gaming set if you want no batteries or play at night.'],
      ],
    },
    storage: {
      name: 'Memory Cards & USB Drives',
      guide: 'Memory cards, USB flash drives and card readers in Pakistan',
      intro: [
        'Compare {n} WisdomUp storage products in Pakistan from {min} to {max}: microSD memory cards up to 128GB, USB 3.0 flash drives up to 64GB, and card readers for USB-C, USB-A and Lightning devices.',
      ],
      faqs: [
        ['Which memory card fits my phone?', 'Phones and most cameras with a card slot use microSD (also called TF) cards. Check your phone’s maximum supported capacity before you buy.'],
      ],
    },
    care: {
      name: 'Shavers & Hair Clippers',
      guide: 'Electric shavers and hair clippers in Pakistan',
      intro: [
        'Browse {n} WisdomUp grooming products in Pakistan from {min} to {max}: water-resistant foil and rotary electric shavers, and cordless hair clippers for haircuts and beard trimming at home.',
      ],
      faqs: [
        ['What is the difference between a shaver and a hair clipper?', 'A shaver cuts hair right at the skin for a smooth finish. A clipper (often called a trimmer) cuts hair and beards to a set length using guide combs.'],
      ],
    },
  },
  types: {
    earbuds: {
      name: 'Wireless Earbuds',
      guide: 'Wireless earbuds price in Pakistan',
      intro: [
        'Compare {n} WisdomUp wireless earbuds in Pakistan from {min} to {max}. The range covers TS-series true wireless earbuds with charging cases, OS-series open-ear earbuds that let you hear traffic and people around you, and the TS-11ANC with active noise cancelling.',
        'All models pair with iPhone and Android phones, tablets and laptops over Bluetooth.',
      ],
      faqs: [
        ['What is the price of WisdomUp earbuds in Pakistan?', 'WisdomUp wireless earbuds cost from {min} to {max} in Pakistan, depending on the model. Prices on this page are current and include brand warranty.'],
        ['Which WisdomUp earbuds have noise cancellation (ANC)?', 'The TS-11ANC earbuds have active noise cancelling (ANC), which uses microphones to reduce engine, fan and traffic noise. ENC, by comparison, only cleans up your voice on calls.'],
        ['Do WisdomUp earbuds work with iPhone and Android?', 'Yes. They connect over Bluetooth to iPhones, Android phones, tablets and laptops.'],
      ],
    },
    neckbands: {
      name: 'Wireless Neckbands',
      guide: 'Neckband price in Pakistan',
      intro: [
        'Shop {n} WisdomUp wireless neckbands in Pakistan from {min} to {max}. A neckband rests around your neck, so the earbuds are hard to lose, and it has room for a bigger battery — a favourite for commuting, the gym and long calls.',
      ],
      faqs: [
        ['What is the neckband price in Pakistan?', 'WisdomUp Bluetooth neckbands cost from {min} to {max} in Pakistan.'],
        ['Is a neckband better than earbuds?', 'A neckband is harder to lose and has room for a larger battery. Earbuds are smaller and easier to carry. Choose a neckband for long calls and workouts.'],
      ],
    },
    headphones: {
      name: 'Headphones',
      guide: 'Headphones price in Pakistan',
      intro: [
        'Compare {n} WisdomUp headphones in Pakistan from {min} to {max}: wireless Bluetooth headphones, wired 3.5mm and USB-C headphones, and RGB gaming headsets with a mic. The TDE-18 adds active noise cancelling.',
      ],
      faqs: [
        ['What is the price of Bluetooth headphones in Pakistan?', 'WisdomUp headphones cost from {min} to {max} in Pakistan, covering wired, wireless and gaming models.'],
        ['Which WisdomUp headphones are made for gaming?', 'The TDE-11, TDE-12 and TDE-13 RGB gaming headsets have a built-in mic, and the TDE-23 is a wireless gaming headphone.'],
      ],
    },
    handsfree: {
      name: 'Handsfree',
      guide: 'Handsfree price in Pakistan',
      intro: [
        'Choose from {n} WisdomUp handsfree earphones in Pakistan from {min} to {max}: Type-C handsfree for phones without a headphone jack, 3.5mm handsfree for phones with a round jack, and Lightning handsfree for iPhone 14 and older.',
        'A wired handsfree needs no charging or pairing — just plug it in.',
      ],
      faqs: [
        ['Which handsfree fits my phone?', 'Check your phone’s port. Choose a USB-C (Type-C) handsfree for phones without a headphone jack, including iPhone 15 and newer; a 3.5mm handsfree for phones with a round headphone jack; and Lightning for iPhone 14 and older.'],
        ['What is the handsfree price in Pakistan?', 'WisdomUp handsfree earphones start from {min} in Pakistan and go up to {max}.'],
      ],
    },
    speakers: {
      name: 'Bluetooth Speakers',
      guide: 'Bluetooth speaker price in Pakistan',
      intro: [
        'Compare {n} WisdomUp Bluetooth speakers in Pakistan from {min} to {max} — from 5W mini speakers that fit in a bag to 350W party speakers. Several models add RGB or LED light shows.',
      ],
      faqs: [
        ['What is the Bluetooth speaker price in Pakistan?', 'WisdomUp Bluetooth speakers cost from {min} for mini speakers to {max} for the largest party speaker.'],
        ['Which WisdomUp speaker is best for parties?', 'Choose a party speaker of 80W or more. The YX-28 has 150W output with RGB lights, and the YX-29 delivers 350W.'],
      ],
    },
    microphones: {
      name: 'Wireless Microphones',
      guide: 'Wireless mic price in Pakistan',
      intro: [
        'WisdomUp wireless clip-on microphones for mobile video, vlogging, reels and interviews, from {min} to {max} in Pakistan. The mic clips to your collar and sends your voice over a 2.4GHz link to a small receiver plugged into your phone.',
      ],
      faqs: [
        ['What is the price of a wireless mic for mobile in Pakistan?', 'WisdomUp wireless clip-on microphones cost from {min} to {max} in Pakistan.'],
        ['How do I use a wireless mic with my mobile?', 'Plug the receiver into your phone, clip the mic to your collar and open your camera app. The transmitter and receiver pair automatically.'],
      ],
    },
    'wall-chargers': {
      name: 'Mobile Chargers',
      guide: 'Mobile charger price in Pakistan',
      intro: [
        'Shop {n} WisdomUp mobile chargers in Pakistan from {min} to {max}: 10W and 12W everyday chargers, 18W Quick Charge 3.0 and 20W PD fast chargers for iPhone and Android.',
        'Most come with the cable in the box — choose USB-C, Lightning or Micro-USB — and an EU 2-pin or UK 3-pin plug.',
      ],
      faqs: [
        ['Which charger do I need for an iPhone?', 'A 20W PD USB-C charger fast-charges iPhone 8 and newer. Pick the Lightning cable option for iPhone 14 and older, or USB-C for iPhone 15 and newer.'],
        ['What is the price of a fast charger in Pakistan?', 'WisdomUp chargers cost from {min} to {max} in Pakistan. 18W and 20W models support fast charging.'],
      ],
    },
    'power-banks': {
      name: 'Power Banks',
      guide: 'Power bank price in Pakistan',
      intro: [
        'Compare {n} WisdomUp power banks in Pakistan from {min} to {max}: 10,000mAh power banks with 22.5W fast charging, models with built-in cables or a digital display, a magnetic wireless power bank, and a pocket-size 5,000mAh capsule.',
      ],
      faqs: [
        ['What is the power bank price in Pakistan?', 'WisdomUp power banks cost from {min} to {max} in Pakistan.'],
        ['How many times can a 10,000mAh power bank charge a phone?', 'About two full charges for a phone with a 4,000–5,000mAh battery, because some energy is lost as heat while charging.'],
      ],
    },
    'wireless-chargers': {
      name: 'Wireless Chargers',
      guide: 'Wireless charger price in Pakistan',
      intro: [
        'WisdomUp 15W wireless chargers in Pakistan from {min} to {max}: magnetic and auto-clamp wireless car chargers, and a 3-in-1 foldable charger for your phone, earbuds and watch.',
      ],
      faqs: [
        ['Will a wireless charger work with my phone?', 'It works with phones that support wireless charging. Magnetic models hold iPhone 12 and newer in place. Thick or metal cases can slow wireless charging.'],
      ],
    },
    'car-chargers': {
      name: 'Car Chargers',
      guide: 'Car charger price in Pakistan',
      intro: [
        'Shop {n} WisdomUp car mobile chargers in Pakistan from {min} to {max}: dual USB car chargers, fast-charging models, and PD car chargers up to 33W with USB and USB-C ports.',
      ],
      faqs: [
        ['What is the car charger price in Pakistan?', 'WisdomUp car chargers cost from {min} to {max} in Pakistan.'],
        ['Does a car charger drain the car battery?', 'Not while you are driving. If your car’s socket stays on when the engine is off, unplug the charger when you park for a long time.'],
      ],
    },
    'power-strips': {
      name: 'Power Strips & Travel Adapters',
      guide: 'Power strips and travel adapters in Pakistan',
      intro: [
        'WisdomUp power strips and plug adapters in Pakistan from {min} to {max}: 4- and 6-socket power strips with USB and USB-C charging ports, and universal travel adapters.',
      ],
      faqs: [],
    },
    'charging-cables': {
      name: 'Charging Cables',
      guide: 'Charging cable price in Pakistan',
      intro: [
        'Choose from {n} WisdomUp charging cables in Pakistan from {min} to {max}: Type-C, Lightning (iPhone) and Micro-USB fast charging cables, 65W and 240W USB-C cables for laptops, braided cables and 3-in-1 cables.',
      ],
      faqs: [
        ['Which cable do I need for fast charging?', 'Match the cable to your charger and phone: USB-C to USB-C for fast-charging Android phones, laptops and iPhone 15 and newer, and USB-C to Lightning for iPhone 14 and older.'],
        ['What is the price of a Type-C cable in Pakistan?', 'WisdomUp charging cables start from {min} in Pakistan and go up to {max} for high-wattage cables.'],
      ],
    },
    'audio-cables': {
      name: 'AUX Cables',
      guide: 'AUX cable price in Pakistan',
      intro: ['WisdomUp AUX and car audio cables in Pakistan from {min} to {max}: 3.5mm AUX cables, and Lightning to AUX and USB-C to AUX cables that connect your phone to a car stereo or speaker.'],
      faqs: [],
    },
    adapters: {
      name: 'OTG & Audio Adapters',
      guide: 'OTG and headphone adapters in Pakistan',
      intro: ['Shop {n} WisdomUp adapters in Pakistan from {min} to {max}: USB-C and Lightning to 3.5mm headphone adapters, charge-and-listen splitters, and OTG adapters for flash drives.'],
      faqs: [['What is an OTG adapter?', 'An OTG adapter lets you plug a USB flash drive, mouse or keyboard into the USB-C or Lightning port of your phone or tablet.']],
    },
    hdmi: {
      name: 'HDMI Cables',
      guide: 'HDMI cable price in Pakistan',
      intro: ['WisdomUp HDMI cables and adapters in Pakistan from {min} to {max}: USB-C to HDMI 4K adapters and cables, and HDMI to HDMI cables for TVs, monitors and projectors.'],
      faqs: [['How do I connect my phone or laptop to a TV?', 'Use a USB-C to HDMI adapter or cable if your device’s USB-C port supports video output, then plug it into the TV’s HDMI port.']],
    },
    'bt-receivers': {
      name: 'Bluetooth Receivers',
      guide: 'Bluetooth receivers and adapters in Pakistan',
      intro: ['WisdomUp Bluetooth 5.0 receivers and USB adapters in Pakistan from {min} to {max} — add wireless audio to a car stereo, speaker or computer.'],
      faqs: [],
    },
    'car-holders': {
      name: 'Car Mobile Holders',
      guide: 'Car mobile holder price in Pakistan',
      intro: [
        'Compare {n} WisdomUp car mobile holders in Pakistan from {min} to {max}: magnetic holders, vacuum-suction mounts, one-touch holders and universal clamp holders, including foldable and extendable designs.',
      ],
      faqs: [
        ['What is the car mobile holder price in Pakistan?', 'WisdomUp car phone holders cost from {min} to {max} in Pakistan.'],
        ['Which car mobile holder should I choose?', 'Magnetic holders are the quickest to use. Clamp and one-touch holders grip any phone without a magnet. Check each product’s photos to see where it mounts in your car.'],
      ],
    },
    'car-bluetooth': {
      name: 'Car Bluetooth & FM Transmitters',
      guide: 'Car Bluetooth FM transmitter price in Pakistan',
      intro: ['WisdomUp car Bluetooth receivers and FM transmitters in Pakistan from {min} to {max}. They add hands-free calls and music streaming to any car stereo, and most also charge your phone.'],
      faqs: [['How do I add Bluetooth to an old car stereo?', 'Plug a Bluetooth FM transmitter into the car’s 12V socket, tune the radio to the same FM frequency and pair your phone.']],
    },
    stands: {
      name: 'Mobile & Laptop Stands',
      guide: 'Mobile stand price in Pakistan',
      intro: ['WisdomUp phone, tablet and laptop stands in Pakistan from {min} to {max}: foldable and telescopic desk phone stands, an aluminium desk stand, and adjustable laptop and tablet stands.'],
      faqs: [],
    },
    'bike-mounts': {
      name: 'Bike Mobile Holders',
      guide: 'Bike mobile holder price in Pakistan',
      intro: ['WisdomUp bike and motorbike mobile holders in Pakistan from {min} to {max}: handlebar mounts, a mirror mount and a waterproof phone bag mount.'],
      faqs: [['Which mobile holder is best for a motorbike?', 'A handlebar mount keeps the phone in view for maps, a mirror mount fits bikes without free handlebar space, and a waterproof bag mount protects the phone from rain and dust.']],
    },
    'selfie-sticks': {
      name: 'Selfie Sticks',
      guide: 'Selfie stick price in Pakistan',
      intro: ['WisdomUp Bluetooth selfie sticks in Pakistan from {min} to {max}, including a model with a built-in light.'],
      faqs: [],
    },
    keyboards: {
      name: 'Keyboard & Mouse Sets',
      guide: 'Keyboard and mouse price in Pakistan',
      intro: ['Shop {n} WisdomUp keyboard and mouse sets in Pakistan from {min} to {max}: wired, wireless and Bluetooth sets for work, plus RGB and backlit gaming sets.'],
      faqs: [],
    },
    mice: {
      name: 'Wireless Mouse',
      guide: 'Wireless mouse price in Pakistan',
      intro: ['WisdomUp wireless mice in Pakistan from {min} to {max} for laptops and desktop computers.'],
      faqs: [],
    },
    'mouse-pads': {
      name: 'Mouse Pads',
      guide: 'Mouse pad price in Pakistan',
      intro: ['WisdomUp wrist-rest mouse pads in Pakistan from {min} to {max}, in memory foam and silicone, for comfortable long hours at the computer.'],
      faqs: [],
    },
    'memory-cards': {
      name: 'Memory Cards',
      guide: 'Memory card price in Pakistan',
      intro: ['WisdomUp microSD (TF) memory cards in Pakistan from {min}, in capacities from 4GB to 128GB for phones, cameras and dash cams.'],
      faqs: [['Which memory card fits my phone?', 'Phones and most cameras with a card slot use microSD (also called TF) cards. Check your phone’s maximum supported capacity before you buy.']],
    },
    'usb-drives': {
      name: 'USB Flash Drives',
      guide: 'USB flash drive price in Pakistan',
      intro: ['WisdomUp USB 3.0 flash drives in Pakistan from {min} to {max}, in capacities from 4GB to 64GB.'],
      faqs: [],
    },
    'card-readers': {
      name: 'Card Readers',
      guide: 'Card reader price in Pakistan',
      intro: ['WisdomUp card readers in Pakistan from {min} to {max} for USB-C, USB-A and Lightning devices — move photos and files from a memory card to your phone or laptop.'],
      faqs: [],
    },
    shavers: {
      name: 'Electric Shavers',
      guide: 'Electric shaver price in Pakistan',
      intro: ['Compare {n} WisdomUp electric shavers in Pakistan from {min} to {max}: foil shavers and 3-head rotary shavers, all water-resistant for easy cleaning.'],
      faqs: [['What is the electric shaver price in Pakistan?', 'WisdomUp electric shavers cost from {min} to {max} in Pakistan.']],
    },
    clippers: {
      name: 'Hair Clippers & Trimmers',
      guide: 'Hair trimmer price in Pakistan',
      intro: ['Shop {n} WisdomUp cordless hair clippers in Pakistan from {min} to {max} for haircuts and beard trimming at home, including a clipper and shaver kit.'],
      faqs: [['What is the hair trimmer price in Pakistan?', 'WisdomUp cordless hair clippers cost from {min} to {max} in Pakistan.']],
    },
  },
};
