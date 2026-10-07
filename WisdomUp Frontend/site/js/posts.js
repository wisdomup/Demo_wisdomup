// WisdomUp blog posts (used by blog.html, article.html?p=<slug> and the home "See what we've been up to" carousel). Product facts
// match js/catalog.js; never type a price — write {price:id}. `bg` = the story's dark backdrop: ink, warm graphite or brand red only (the day colour rule — no navy/green).
// Guides from the Pakistan search data (2026-10-07, SEO-REPORT.md §3): `{price:id}` and `<div data-list=…>` tables are filled
// from the live catalogue by info.js, so they always show today's models and prices. `iso` = publish date for structured data.
window.WU_POSTS = [
  {
    slug: 'wireless-earbuds-under-5000',
    cat: 'Buying guide',
    title: 'Wireless earbuds under Rs.5,000 in Pakistan: every WisdomUp model compared',
    seoTitle: 'Wireless Earbuds Under Rs.5,000 in Pakistan',
    excerpt: 'Every WisdomUp wireless earbud under Rs.5,000 in Pakistan, with its Bluetooth version, battery and today’s price — plus what to check before you buy.',
    date: 'October 2026', iso: '2026-10-07', mins: 5, art: 'buds',
    bg: 'linear-gradient(120deg,#2a2622,#0d0c0b)',
    products: ['ts-12', 'ts-13', 'ts-2', 'ts-4', 'os-6'],
    body: `
      <p>Rs.5,000 buys a lot of earbud today: Bluetooth 6.0, USB-C charging cases and 13mm drivers all fit under that line. Here is every WisdomUp pair in the budget, cheapest first, with today’s price.</p>
      <h2>Every WisdomUp earbud under Rs.5,000</h2>
      <div data-list="earbuds" data-max="5000" data-specs="Bluetooth,Case battery,Playtime"></div>
      <h2>What to check before you buy</h2>
      <ul>
        <li><strong>Bluetooth version.</strong> Every TS model with a USB-C case, from the TS-8 to the TS-13, runs Bluetooth 6.0 for a stable link to your phone.</li>
        <li><strong>Battery.</strong> The TS-2, TS-3, TS-4 and TS-5 are rated for about 20 hours of music with the case and recharge in under 2.5 hours. The newer TS models list their cells instead: 30mAh in each earbud and a 250–300mAh case.</li>
        <li><strong>Fit.</strong> TS earbuds sit inside the ear and seal it, which blocks more outside noise and gives fuller bass. If you ride a bike or walk busy roads, open-ear OS earbuds let you hear traffic — the OS-6 is {price:os-6}.</li>
        <li><strong>Noise cancelling.</strong> Active noise cancelling (ANC) uses tiny microphones to cancel steady noise such as engines and fans. In the WisdomUp range only the TS-11ANC has it, at {price:ts-11anc}.</li>
      </ul>
      <h2>“AirPods” or earbuds?</h2>
      <p>Many people search for “AirPods” when they mean any wireless earbuds. AirPods are Apple’s own product. WisdomUp TS and OS earbuds are our own designs, and they connect over Bluetooth to iPhone and Android phones alike.</p>
      <h2>On a smaller budget</h2>
      <p>The lowest-priced WisdomUp true wireless earbuds are the TS-2 and TS-4 at {price:ts-2}. For less than that, a Bluetooth neckband keeps your music wireless:</p>
      <div data-list="neckbands" data-max="3000" data-specs="Bluetooth,Playtime,Range" data-limit="4"></div>
      <h2>Buy with confidence</h2>
      <p>Pay with Cash on Delivery, try them at home with our <a href="returns.html">7-day money-back guarantee</a>, and keep the WisdomUp <a href="warranty.html">brand warranty</a>. Or compare all <a href="products.html?cat=earbuds">wireless earbuds</a>.</p>`,
  },
  {
    slug: 'which-handsfree-fits-my-phone',
    cat: 'Buying guide',
    title: 'Which handsfree fits my phone? USB-C, 3.5mm or Lightning',
    seoTitle: 'Which Handsfree Fits My Phone? Type-C, 3.5mm, iPhone',
    excerpt: 'Type-C, 3.5mm or Lightning? How to tell which handsfree plug your iPhone, Samsung or other Android phone needs, and what the sensitivity number means.',
    date: 'October 2026', iso: '2026-10-07', mins: 4, art: 'buds',
    bg: 'linear-gradient(120deg,#3a0f12,#0d0505)',
    products: ['ej-39', 'ej-38', 'ej-42', 'ej-02'],
    body: `
      <p>A wired handsfree is still the cheapest way to get clear calls and music on the move — but only if the plug fits your phone. WisdomUp handsfree come with three plugs. Here is how to pick yours in ten seconds.</p>
      <h2>Look at the bottom of your phone</h2>
      <ul>
        <li><strong>A small round hole</strong> beside the charging port is a 3.5mm headphone jack. Any 3.5mm handsfree fits — and also most laptops, tablets and older phones.</li>
        <li><strong>No round hole, only an oval charging port</strong> means USB-C (often called Type-C). You need a USB-C handsfree.</li>
        <li><strong>An iPhone with a Lightning port</strong> (iPhone 5 to iPhone 14) needs a Lightning handsfree.</li>
      </ul>
      <h2>Samsung, Xiaomi, Infinix, Tecno and other Android phones</h2>
      <p>Almost every recent Android phone charges through USB-C. Many newer models have dropped the 3.5mm jack while many budget models still keep it, so check for the round hole first. If your phone has both, either plug works.</p>
      <h2>iPhone</h2>
      <p>iPhone 15 and newer use USB-C — the EJ-38 is listed as working with iPhone 15 and 16. iPhone 5 to iPhone 14 use Lightning.</p>
      <h2>USB-C handsfree</h2>
      <div data-list="handsfree" data-match="Plug=USB-C" data-specs="Sensitivity,Cable length" data-limit="6"></div>
      <h2>3.5mm handsfree</h2>
      <div data-list="handsfree" data-match="Plug=3.5mm" data-specs="Sensitivity,Cable length" data-limit="6"></div>
      <h2>Lightning handsfree for iPhone</h2>
      <div data-list="handsfree" data-match="Plug=Lightning" data-specs="Sensitivity,Cable length" data-limit="6"></div>
      <h2>What does “sensitivity” mean?</h2>
      <p>Sensitivity, in decibels (dB), tells you how loud earphones play at the same volume setting. A 116 dB pair plays clearly louder than a 95 dB pair — useful on busy roads or with a phone that sounds quiet. Lower-sensitivity earphones are fine for quiet rooms.</p>
      <p>One check before you buy USB-C earphones: a few phones don’t send sound through their USB-C port. If yours came with 3.5mm earphones in the box, look at its manual first. Browse all <a href="products.html?cat=handsfree">handsfree</a>.</p>`,
  },
  {
    slug: 'power-bank-how-many-charges',
    cat: 'How-to',
    title: 'How many charges does a 10,000mAh power bank give your phone?',
    seoTitle: 'How Many Charges From a 10000mAh Power Bank?',
    excerpt: 'A 10,000mAh power bank doesn’t put 10,000mAh into your phone. The simple maths, realistic charge counts and how to choose a power bank in Pakistan.',
    date: 'October 2026', iso: '2026-10-07', mins: 4, art: 'bank',
    bg: 'linear-gradient(120deg,#2c2d30,#0c0c0d)',
    products: ['cdb-17', 'cdb-19', 'cdb-22', 'cdb-18'],
    body: `
      <p>The number on a power bank is the capacity of the cells inside it, measured at their own 3.7 volts. Charging a phone means raising that to 5 volts or more, and some energy is lost as heat on the way. In practice about 60–70% of the rated capacity reaches your phone.</p>
      <h2>The simple maths</h2>
      <p>A 10,000mAh power bank delivers roughly 6,000–7,000mAh to your phone. Divide that by your phone’s battery size:</p>
      <div class="kv"><b>3,000mAh phone</b><span>about 2 full charges</span><b>4,000mAh phone</b><span>about 1.5–1.7 full charges</span><b>5,000mAh phone</b><span>about 1.2–1.4 full charges</span><b>5,000mAh power bank</b><span>about 60–70% of a 5,000mAh phone</span></div>
      <p>Most people don’t charge from empty. Topping up from 20% to 80% uses about 3,000mAh on a 5,000mAh phone, so a 10,000mAh bank gives you two of those top-ups.</p>
      <h2>Do you need 20,000mAh?</h2>
      <p>A 20,000mAh power bank roughly doubles the numbers above, but it is about twice the size and weight. For a day out or a long journey, 10,000mAh covers most phones; choose more only if you charge a tablet or several devices.</p>
      <h2>What else to look for</h2>
      <ul>
        <li><strong>Fast charging.</strong> 22.5W models refill a phone that supports fast charging much quicker; other phones still charge at their normal speed.</li>
        <li><strong>Built-in cables.</strong> Several WisdomUp power banks carry their own cables, so you never leave the cable at home.</li>
        <li><strong>Flying.</strong> A 10,000mAh bank holds about 37Wh, under the 100Wh limit airlines generally allow — but power banks must go in your hand luggage, never in checked bags.</li>
      </ul>
      <h2>WisdomUp power banks and today’s prices</h2>
      <div data-list="power-banks" data-specs="Capacity,Fast charging"></div>
      <p>See all <a href="products.html?cat=power-banks">power banks</a>, or read how to <a href="article.html?p=charging-at-home-and-on-the-road">charge fast and safely at home and in the car</a>.</p>`,
  },
  {
    slug: 'add-bluetooth-to-car-stereo',
    cat: 'How-to',
    title: 'How to add Bluetooth to an old car stereo',
    seoTitle: 'How to Add Bluetooth to an Old Car Stereo',
    excerpt: 'No Bluetooth in your car? Two low-cost ways to stream music from your phone — an AUX Bluetooth receiver or an FM transmitter — and how to set each one up.',
    date: 'October 2026', iso: '2026-10-07', mins: 4, art: 'bank',
    bg: 'linear-gradient(120deg,#5a1208,#1a0503)',
    products: ['cz-06', 'cz-07', 'cz-08', 'cz-15'],
    body: `
      <p>Plenty of good cars on Pakistan’s roads have a stereo with no Bluetooth. You don’t need a new head unit: a small adapter streams music from your phone for a fraction of the price. Which one depends on one question.</p>
      <h2>Does your stereo have an AUX socket?</h2>
      <p>Look for a 3.5mm socket marked AUX on the stereo, the dashboard or inside the armrest.</p>
      <ul>
        <li><strong>Yes:</strong> use a Bluetooth receiver in the AUX socket. A cable connection gives the cleanest sound and never picks up radio interference. The CZ-07 Bluetooth 5.0 receiver ({price:cz-07}) makes any AUX car stereo or speaker wireless.</li>
        <li><strong>No:</strong> use an FM transmitter. It plugs into the car’s 12V socket (the cigarette lighter), receives your phone over Bluetooth and sends the sound to your radio on a free FM frequency.</li>
      </ul>
      <p>The CZ-06 ({price:cz-06}) can do both: it has a line-out for AUX and an FM output, plays music from a USB drive or TF card, and handles hands-free calls.</p>
      <h2>Setting up an FM transmitter</h2>
      <ol>
        <li>Plug it into the 12V socket and switch on the car.</li>
        <li>Tune your car radio to a frequency with only static — the ends of the FM band (near 87.5 or 108 MHz) are often free.</li>
        <li>Set the transmitter to the same frequency.</li>
        <li>Pair your phone over Bluetooth and play. If you hear hiss while driving through a city, move both to another empty frequency.</li>
      </ol>
      <p>The CZ-08 to CZ-15 transmitters also charge your phone: they take 12–24V (cars, vans and trucks) and have QC 3.0 fast charging with a USB-C port plus two USB-A ports.</p>
      <h2>Today’s prices</h2>
      <div data-list="car-bluetooth"></div>
      <p>See all <a href="products.html?cat=car-bluetooth">car Bluetooth &amp; FM</a> and <a href="products.html?dept=car">car accessories</a>.</p>`,
  },
  {
    slug: 'shaver-or-hair-clipper',
    cat: 'Buying guide',
    title: 'Electric shaver or hair clipper: which grooming tool do you need?',
    seoTitle: 'Electric Shaver vs Hair Trimmer: Which Do You Need?',
    excerpt: 'Shaver, trimmer or clipper? What each one does, foil vs rotary heads, and the battery and water-resistance numbers that matter, with today’s prices in Pakistan.',
    date: 'October 2026', iso: '2026-10-07', mins: 5, art: 'bank',
    bg: 'linear-gradient(120deg,#2a2622,#0d0c0b)',
    products: ['txd-03', 'txd-04', 'lfj-02', 'lfj-09'],
    body: `
      <p>Shavers and clippers look alike on a shelf but do different jobs. A <strong>shaver</strong> cuts hair at skin level for a smooth face. A <strong>hair clipper</strong> — many people call it a trimmer — cuts hair to a set length for haircuts, fades and beards.</p>
      <h2>Choose a shaver if you…</h2>
      <ul>
        <li>want a clean-shaven face without razors and foam;</li>
        <li>shave daily or every few days;</li>
        <li>want something quick to use before work.</li>
      </ul>
      <h2>Foil or rotary?</h2>
      <p><strong>Foil shavers</strong> move blades behind a thin metal foil in straight passes — close on cheeks and neck if you shave often. WisdomUp’s are the TXD-04 and the three-blade TXD-06. <strong>Rotary shavers</strong> have round heads that turn and flex to follow the jaw; the TXD-02, TXD-03, TXD-05 and TXD-07 are rotary, and the TXD-02 adds a pop-up sideburn trimmer.</p>
      <p>Every WisdomUp shaver is IPX6 water resistant and runs 60–100 minutes on a 1–2 hour charge.</p>
      <div data-list="shavers" data-specs="Runtime,Charging time,Water resistance"></div>
      <h2>Choose a hair clipper if you…</h2>
      <ul>
        <li>cut your own or your children’s hair at home;</li>
        <li>keep a beard at a set length;</li>
        <li>want fades and neat necklines between barber visits.</li>
      </ul>
      <p>Guide combs set the length: the LFJ-02, LFJ-04 and LFJ-08 come with four (3, 6, 10 and 13mm). The LFJ-01 to LFJ-08 clippers charge over Type-C and run 2.5–3 hours on 1,500–2,000mAh batteries. Want both jobs in one box? The LFJ-09 kit adds a facial shaver attachment and a charging base.</p>
      <div data-list="clippers" data-specs="Battery,Runtime"></div>
      <p>See all <a href="products.html?cat=shavers">shavers</a>, <a href="products.html?cat=clippers">hair clippers</a> and the full <a href="products.html?dept=care">personal care</a> range.</p>`,
  },
  {
    slug: 'open-ear-vs-true-wireless',
    cat: 'Buying guide',
    title: 'Open-ear or true wireless: which earbuds suit the way you listen?',
    excerpt: 'The OS open-ear and TS true wireless families solve different problems. Here is how to choose between them in under five minutes.',
    date: 'October 2026', mins: 5, art: 'buds',
    bg: 'linear-gradient(120deg,#3a0f12,#0d0505)',
    products: ['os-6', 'os-5', 'ts-11anc', 'ts-12'],
    body: `
      <p>Most people pick earbuds by price and battery life, then discover the fit is wrong for how they actually listen. WisdomUp makes two families for two different habits: <strong>OS open-ear</strong> earbuds that sit just outside the ear, and <strong>TS true wireless</strong> earbuds that seal inside it.</p>
      <h2>Choose open-ear (OS series) if you…</h2>
      <ul>
        <li><strong>Commute on bikes, rickshaws or busy roads</strong> and need to hear horns and traffic.</li>
        <li><strong>Wear earbuds for hours</strong> and dislike the pressure of ear tips.</li>
        <li><strong>Want the newest link</strong> — the OS-6 uses Bluetooth 6.0.</li>
      </ul>
      <p>The OS-6 pairs 13mm drivers with a 300mAh charging case, and the OS-5 steps up to larger 14.2mm drivers. Because nothing seals the ear canal, bass is lighter than in-ear buds and some sound escapes at high volume in quiet rooms.</p>
      <h2>Choose true wireless (TS series) if you…</h2>
      <ul>
        <li><strong>Want silence</strong> on flights, in offices or at home — the TS-11ANC has active noise cancelling.</li>
        <li><strong>Want the latest Bluetooth for less</strong> — the TS-12 and TS-13 also run Bluetooth 6.0.</li>
        <li><strong>Are buying on a budget</strong> — best sellers TS-2 and TS-4 give you about 20 hours of play.</li>
      </ul>
      <h2>Quick comparison</h2>
      <div class="kv"><b>OS-6 Open-Ear</b><span>Open-ear · Bluetooth 6.0 · 13mm drivers · {price:os-6}</span><b>OS-5 Open-Ear</b><span>Open-ear · 14.2mm drivers · {price:os-5}</span><b>TS-11ANC</b><span>Active noise cancelling · Bluetooth 6.0 · {price:ts-11anc}</span><b>TS-12</b><span>Bluetooth 6.0 · 13mm drivers · USB-C case · {price:ts-12}</span></div>
      <h2>Still unsure?</h2>
      <p>Every WisdomUp order has a <a href="returns.html">7-day money-back guarantee</a>, so you can try a pair at home. If the fit isn't right, send it back in its original condition and packaging.</p>`,
  },
  {
    slug: 'clean-audio-for-reels',
    cat: 'Creators',
    title: 'Clean audio for reels and vlogs with a clip-on wireless mic',
    excerpt: 'Viewers forgive shaky video but not bad sound. Five habits that make the MKF mics sound like a studio setup.',
    date: 'September 2026', mins: 4, art: 'speaker',
    bg: 'linear-gradient(120deg,#2a2622,#0d0c0b)',
    products: ['mkf-02', 'mkf-01'],
    body: `
      <p>Your phone's built-in mic hears everything in the room: the fan, the traffic, the echo off bare walls. A clip-on wireless mic moves the microphone to your collar, so your voice is louder than everything else. Here is how to get the most from the MKF-02 and MKF-01.</p>
      <h2>1. Clip it a hand's width below your chin</h2>
      <p>About 15–20 cm from your mouth, centred on your chest, gives a full voice without breathing noise. The MKF mics pick up all around (360°), so keep them away from rustling fabric.</p>
      <h2>2. Plug the receiver in before you open the camera</h2>
      <p>Connect the receiver to your phone first, then open your camera or recording app so it picks up the mic as the audio input. The transmitter and receiver pair themselves automatically.</p>
      <h2>3. Stay in sync</h2>
      <p>The 2.4GHz link has under 20ms of delay, so lips and voice line up on screen — no fixing it in the edit.</p>
      <h2>4. Pick the range you need</h2>
      <p>The MKF-02 reaches 15–20 m — plenty for talking-head videos and tutorials. The MKF-01 stretches to 20–25 m for walk-and-talk shots and events.</p>
      <h2>5. Keep your phone charged</h2>
      <p>Both receivers let your phone charge while you record, so long live streams don't end with a flat battery.</p>
      <p>Making content with WisdomUp gear? Have a look at our <a href="creators.html">Content Creators Program</a>.</p>`,
  },
  {
    slug: 'charging-at-home-and-on-the-road',
    cat: 'How-to',
    title: 'Fast, safe charging at your desk and in the car',
    excerpt: 'How to set up a 3-in-1 wireless charger, which wall charger and cable to pick, and the small habits that protect your batteries.',
    date: 'September 2026', mins: 4, art: 'bank-ice',
    bg: 'linear-gradient(120deg,#2c2d30,#0c0c0d)',
    products: ['cj-46', 'ocd-28', 'cc-16', 'cj-44'],
    body: `
      <p>Most people own more devices than chargers. A good setup means everything is full in the morning without a tangle of cables, and your phone keeps charging on the drive to work.</p>
      <h2>At your desk: one charger, three devices</h2>
      <p>The <strong>CJ-46</strong> 3-in-1 foldable magnetic charger charges your phone at up to 15W, your earbuds at 5W and your watch at 2.5W — and folds flat for travel. Thick or metal cases can slow wireless charging down.</p>
      <h2>At the wall: match the charger to the cable</h2>
      <p>For most new phones, a 20W PD charger is the sweet spot. The <strong>OCD-28</strong> has both a USB-C and a USB-A port and comes with the cable in the box — choose an EU 2-pin or UK 3-pin plug and a USB-C or Lightning cable.</p>
      <h2>In the car: fast charge on the move</h2>
      <p>The <strong>CC-16</strong> car charger delivers up to 33W over USB-C plus a fast USB-A port. Prefer wireless? The <strong>CJ-44</strong> magnetic car mount charges at up to 15W while it holds your phone.</p>
      <h2>Habits that protect your batteries</h2>
      <ul>
        <li>Keep chargers and phones out of direct sun on the dashboard — heat is the biggest enemy of battery life.</li>
        <li>Use a cable rated for fast charging; a cheap cable can halve your charging speed.</li>
        <li>Unplug the car charger before you start the engine if your car's socket stays powered.</li>
      </ul>
      <p>All WisdomUp chargers are covered by our <a href="warranty.html">brand warranty</a>.</p>`,
  },
  {
    slug: 'make-earbud-batteries-last',
    cat: 'Care',
    title: 'Six ways to make your earbuds’ battery last longer',
    excerpt: 'Simple habits that keep earbuds and neckbands going for years — from charging routines to keeping the case clean.',
    date: 'August 2026', mins: 3, art: 'phones',
    bg: 'linear-gradient(120deg,#5a1208,#1a0503)',
    products: ['ts-2', 'ej-ly7', 'ts-11anc', 'os-6'],
    body: `
      <p>Lithium batteries wear a little with every charge cycle. You can't stop that, but you can slow it down. These habits apply to every WisdomUp earbud and neckband.</p>
      <ol>
        <li><strong>Top up little and often.</strong> Batteries last longer when they aren't regularly run to 0%.</li>
        <li><strong>Avoid heat.</strong> Don't leave the case in a hot car or on a sunny windowsill.</li>
        <li><strong>Keep the contacts clean.</strong> Wipe the charging pins on the buds and inside the case with a dry cotton swab so they charge fully.</li>
        <li><strong>Close the case.</strong> Most buds switch off and charge when the lid is shut; left out, they keep looking for your phone.</li>
        <li><strong>Lower the volume a notch.</strong> It saves battery and your hearing.</li>
        <li><strong>Charge before long storage.</strong> If you won't use them for a while, store them at around half charge.</li>
      </ol>
      <p>If your battery life drops sharply within the warranty period, contact us — see our <a href="warranty.html">warranty policy</a> for what's covered.</p>`,
  },
];
