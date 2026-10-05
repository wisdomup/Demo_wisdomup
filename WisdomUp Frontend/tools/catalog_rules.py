"""WisdomUp catalogue rules: how supplier sheet rows become English retail products.

Everything a merchandiser might want to change lives here: departments and types,
which rows are sold in Pakistan, the price rule, variant grouping and hand-written
English titles/highlights for products whose sheet text is free-form Chinese.
"""
import re

# ---------- Price rule (PKR) ----------
# Retail price = sheet price (RMB) × 4 × 45. Whole rupees, no charm rounding.
RMB_TO_PKR = 4 * 45


def pkr(rmb):
    return int(round(float(rmb) * RMB_TO_PKR))


# ---------- Departments → types (a type may appear in more than one department) ----------
DEPARTMENTS = [
    ('audio', 'Audio', ['earbuds', 'neckbands', 'headphones', 'handsfree', 'speakers', 'microphones']),
    ('charging', 'Charging', ['wall-chargers', 'power-banks', 'wireless-chargers', 'car-chargers', 'power-strips']),
    ('cables', 'Cables & Adapters', ['charging-cables', 'audio-cables', 'adapters', 'hdmi', 'bt-receivers']),
    ('car', 'Car Accessories', ['car-holders', 'car-chargers', 'car-bluetooth', 'wireless-chargers']),
    ('stands', 'Stands & Mounts', ['stands', 'bike-mounts', 'selfie-sticks']),
    ('computer', 'Computer', ['keyboards', 'mice', 'mouse-pads']),
    ('storage', 'Storage', ['memory-cards', 'usb-drives', 'card-readers']),
    ('care', 'Personal Care', ['shavers', 'clippers']),
]

# type id: (label, singular noun for copy, fallback art, card spec keys in priority order)
TYPES = {
    'earbuds': ('Wireless Earbuds', 'earbuds', 'buds'),
    'neckbands': ('Neckbands', 'neckband', 'phones'),
    'headphones': ('Headphones', 'headphones', 'phones'),
    'handsfree': ('Handsfree', 'handsfree', 'buds'),
    'speakers': ('Speakers', 'speaker', 'speaker'),
    'microphones': ('Microphones', 'microphone', 'speaker'),
    'wall-chargers': ('Wall Chargers', 'charger', 'bank'),
    'power-banks': ('Power Banks', 'power bank', 'bank'),
    'wireless-chargers': ('Wireless Chargers', 'wireless charger', 'bank-ice'),
    'car-chargers': ('Car Chargers', 'car charger', 'bank'),
    'power-strips': ('Power Strips & Adapters', 'power strip', 'bank'),
    'charging-cables': ('Charging Cables', 'cable', 'bank'),
    'audio-cables': ('AUX & Audio Cables', 'cable', 'bank'),
    'adapters': ('Adapters & OTG', 'adapter', 'bank'),
    'hdmi': ('HDMI Cables', 'cable', 'bank'),
    'bt-receivers': ('Bluetooth Receivers', 'receiver', 'bank'),
    'car-holders': ('Car Phone Holders', 'holder', 'bank'),
    'car-bluetooth': ('Car Bluetooth & FM', 'transmitter', 'bank'),
    'stands': ('Phone & Laptop Stands', 'stand', 'bank'),
    'bike-mounts': ('Bike & Motorbike Mounts', 'mount', 'bank'),
    'selfie-sticks': ('Selfie Sticks', 'selfie stick', 'bank'),
    'keyboards': ('Keyboard & Mouse Sets', 'set', 'bank'),
    'mice': ('Mice', 'mouse', 'bank'),
    'mouse-pads': ('Mouse Pads', 'mouse pad', 'bank'),
    'memory-cards': ('Memory Cards', 'memory card', 'bank'),
    'usb-drives': ('USB Flash Drives', 'flash drive', 'bank'),
    'card-readers': ('Card Readers', 'card reader', 'bank'),
    'shavers': ('Shavers', 'shaver', 'bank'),
    'clippers': ('Hair Clippers', 'clipper', 'bank'),
}

