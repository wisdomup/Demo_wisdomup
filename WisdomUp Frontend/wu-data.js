// Shared WisdomUp storefront data (real catalogue names/prices from wisdomup.pk, Oct 2026).
window.WU_STORE = (function () {
  const P = (id, title, cat, price, was, meta, art, extra) => Object.assign({ id, title, cat, price, was, meta, art, rating: null, colors: [] }, extra || {});
  const products = [
    P('os4', 'OS-4 Open Stereo Earbuds', 'Earbuds', 6000, 6500, '40+ Hrs Battery | RGB Lights | IPX7', 'buds', { ribbon: 'Newly launched', rating: 5, colors: ['#1b1b1b'], tabs: ['new', 'best'], src: 'img/os4-hero.avif' }),
    P('os5', 'OS-5 Open Stereo Earbuds', 'Earbuds', 5800, 5999, 'Open-ear Fit | ENC Mic | Bluetooth 5.4', 'buds', { ribbon: 'Newly launched', rating: 5, colors: ['#EDE6DA'], tabs: ['new', 'trend'] }),
    P('ts10', 'TS-10 True Wireless Earbuds', 'Earbuds', 4800, 5500, 'ANC | 30 Hrs Playback | Touch Control', 'buds', { rating: 5, colors: ['#F2F2F2'], tabs: ['new', 'best'] }),
    P('mkf02', 'MKF-02 Wireless Mic', 'Microphones', 3750, null, 'Dual Mic | Noise Reduction | Type-C + Lightning', 'speaker', { ribbon: 'Creator pick', colors: ['#1b1b1b'], tabs: ['new', 'trend'] }),
    P('mkf01', 'MKF-01 Wireless Mic', 'Microphones', 11250, null, 'Studio Receiver | 100m Range | Live Monitoring', 'speaker', { colors: ['#1b1b1b'], tabs: ['new'] }),
    P('os3', 'OS-3 Open Stereo Earbuds', 'Earbuds', 6700, 6900, 'Open-ear | Ambient LED | 35 Hrs', 'buds', { rating: 4, colors: ['#1b1b1b'], tabs: ['best', 'trend'] }),
    P('os2', 'OS-2 Open Stereo Earbuds', 'Earbuds', 6300, 6800, 'Crystal Case | Open-ear | ENC', 'buds', { colors: ['#1b1b1b'], tabs: ['best'] }),
    P('os1', 'OS-1 Open Stereo Earbuds', 'Earbuds', 5500, 5999, 'Open-ear | Gold Accent | 30 Hrs', 'buds', { colors: ['#1b1b1b', '#C9A24A'], tabs: ['trend'] }),
    P('ts11', 'TS-11 True Wireless Earbuds', 'Earbuds', 5800, 6900, 'ENC Quad Mic | Low Latency | 32 Hrs', 'buds', { rating: 5, colors: ['#F2F2F2'], tabs: ['best'] }),
    P('ts8', 'TS-8 True Wireless Earbuds', 'Earbuds', 5250, 6500, 'Hybrid ANC | Wireless Charging', 'buds', { colors: ['#F2F2F2'], tabs: ['trend'] }),
    P('ts9', 'TS-9 True Wireless Headset', 'Earbuds', 4700, 7000, 'Deep Bass | 28 Hrs | Fast Charge', 'buds', { ribbon: '33% off', colors: ['#F2F2F2'], tabs: ['best', 'trend'] }),
    P('ts5', 'TS-5 True Wireless Earbuds', 'Earbuds', 4200, 4500, 'Touch Control | 24 Hrs | IPX5', 'buds', { colors: ['#F2F2F2'] }),
    P('ts3', 'TS-3 True Wireless Earbuds', 'Earbuds', 3600, 3999, 'Bluetooth 5.3 | 20 Hrs | Compact Case', 'buds', { colors: ['#F2F2F2'] }),
    P('ts4', 'TS-4 True Wireless Earbuds', 'Earbuds', 2700, 3000, 'Lightweight | 18 Hrs | Type-C', 'buds', { colors: ['#F2F2F2'], soldOut: true }),
    P('ts2', 'TS-2 True Wireless Earbuds', 'Earbuds', 2250, 2500, 'Everyday Buds | 16 Hrs', 'buds', { colors: ['#F2F2F2'], soldOut: true }),
    P('cc16', 'CC-16 Dual Smart Car Charger', 'Chargers', 3000, null, 'Dual Port | PD Fast Charge | Voltage Display', 'bank', { colors: ['#1b1b1b'], tabs: ['trend'] }),
    P('cc14', 'CC-14 USB + Type-C Car Charger', 'Chargers', 2250, null, 'USB-A + Type-C | 38W Total', 'bank', { colors: ['#1b1b1b'] }),
    P('cj45', 'CJ-45 15W Wireless Charger', 'Chargers', 9000, null, '15W Wireless | 3-in-1 Stand', 'bank-ice', { colors: ['#F2F2F2'], tabs: ['best'] }),
    P('cj44', 'CJ-44 Magnetic Wireless Charger', 'Chargers', 7500, null, 'Magnetic | 15W | Foldable', 'bank-ice', { colors: ['#F2F2F2'] }),
    P('ejly5', 'EJ-LY5 Wireless Neckband', 'Neckbands', 2250, null, 'Magnetic Buds | 40 Hrs | Vibration Alert', 'phones', { colors: ['#1b1b1b'] }),
    P('ejly4', 'EJ-LY4 Wireless Neckband', 'Neckbands', 2260, null, 'Deep Bass | 30 Hrs | Sports Fit', 'phones', { colors: ['#1b1b1b'], soldOut: true }),
    P('aip33', 'Aiplus 33 Wireless Neckband', 'Neckbands', 2930, null, 'ENC | 45 Hrs | Fast Charge', 'phones', { colors: ['#1b1b1b'] }),
    P('thunder', 'Thunder Pro Speaker', 'Speakers', 12995, 15995, 'RGB LED Lights | Custom EQ | IPX6', 'speaker', { ribbon: 'Newly launched', rating: 5, colors: ['#5C3FA8', '#1b1b1b'], tabs: ['new', 'best'] }),
  ];
  const rs = n => n == null ? null : 'Rs.' + n.toLocaleString('en-PK');
  products.forEach(p => { p.priceText = rs(p.price); p.wasText = rs(p.was); p.off = p.was ? Math.round((1 - p.price / p.was) * 100) + '% off' : null; p.tabs = p.tabs || []; });
  return {
    rs,
    products,
    byId: id => products.find(p => p.id === id),
    cats: [
      { icon: 'watch', label: 'Smart Watches' }, { icon: 'buds', label: 'Earbuds' }, { icon: 'phones', label: 'Headphones' },
      { icon: 'speaker', label: 'Speakers' }, { icon: 'plug', label: 'Chargers' }, { icon: 'mic', label: 'Microphones' },
      { icon: 'cable', label: 'Neckbands' }, { icon: 'bank', label: 'Power Banks' },
    ],
    circles: [['Earbuds', 'buds'], ['Speakers', 'speaker'], ['Headphones', 'phones'], ['Microphones', 'speaker'], ['Wireless Chargers', 'bank-ice'], ['Car Chargers', 'bank']],
    utility: [{ label: 'Live Shopping', tone: 'gold' }, { label: 'Bulk Order' }, { label: 'Corporate Order' }, { label: 'Express Delivery' }, { label: 'Order Tracker' }, { label: 'Help Center' }],
    trust: [{ icon: 'truck', label: 'Fast, free shipping\nover Rs.40,000' }, { icon: 'smile', label: '30-day money-back\nguarantee' }, { icon: 'medal', label: 'Hassle-free\nwarranty' }, { icon: 'shield', label: 'Lifetime customer\nsupport' }],
    faqs: [
      ['What is your return policy?', 'We offer a 30-day return policy from the date of delivery.\nProducts must be in original condition and packaging.\nTo start a return, contact support with your order details.'],
      ['How long does shipping take?', 'Standard shipping takes 3–5 working days within Pakistan.\nExpress delivery arrives in 1–2 working days.\nOrders above Rs.40,000 ship free.'],
      ['Do your products come with a warranty?', 'Every WisdomUp product has at least a 6-month warranty.\nPremium products carry up to 2 years.\nWarranty covers manufacturing defects and hardware failures.'],
      ['Are your earbuds compatible with iOS and Android?', 'Yes — all Bluetooth earbuds and headphones pair with iOS, Android, Windows, macOS and other Bluetooth devices.'],
      ['What payment methods do you accept?', 'Visa and MasterCard, JazzCash, EasyPaisa, bank transfer and Cash on Delivery.'],
    ],
    footer: [
      { title: 'Products', links: ['All Items', 'Audio & Sound', 'Powerbanks', 'Charging Devices', 'Car Electronics', 'Smart Life Devices', 'Creator Tools'] },
      { title: 'Explore', links: ['Bulk Order', 'Corporate Order', 'Content Creators Program', 'Live Shopping', 'About Us', 'Where to Buy', 'Blog'] },
      { title: 'Support', links: ['Smart Help Center', 'Order Tracker', 'Exchange & Refund Policy', 'Warranty Policy', 'Shipping Policy', 'Download e-Manual'] },
    ],
    contact: { phone: '+92 327 9800153', email: 'support@wisdomup.pk', hours: 'Mon–Sun, 10 AM – 6 PM' },
    lifestyle: [
      { slotId: 'hero-thunder', pid: 'thunder', kicker: 'Sales live · Party speaker', name: 'THUNDER PRO', line: 'RGB LED Lights | Custom EQ | IPX6', ctaLabel: 'Shop now · Rs.12,995', src: 'img/hero-slide-web.png', hint: 'Lifestyle photo — friends at a party with Thunder Pro' },
      { slotId: 'hero-os4', pid: 'os4', kicker: 'Newly launched · Open stereo', name: 'OS-4', line: '40+ Hrs Battery | RGB Lights | IPX7', ctaLabel: 'Shop now · Rs.6,000', src: 'img/os4-hero.avif', hint: 'Lifestyle photo — runner wearing OS-4 outdoors' },
      { slotId: 'hero-ts10', pid: 'ts10', kicker: 'Active noise cancelling', name: 'TS-10', line: 'ANC | 30 Hrs Playback | Touch Control', ctaLabel: 'Shop now · Rs.4,800', hint: 'Lifestyle photo — commuter wearing TS-10' },
      { slotId: 'hero-mkf02', pid: 'mkf02', kicker: 'Creator pick · Wireless mic', name: 'MKF-02', line: 'Dual Mic | Noise Reduction | Type-C + Lightning', ctaLabel: 'Shop now · Rs.3,750', hint: 'Lifestyle photo — creator filming with MKF-02' },
      { slotId: 'hero-cj45', pid: 'cj45', kicker: '3-in-1 stand · 15W', name: 'CJ-45', line: '15W Wireless | 3-in-1 Stand', ctaLabel: 'Shop now · Rs.9,000', hint: 'Lifestyle photo — desk setup charging on CJ-45' },
    ],
    media: ['radial-gradient(80% 90% at 50% 40%,#e0523a,#8c1c10)', 'radial-gradient(80% 90% at 50% 40%,#5372c9,#101d4a)', 'radial-gradient(80% 90% at 50% 40%,#3f8f86,#0d2a27)', 'radial-gradient(80% 90% at 50% 40%,#6b5a48,#1d1712)'],
  };
})();