# Sheet product name (Chinese) → type. Codes can override (CODE_TYPE).
NAME_TYPE = {
    '蓝牙耳机': 'earbuds', '挂耳式耳机': 'earbuds', '挂脖耳机': 'neckbands', '大耳机': 'headphones',
    '耳机': 'handsfree', '有线耳机': 'handsfree', '音响': 'speakers', '大音箱': 'speakers', '麦克风': 'microphones',
    '充电器套装(欧规)': 'wall-chargers', '充电器套装(英规)': 'wall-chargers', '充电头(欧规)': 'wall-chargers',
    '移动电源': 'power-banks', '车充': 'car-chargers', '排插': 'power-strips', '电源适配器': 'power-strips',
    '磁吸车载无线充': 'wireless-chargers', '三轴联动感应车载无线充': 'wireless-chargers', '磁吸折叠立式三合一无线充': 'wireless-chargers',
    '数据线': 'charging-cables', '音频线': 'audio-cables', '音频转接线': 'adapters', '转接头': 'adapters',
    '2米HDMI 线': 'hdmi', '3米HDMI 线': 'hdmi', 'HDMI 线': 'hdmi', '蓝牙适配器': 'bt-receivers',
    '汽车支架': 'car-holders', '车载蓝牙': 'car-bluetooth', '桌面支架': 'stands', '笔记本支架': 'stands', '三合一支架': 'stands',
    '自行车摩托车支架': 'bike-mounts', '自拍杆': 'selfie-sticks',
    '有线键鼠套装': 'keyboards', '2.4G无线套装': 'keyboards', '有线发光套装': 'keyboards', '蓝牙套装': 'keyboards',
    '鼠标': 'mice', '鼠标垫': 'mouse-pads', '内存卡': 'memory-cards', 'USB': 'usb-drives', '读卡器': 'card-readers',
    '剃须刀': 'shavers', '理发器': 'clippers',
}
CODE_TYPE = {'YP-08': 'audio-cables', 'YP-12': 'audio-cables'}

# Not sold in Pakistan: US and Argentina plug chargers. Rows without a price are skipped too.
SKIP_NAMES = {'充电器套装(美规)', '充电头(美规)', '充电器（阿根廷规）'}

# ---------- Variant grouping ----------
CABLE_SUFFIX = {  # SJX cables and charger-set cables: suffix → connector
    'T': 'USB-A to USB-C', 'P': 'USB-A to Lightning', 'V': 'USB-A to Micro-USB',
    'CC': 'USB-C to USB-C', 'CL': 'USB-C to Lightning',
}
SET_CABLE = {'T': 'USB-C', 'P': 'Lightning (iPhone)', 'V': 'Micro-USB'}
CABLE_ORDER = ['USB-C to USB-C', 'USB-A to USB-C', 'USB-C to Lightning', 'USB-A to Lightning', 'USB-A to Micro-USB']
SET_CABLE_ORDER = ['USB-C', 'Lightning (iPhone)', 'Micro-USB']

# UK charger sets mirror EU models 26–33 one-for-one (YCD-04 = OCD-26 … YCD-11 = OCD-33).
def uk_to_eu(n):
    return n + 22

# Products that differ only by length (same family)
LENGTH_FAMILIES = {'YP-29': 'YP-28', 'YP-31': 'YP-30'}


# ---------- Hand-written English titles (after the model code) + highlights ----------
# Used where the sheet text is free-form; everything else is generated from parsed specs.
T = {
    # Speakers
    'YX-08': ('30W Fabric Bluetooth Speaker', ['Ambient light ring', 'TWS pairing for stereo', 'Hands-free calls', 'TF card and USB playback']),
    'YX-09': ('6.5W Mini Speaker with RGB Lights', ['RGB light show', 'Carry handle', 'TWS pairing for stereo', 'TF card and USB playback']),
    'YX-10': ('5W Mini Bluetooth Speaker', ['Metal grille', 'Ambient light', 'TWS pairing for stereo', 'TF card playback']),
    'YX-11': ('5W Mini Bluetooth Speaker', ['Compact, travel-friendly size', 'TWS pairing for stereo', 'TF card playback']),
    'YX-12': ('15W Bluetooth Speaker', ['Dual drivers', 'Metal grille', 'TWS pairing for stereo', 'TF card and USB playback']),
    'YX-13': ('10W Fabric Bluetooth Speaker', ['Fabric finish', 'Hands-free calls', 'AUX, TF card and USB input', 'TWS pairing for stereo']),
    'YX-14': ('80W Portable Party Speaker', ['12,000mAh battery', 'Woofer plus dual tweeters', 'Type-C charging']),
    'YX-15': ('80W Portable Bluetooth Speaker', ['16+ hours at 50% volume', '12,000mAh battery', 'Woofer plus dual tweeters']),
    'YX-16': ('100W Portable Party Speaker', ['12,000mAh battery', '9 hours at 50% volume', 'Type-C charging']),
    'YX-17': ('100W Portable Bluetooth Speaker', ['Dual woofers plus dual tweeters', '8,000mAh battery', 'Type-C charging']),
    'YX-18': ('40W Portable Bluetooth Speaker', ['External-magnet driver', '18m+ Bluetooth range', 'Type-C charging']),
    'YX-19': ('8-inch Party Speaker with Lights', ['8-inch woofer', 'Colour-changing lights', 'Bluetooth, USB, TF card and FM radio']),
    'YX-21': ('6.5-inch Party Speaker with Display', ['Mic input for karaoke', 'Display and remote control', 'Bluetooth, USB, TF, AUX and FM']),
    'YX-22': ('6.5-inch Karaoke Party Speaker', ['Woofer plus 1-inch tweeter', 'Mic input for karaoke', 'Bluetooth, USB, TF, AUX and FM']),
    'YX-23': ('8-inch Karaoke Party Speaker', ['8-inch woofer plus 1-inch tweeter', 'Mic input for karaoke', 'Bluetooth, USB, TF, AUX and FM']),
    'YX-24': ('Dual 6.5-inch Party Speaker', ['Two 6.5-inch woofers', 'Display and remote control', 'Mic input for karaoke']),
    'YX-26': ('250W Portable Party Speaker', ['250W peak output', '12,000mAh battery', 'Woofer plus dual tweeters']),
    'YX-27': ('100W Portable Bluetooth Speaker', ['6,000mAh battery', 'Separate woofer and tweeter', 'Type-C charging']),
    'YX-28': ('150W Party Speaker with RGB Lights', ['18,000mAh battery', 'Dual woofers plus dual tweeters', 'TWS pairing for stereo']),
    'YX-29': ('350W Party Speaker', ['350W peak output', '18,000mAh battery', 'Dual 120mm woofers']),
    'YX-30': ('5W Mini Bluetooth Speaker', ['Pocket-sized', 'Choice of colours', 'Bluetooth 5.3']),
    'YX-31': ('220W Party Speaker with LED Lights', ['5-driver system', 'Bluetooth, USB, TF and AUX', 'Fast charging']),
    # Headphones
    'TDE-03': ('Wireless Headphones', ['Over-ear comfort', 'Bluetooth 5.0', 'Long standby']),
    'TDE-06': ('Wired Headphones', ['3.5mm plug', '1.2m cable', 'Over-ear comfort']),
    'TDE-08': ('USB-C Wired Headphones', ['USB-C plug', 'Black, apricot or grey']),
    'TDE-10': ('Wired Headphones', ['3.5mm plug', '1.2m cable', 'Over-ear comfort']),
    'TDE-11': ('RGB Gaming Headset with Mic', ['50mm drivers', 'Breathing multi-colour lights', 'Omnidirectional mic', '2m cable']),
    'TDE-12': ('RGB Gaming Headset with Mic', ['50mm drivers', 'Static RGB lights', 'Omnidirectional mic', '2m cable']),
    'TDE-13': ('Dynamic RGB Gaming Headset', ['50mm drivers', 'Dynamic RGB lights', 'Omnidirectional mic', '2m cable']),
    'TDE-14': ('Dynamic RGB Gaming Headset', ['50mm drivers', 'Dynamic RGB lights', 'Omnidirectional mic', '2m cable']),
    'TDE-15': ('Gaming Headset with Mic', ['40mm drivers', 'Omnidirectional mic', '3.5mm audio + mic plugs']),
    'TDE-16': ('Wireless Headphones', ['Bluetooth 5.4', 'About 10 hours of play', '120-hour standby']),
    'TDE-17': ('Wireless Headphones', ['Bluetooth 5.4', 'About 10 hours of play', '120-hour standby']),
    'TDE-18': ('ANC Wireless Headphones', ['Active noise cancelling', 'About 40 hours of play', 'Premium microphone']),
    'TDE-19': ('Wireless Headphones', ['Bluetooth 5.4', '8–10 hours of play', '120-hour standby']),
    'TDE-20': ('Wireless Headphones with Lights', ['Built-in lights', 'Bluetooth 5.4', '8–10 hours of play']),
    'TDE-21': ('Wireless Headphones', ['Bluetooth 6.0', 'About 15 hours of play', '120-hour standby']),
    'TDE-22': ('Wireless Headphones', ['Bluetooth 5.3', '10–15m range']),
    'TDE-23': ('Wireless Gaming Headphones', ['Gaming design', 'About 15 hours of play', 'Bluetooth 6.0']),
    'TDE-24': ('Wireless Headphones', ['About 10 hours of play', 'Bluetooth 6.0', '120-hour standby']),
    'TDE-25': ('Wireless Headphones with Metal Headband', ['Metal headband', 'About 15 hours of play', 'Bluetooth 6.0']),
    'TDE-26': ('Wired Headphones', ['40mm drivers', '1.2m cable', 'Over-ear comfort']),
    'TDE-27': ('Wired Headphones', ['40mm drivers', '1.2m cable', 'Over-ear comfort']),
    # Microphones
    'MKF-01': ('Wireless Clip-On Microphone', ['2.4GHz link with auto pairing', 'Under 20ms latency', '20–25m range', 'Charge your phone while recording']),
    'MKF-02': ('Wireless Clip-On Microphone', ['2.4GHz link with auto pairing', 'Under 20ms latency', '15–20m range', 'Charge your phone while recording']),
    # Car chargers
    'CC-01': ('Dual USB Car Charger', ['Two USB-A ports', '12–24V cars and trucks']),
    'CC-08': ('Dual USB Car Charger', ['Two USB-A ports', '3.1A total output']),
    'CC-09': ('Dual USB Fast Car Charger', ['QC fast charging', 'Two USB-A ports']),
    'CC-10': ('Dual USB Fast Car Charger', ['QC fast charging', 'Two USB-A ports']),
    'CC-11': ('Dual USB Fast Car Charger', ['QC fast charging', 'Two USB-A ports']),
    'CC-12': ('Dual USB Fast Car Charger', ['QC fast charging', 'Two USB-A ports']),
    'CC-13': ('USB + USB-C Fast Car Charger', ['20W PD on USB-C', '18W QC on USB-A']),
    'CC-14': ('30W PD USB + USB-C Car Charger', ['30W PD on USB-C', '18W QC on USB-A']),
    'CC-15': ('Car Charger with Built-in Cable', ['Built-in fast-charge cable', 'Extra USB-A port']),
    'CC-16': ('33W PD USB + USB-C Car Charger', ['33W PD on USB-C', 'Fast charging on USB-A']),
    # Power banks
    'CDB-10': ('10000mAh Power Bank with 4 Built-in Cables', ['Four built-in cables', 'USB-C and Micro-USB input']),
    'CDB-13': ('10000mAh Power Bank with 4 Built-in Cables', ['Four built-in cables', 'USB-C and Micro-USB input']),
    'CDB-16': ('Mini 10000mAh 22.5W Power Bank', ['Two built-in fast cables', 'Compact size']),
    'CDB-17': ('10000mAh 22.5W Power Bank', ['Two built-in fast cables', '22.5W fast charging']),
    'CDB-18': ('10000mAh Magnetic Wireless Power Bank', ['15W magnetic wireless charging', 'Built-in watch charger', 'Fold-out metal stand']),
    'CDB-19': ('10000mAh 22.5W Power Bank with Display', ['Live power display', 'Built-in cable']),
    'CDB-21': ('10000mAh Power Bank with 4 Built-in Cables', ['Four built-in cables', 'No extra cable needed']),
    'CDB-22': ('5000mAh Capsule Power Bank', ['Plugs straight into your phone', 'Pocket-sized']),
    'CDB-23': ('10000mAh 22.5W Power Bank with 3 Cables', ['Three built-in fast cables', '22.5W fast charging']),
    'CDB-24': ('10000mAh 22.5W Power Bank with Wall Plug', ['Fold-out wall plug', 'Built-in cable']),
    # Wireless chargers
    'CJ-44': ('15W Magnetic Car Wireless Charger', ['Magnetic phone mount', '15W wireless charging']),
    'CJ-45': ('15W Auto-Clamp Car Wireless Charger', ['Motorised 3-axis clamp', '15W wireless charging']),
    'CJ-46': ('3-in-1 Foldable Magnetic Wireless Charger', ['Phone 15W · earbuds 5W · watch 2.5W', 'Folds flat for travel']),
    # Power strips and plug adapters
    'SPQ-01': ('Plug Adapter', ['100–240V input']),
    'SPQ-02': ('Universal Plug Adapter', ['Copper contacts', '110–250V']),
    'SPQ-03': ('Universal Travel Adapter', ['Works in most countries', '100–240V input']),
    'SPQ-04': ('Universal Travel Adapter', ['100–240V input']),
    'SPQ-06': ('4-Socket Power Strip with 6 USB', ['3000W max load', '5V/3.4A shared USB output', 'Fire-retardant shell']),
    'SPQ-08': ('6-Socket Power Strip with USB-C', ['3000W max load', '18W USB-C and QC 3.0 USB-A']),
    'SPQ-09': ('4-Socket Power Strip with USB-C', ['3500W max load', '18W USB-C and QC 3.0 USB-A']),
    # Adapters, audio, HDMI, readers, Bluetooth
    'YP-04': ('Lightning to Lightning + 3.5mm Adapter', ['Charge and listen at the same time', 'For iPhone']),
    'YP-05': ('Lightning to 3.5mm Audio Adapter', ['Use 3.5mm earphones with iPhone']),
    'YP-06': ('Dual Lightning Splitter', ['Charge and listen at the same time', 'For iPhone']),
    'YP-07': ('Lightning to USB OTG Adapter', ['Connect USB drives, cameras and keyboards to iPhone']),
    'YP-08': ('Lightning to AUX Car Cable', ['Aluminium shell', 'Braided cable', 'For iPhone']),
    'YP-09': ('USB-C to USB-C + 3.5mm Adapter', ['Charge and listen at the same time', 'Android, iOS and Windows']),
    'YP-10': ('USB-C Dual Splitter', ['Charge and listen at the same time', 'Android, iOS and Windows']),
    'YP-11': ('USB-C to 3.5mm Audio Adapter', ['Use 3.5mm earphones with USB-C phones']),
    'YP-12': ('USB-C to AUX Car Cable', ['Aluminium shell', 'Android, iOS and Windows']),
    'YP-13': ('USB-C to USB OTG Adapter', ['Connect USB drives and keyboards to USB-C devices']),
    'YP-22': ('Micro-USB to Lightning Adapter', ['Charge an iPhone with a Micro-USB cable']),
    'YP-25': ('USB-A to USB-C Adapter', ['USB 2.0']),
    'YP-01': ('3.5mm AUX Cable', ['3.5mm to 3.5mm']),
    'YP-03': ('3.5mm AUX Cable', ['3.5mm to 3.5mm']),
    'YP-14': ('3.5mm AUX Cable, 90° Plug', ['Rotating 90° plug']),
    'YP-15': ('3.5mm AUX Cable, 2m', ['2m long']),
    'YP-16': ('3.5mm AUX Cable', ['3.5mm to 3.5mm']),
    'YP-17': ('3.5mm AUX Cable', ['3.5mm to 3.5mm']),
    'YP-27': ('USB-C to HDMI 4K Adapter', ['4K at 30Hz', 'Aluminium shell, gold-plated plugs']),
    'YP-28': ('USB-C to HDMI 4K Cable', ['4K at 30Hz', 'Aluminium shell, gold-plated plugs']),
    'YP-30': ('HDMI to HDMI Cable', ['1080p', 'Gold-plated plugs']),
    'YP-32': ('USB-C / USB-A Card Reader', ['SD and microSD slots', 'Extra USB-A port']),
    'YP-33': ('Lightning / USB-C Card Reader', ['SD and microSD slots', 'Extra USB-A port', 'For iPhone and USB-C']),
    'CZ-07': ('Bluetooth 5.0 Audio Receiver', ['Makes any AUX speaker or car stereo wireless', 'Zinc alloy shell']),
    'CZ-11': ('Bluetooth 5.0 USB Adapter', ['Adds Bluetooth to a PC or laptop']),
    'CZ-06': ('Car Bluetooth Receiver with FM', ['Hands-free calls', 'USB and TF card playback', 'FM and line-out']),
    'CZ-08': ('Car Bluetooth FM Transmitter & Charger', ['QC 3.0 fast charging', 'USB-C + 2 USB-A ports']),
    'CZ-09': ('Car Bluetooth FM Transmitter & Charger', ['QC 3.0 fast charging', 'USB-C + 2 USB-A ports']),
    'CZ-10': ('Car Bluetooth FM Transmitter & Charger', ['QC 3.0 fast charging', 'USB-C + 2 USB-A ports']),
    'CZ-12': ('Car Bluetooth FM Transmitter & Charger', ['QC 3.0 fast charging', 'USB-C + 2 USB-A ports']),
    'CZ-13': ('Car Bluetooth FM Transmitter & Charger', ['QC 3.0 fast charging', 'USB-C + 2 USB-A ports']),
    'CZ-14': ('Car Bluetooth FM Transmitter & Charger', ['QC 3.0 fast charging', 'USB-C + 2 USB-A ports']),
    'CZ-15': ('Car Bluetooth FM Transmitter & Charger', ['QC 3.0 fast charging, up to 20W', 'USB-C + 2 USB-A ports']),
    # Car holders
    'CJ-01': ('One-Touch Car Phone Holder', ['Fits phones 58–92mm wide', 'Silicone grip']),
    'CJ-02': ('One-Touch Car Phone Holder', ['Fits phones 55–95mm wide', 'Silicone grip']),
    'CJ-03': ('Universal Clamp Car Phone Holder', ['Fits phones 55–95mm wide']),
    'CJ-04': ('Universal Clamp Car Phone Holder', ['Fits phones 53–95mm wide', 'Silicone grip']),
    'CJ-05': ('One-Touch Car Phone Holder', ['Fits phones 58–92mm wide', 'Silicone grip']),
    'CJ-10': ('Magnetic Dashboard Phone Holder', ['Eight magnets', 'Fits 4–7.2-inch phones', 'Zinc alloy, residue-free adhesive']),
    'CJ-12': ('Mini Magnetic Phone Mount', ['Slim bar design', 'Stick anywhere', 'Zinc alloy']),
    'CJ-15': ('Gravity Air-Vent Phone Holder', ['Arms close when you place the phone', '360° ball joint', 'Four-point vent clip']),
    'CJ-17': ('Magnetic Air-Vent Phone Holder', ['360° rotation', 'Extended vent clip']),
    'CJ-18': ('Gravity Car Phone Holder', ['Arms close when you place the phone']),
    'CJ-24': ('Mini Magnetic Car Mount', ['Aluminium alloy', '360° rotation', 'Residue-free adhesive']),
    'CJ-34': ('Dashboard Clip Phone Holder', ['Portrait or landscape', 'Charge while mounted', 'Quiet, rattle-free']),
    'CJ-38': ('Magnetic Dashboard Holder', ['MagSafe-style magnetic hold', 'Suction-cup base', 'Magnetic ring included for other phones']),
    'CJ-39': ('Gravity Air-Vent Holder with Hook Clip', ['Hook clip locks onto the vent', '360° ball joint']),
    'CJ-40': ('Magnetic Air-Vent Holder with Hook Clip', ['Extended hook clip', 'Magnetic ring included for other phones']),
    'CJ-41': ('Gravity Dashboard Phone Holder', ['Suction-cup base', 'One-hand operation']),
    'CJ-47': ('Vacuum Suction Magnetic Car Holder', ['Suction-cup base', 'Strong magnets', 'For iPhone 12 and newer']),
    'CJ-48': ('Magnetic Car Phone Holder', ['Strong magnets', 'For iPhone 12 and newer']),
    'CJ-49': ('Extendable Magnetic Car Holder', ['Extendable base', 'Strong magnets']),
    'CJ-50': ('Foldable Magnetic Car Holder', ['360° rotation', 'Folds flat', 'Gel base']),
    'CJ-51': ('Foldable Magnetic Car Holder', ['360° rotation', 'Folds flat', 'Gel base']),
    'CJ-52': ('Double-Sided Magnetic Car Holder', ['Magnets on both sides', '360° rotation', 'Folds flat']),
    'CJ-53': ('Foldable Magnetic Car Holder', ['360° rotation', 'Folds flat', 'Jelly-gel base']),
    'CJ-54': ('Foldable Magnetic Car Holder', ['360° rotation', 'Folds flat']),
    'CJ-55': ('3-Axis Foldable Magnetic Car Holder', ['3-axis adjustment', '360° rotation', 'Gel base']),
    # Stands and mounts
    'CJ-06': ('Foldable Telescopic Phone Stand', ['Extends and folds flat', 'Silicone non-slip pads', 'Charge while standing']),
    'CJ-36': ('Foldable Desk Phone Stand', ['Steel base', 'Non-slip pad']),
    'CJ-37': ('Foldable Desk Phone Stand', ['Weighted base', 'Charge while standing', 'Adjustable angle']),
    'CJ-42': ('Aluminium Desk Phone Stand', ['Aluminium panel and arm', 'Steel base']),
    'CJ-33': ('Adjustable Laptop & Tablet Stand', ['Raises and folds', '360° swivel base', 'Fits all iPads']),
    'CJ-43': ('3-in-1 Book, Tablet & Laptop Stand', ['Folding arm', 'Steel base']),
    'CJ-29': ('Waterproof Bike Phone Bag Mount', ['Rain and dust proof', 'Touch-through window', '360° rotation']),
    'CJ-30': ('Motorbike Mirror Phone Mount', ['Mounts on the mirror stem', 'One-hand auto lock', 'Shock-absorbing foam']),
    'CJ-31': ('Handlebar Phone Mount', ['Gravity auto lock', 'Silicone shock absorbers', '360° rotation']),
    'CJ-32': ('Handlebar Phone Mount', ['Gravity auto lock', 'Silicone shock absorbers', '360° rotation']),
    'SelfieCom': ('Bluetooth Selfie Stick', ['Bluetooth shutter remote', 'Fits 3.5–6.2-inch phones']),
    'SelfieCom-02': ('Bluetooth Selfie Stick with Light', ['Fill light', 'Stainless steel, 18.5–102cm']),
    # Computer
    'JP-01': ('Wired Keyboard & Mouse Set', ['Laser-etched keys', '1.5m USB cables']),
    'JP-02': ('Wireless Keyboard & Mouse Set', ['2.4GHz wireless', 'Laser-etched keys']),
    'JP-03': ('Wireless Keyboard & Mouse Set', ['2.4GHz wireless', '800–1200 DPI mouse', 'Keys rated for 10 million presses']),
    'JP-04': ('RGB Wired Keyboard & Mouse Set', ['Backlit keyboard and mouse', '1.5m USB cables']),
    'JP-05': ('Bluetooth Keyboard & Mouse Set', ['Phone and tablet slot', '78-key compact keyboard']),
    'JP-06': ('Backlit Gaming Keyboard & Mouse Set', ['Backlit 104-key keyboard', '1.5m USB cables']),
    'JS-01': ('Wireless Mouse', ['2.4GHz USB receiver', '6 buttons', 'Up to 1600 DPI']),
    'JS-02': ('Wireless Mouse', ['2.4GHz USB receiver', '6 buttons', 'Up to 1600 DPI']),
    'JS-04': ('Wireless Mouse', ['2.4GHz USB receiver', '6 buttons', 'Up to 1600 DPI']),
    'JS-05': ('Wireless Mouse', ['2.4GHz USB receiver', '6 buttons', 'Up to 1600 DPI']),
    'SBD-01': ('Mouse Pad with Wrist Rest', ['Sponge wrist support', 'Non-slip rubber base']),
    'SBD-02': ('Memory Foam Wrist-Rest Mouse Pad', ['Memory foam wrist support', 'Smooth cloth surface']),
    'SBD-03': ('Silicone Wrist-Rest Mouse Pad', ['Silicone non-slip base', 'Ergonomic wrist support']),
    'SBD-04': ('Silicone Wrist-Rest Mouse Pad', ['Silicone non-slip base', 'Ergonomic wrist support']),
    'SBD-05': ('Slow-Rebound Wrist-Rest Mouse Pad', ['Slow-rebound memory foam', 'Smooth cloth surface']),
    # Personal care
    'TXD-01': ('5-Blade Electric Shaver', ['Stainless steel blades', 'LED speed and battery display', 'Travel lock', '100+ minutes per charge']),
    'TXD-02': ('3-Head Rotary Shaver with Trimmer', ['Floating double-ring heads', 'Pop-up sideburn trimmer', 'Smart display']),
    'TXD-03': ('Magnetic Rotary Shaver', ['Magnetic, independently rotating heads', 'Battery display', 'Travel lock']),
    'TXD-04': ('Foil Electric Shaver', ['Stainless steel 420J2 blade', 'Battery display', 'Travel lock']),
    'TXD-05': ('3-Head Rotary Shaver', ['Floating double-ring heads', 'Washable']),
    'TXD-06': ('3-Blade Foil Shaver', ['Three foil blades', 'Washable']),
    'TXD-07': ('Metal Rotary Shaver', ['Metal body', 'Magnetic twin heads']),
    'LFJ-01': ('Cordless Hair Clipper', ['7200 rpm motor', 'Type-C charging']),
    'LFJ-02': ('Cordless Hair Clipper', ['6800 rpm motor', '4 guide combs: 3/6/10/13mm', 'Type-C charging']),
    'LFJ-03': ('Cordless Hair Clipper', ['7200 rpm motor', 'Type-C charging']),
    'LFJ-04': ('Cordless Hair Clipper', ['6800 rpm motor', '4 guide combs: 3/6/10/13mm', 'Type-C charging']),
    'LFJ-05': ('Cordless Hair Clipper', ['6800 rpm motor', 'Type-C charging']),
    'LFJ-06': ('Cordless Hair Clipper', ['7200 rpm motor', 'Type-C charging']),
    'LFJ-07': ('Cordless Hair Clipper', ['7200 rpm motor', 'Type-C charging']),
    'LFJ-08': ('Cordless Hair Clipper', ['6800 rpm motor', '4 guide combs: 3/6/10/13mm', 'Type-C charging']),
    'LFJ-09': ('Hair Clipper & Shaver Kit', ['32mm blade', 'Facial shaver attachment', 'Charging base']),
}
