/* ==========================================================
   SusOrSafe — curriculum, scenarios and shop data
   ========================================================== */

window.SUSOR_DATA = (() => {
  const STAGES = {
    kid: [
      { id: 'preschool', label: 'Preschool' },
      { id: 'primary', label: 'Elementary school' },
      { id: 'middle', label: 'Middle school' }
    ],
    teen: [
      { id: 'high', label: 'High school' },
      { id: 'university', label: 'College or university' },
      { id: 'none', label: 'Taking a break from school' }
    ],
    adult: [
      { id: 'working', label: 'Working or caregiving' },
      { id: 'retired', label: 'Retired' },
      { id: 'none', label: 'Prefer not to say' }
    ]
  };

  const STAGE_TIPS = {
    preschool: 'Practise asking a trusted grown-up before tapping a prize, link or download.',
    primary: 'Watch for game prizes, stranger chats and requests for passwords.',
    middle: 'Look out for fake game rewards, copied accounts and private details requests.',
    high: 'Watch for fake jobs, tickets, gaming giveaways and copied sign-in pages.',
    university: 'Check housing, scholarship, internship and campus account messages carefully.',
    working: 'Watch for fake work requests, bank impersonators and urgent payment changes.',
    retired: 'Pause on unexpected bank, delivery, government and family emergency messages.',
    none: 'Scams can target anyone. Pause when a message asks for money, a code or a quick click.'
  };

  const AVATAR_COLORS = [
    { id: 'mint', name: 'Mint', hex: '#7CF0C6', price: 0 },
    { id: 'lime', name: 'Lime', hex: '#C8F65A', price: 0 },
    { id: 'sky', name: 'Sky', hex: '#7DD3FC', price: 80 },
    { id: 'blush', name: 'Blush', hex: '#FF9EC7', price: 80 },
    { id: 'violet', name: 'Violet', hex: '#B9A7FF', price: 120 },
    { id: 'sunset', name: 'Sunset', hex: '#FFB86B', price: 160 },
    { id: 'ocean', name: 'Ocean', hex: '#4D7CFE', price: 120 },
    { id: 'coral', name: 'Coral', hex: '#FF776B', price: 160 },
    { id: 'lavender', name: 'Lavender', hex: '#C4A1FF', price: 180 }
  ];

  const ACCESSORIES = [
    { id: 'none', name: 'No gear', price: 0 },
    { id: 'cap', name: 'Cap', price: 60 },
    { id: 'glasses', name: 'Glasses', price: 80 },
    { id: 'headphones', name: 'Headphones', price: 120 },
    { id: 'crown', name: 'Crown', price: 220 },
    { id: 'scarf', name: 'Scarf', price: 90 },
    { id: 'bow', name: 'Bow', price: 90 },
    { id: 'backpack', name: 'Backpack', price: 140 },
    { id: 'headband', name: 'Star headband', price: 160 }
  ];

  const PETS = [
    { id: 'none', name: 'No pet', emoji: '', color: '#E2E8F0', price: 0, blurb: 'Travel light.' },
    { id: 'pip', name: 'Pip', emoji: '🐣', color: '#FFE38A', price: 0, blurb: 'A tiny chick with big opinions.' },
    { id: 'mochi', name: 'Mochi', emoji: '🐱', color: '#FFC5D9', price: 120, blurb: 'Sleeps through every scam.' },
    { id: 'nori', name: 'Nori', emoji: '🦎', color: '#A9E8B0', price: 180, blurb: 'Suspicious of every link.' },
    { id: 'ember', name: 'Ember', emoji: '🐉', color: '#FFB7A5', price: 250, blurb: 'Guards your passwords fiercely.' },
    { id: 'luna', name: 'Luna', emoji: '🐰', color: '#D8C8FF', price: 220, blurb: 'A gentle hop toward safer choices.' },
    { id: 'pixel', name: 'Pixel', emoji: '🦊', color: '#FFD0A1', price: 280, blurb: 'Sniffs out suspicious links.' },
    { id: 'orbit', name: 'Orbit', emoji: '🦉', color: '#B9D8FF', price: 340, blurb: 'Keeps a wise eye on every message.' },
    { id: 'pebble', name: 'Pebble', emoji: '🐢', color: '#B8E4C5', price: 360, blurb: 'Takes time to pause and verify.' },
    { id: 'comet', name: 'Comet', emoji: '🐬', color: '#A8E8F2', price: 420, blurb: 'Dashes past scams without a click.' },
    { id: 'sprout', name: 'Sprout', emoji: '🐼', color: '#D5E9C4', price: 480, blurb: 'A calm companion for big quests.' },
    { id: 'seal', name: 'Bubbles', emoji: '🦭', color: '#F7B8E8', price: 520, blurb: 'Spots strange messages from a mile away.' },
    { id: 'hedgehog', name: 'Prickle', emoji: '🦔', color: '#E8C8A5', price: 560, blurb: 'Keeps your private details tucked away.' },
    { id: 'penguin', name: 'Waddles', emoji: '🐧', color: '#BBDCF7', price: 600, blurb: 'Stays cool when a message feels urgent.' },
    { id: 'froglet', name: 'Jumps', emoji: '🐸', color: '#BDEB85', price: 640, blurb: 'Hops over suspicious links.' },
    { id: 'whale', name: 'Bluebell', emoji: '🐳', color: '#A8DDF7', price: 700, blurb: 'Makes a splash for safer choices.' },
    { id: 'redpanda', name: 'Maple', emoji: '🦝', color: '#FFC49A', price: 760, blurb: 'Checks twice before sharing anything.' }
  ];

  const LESSONS = [
    {
      id: 1,
      level: 1,
      levelLabel: 'Level 1 · Spot it',
      title: 'Cyber attacks, decoded',
      subtitle: 'Phishing, smishing, malware and ransomware',
      duration: '5 min',
      color: '#C8F65A',
      icon: 'shield',
      activity: 'phishing',
      activityLabel: 'Play Phishing Detective',
      overview: {
        lede: "Most cyber attacks don't break in through code. They knock politely, pretend to be someone you trust, and wait for one click.",
        points: [
          'Phishing is bait by email. Smishing is the same trick by text or chat.',
          "Malware is software you didn't mean to install. Ransomware locks your files and demands payment.",
          'The common thread: urgency, a link or attachment, and a request to act now.'
        ],
        modeTips: {
          kid: 'A message offering free game coins or a surprise prize may be trying to steal your game password. Do not tap it; show a grown-up.',
          teen: 'A fake job, concert-ticket deal or gaming giveaway in your DMs may lead to a copycat sign-in page that steals your account.',
          adult: 'A text about a parcel fee or a bank email warning of a blocked account may be bait. Open the official app or call the number on your card.'
        }
      },
      vocab: [
        { term: 'Phishing', def: 'A fake message that impersonates a person or brand to steal a login, payment or data.', example: '“Your parcel is held — pay NT$30 here.”' },
        { term: 'Smishing', def: 'Phishing delivered by SMS or a messaging app. Short links hide the real domain.', example: 'A text from an unknown number with a 24-hour deadline.' },
        { term: 'Malware & ransomware', def: 'Software that harms or takes over a device. Ransomware encrypts files and demands money.', example: 'A “free” game cheat that installs a password stealer.' }
      ],
      quiz: [
        {
          q: 'A text says a parcel is held and asks for a small fee via a link. What is this?',
          options: ['Smishing', 'A software update', 'A safe delivery notice'],
          answer: 0,
          why: 'A text + a link + a small urgent payment is the classic smishing pattern.'
        },
        {
          q: 'Which first move is safest for any “log in here” message?',
          options: ['Click the link and look', 'Open the official app yourself', 'Reply with your username'],
          answer: 1,
          why: 'Use a route you chose. A link in the message can lead to a perfect fake.'
        },
        {
          q: 'What does ransomware do?',
          options: ['Shows more ads', 'Locks files and demands payment', 'Makes your Wi-Fi faster'],
          answer: 1,
          why: 'Ransomware encrypts your files, then sells you the key. Backups are the real defence.'
        }
      ]
    },

    {
      id: 2,
      level: 1,
      levelLabel: 'Level 1 · Spot it',
      title: 'The pressure playbook',
      subtitle: 'How social engineering makes smart people comply',
      duration: '4 min',
      color: '#FF7FB6',
      icon: 'chat',
      activity: 'chat',
      activityLabel: 'Play Scam Chat',
      overview: {
        lede: "Social engineering doesn't need a software flaw. It uses feelings: fear, urgency, authority, reward, even kindness.",
        points: [
          'The levers: a deadline, a threat, a boss-like voice, a prize.',
          "Isolation is the red flag: “don't tell anyone”, “don't hang up”, “don't call me”.",
          'Take 5: stop, name the feeling, then verify through a channel you chose.'
        ],
        modeTips: {
          kid: 'Someone in a game chat says “keep this secret” or asks for your password or a gift card? Stop and tell a grown-up.',
          teen: 'A “friend” urgently asks for a login code, money, or help buying gift cards? Contact them another way before you act.',
          adult: 'A caller pretending to be your bank, the police, or family may pressure you to move money quickly. Hang up and call a number you already trust.'
        }
      },
      vocab: [
        { term: 'Social engineering', def: 'Manipulating people into giving access or money by exploiting trust and emotion.', example: 'A fake IT helpdesk calls to “fix” your account.' },
        { term: 'Pretext', def: 'A made-up story that gives the attacker a reason to contact you.', example: '“I am from the fraud team; we detected a payment.”' },
        { term: 'Verification channel', def: 'A second route you find yourself: the official app, a saved number, the front desk.', example: 'Hanging up and dialling the number on your card.' }
      ],
      quiz: [
        {
          q: 'A caller says your account will be frozen in 10 minutes unless you act. What lever is that?',
          options: ['Urgency', 'A software bug', 'Good customer service'],
          answer: 0,
          why: 'A countdown is designed to stop you thinking. Slow down and verify.'
        },
        {
          q: 'Which request is the biggest red flag?',
          options: ['Hang up and call the official number', 'Use this link to log in now', 'Check the official app yourself'],
          answer: 1,
          why: 'The attacker needs you to use their link. Any request to do that is the tell.'
        },
        {
          q: 'What is a verification channel?',
          options: ['A link the caller sends', 'A second route you find yourself', 'A screenshot from a friend'],
          answer: 1,
          why: 'A channel you control cannot be faked by the person who called you.'
        }
      ]
    },

    {
      id: 3,
      level: 1,
      levelLabel: 'Level 1 · Spot it',
      title: 'Fake websites, real tells',
      subtitle: 'Read the address bar before you click',
      duration: '5 min',
      color: '#5CE1C4',
      icon: 'search',
      activity: 'site',
      activityLabel: 'Play Site Check',
      overview: {
        lede: "A fake login page can be pixel-perfect. The address bar is the part attackers can't copy exactly.",
        points: [
          'The real owner is the domain just left of the first single slash: seabank.com.tw.',
          'Lookalikes add words, hyphens or endings: seabank-secure.com is a different site.',
          'A padlock means the connection is encrypted, not that the site is honest. Scareware wants you to install a “cleaner”.'
        ],
        modeTips: {
          kid: 'A “free Robux/coins/skins” page may copy a real game and steal your password. Close it and ask a grown-up.',
          teen: 'Fake ticket, sneaker, rental or scholarship sites can copy real brands. Check the full web address before signing in or paying.',
          adult: 'A fake bank, delivery or government website may look real. Use a saved bookmark or the official app instead of a link in a message.'
        }
      },
      vocab: [
        { term: 'Domain', def: 'The part of a URL that identifies the owner, for example seabank.com.tw.', example: 'The bit immediately before the first single slash.' },
        { term: 'Lookalike domain', def: 'A domain that adds words or hyphens to look official, such as seabank-secure.com.', example: 'islandshop.com.tw.secure-login.xyz' },
        { term: 'Scareware', def: 'Fake warnings that push you to install malware or pay for a useless “fix”.', example: '“Your phone has 5 viruses. Install CleanBoost now.”' }
      ],
      quiz: [
        {
          q: 'Which address belongs to the official bank seabank.com.tw?',
          options: ['seabank.com.tw.login-check.xyz', 'seabank.com.tw', 'seabank-secure.com'],
          answer: 1,
          why: 'The first two are different domains. Only the exact domain is the bank.'
        },
        {
          q: 'A page says your phone is infected and to install a cleaner. What now?',
          options: ['Install it quickly', 'Close the tab and scan with official tools', 'Enter your password to clean it'],
          answer: 1,
          why: 'Browsers cannot scan your phone. The warning is the attack.'
        },
        {
          q: 'What does the padlock in the address bar mean?',
          options: ['The site is honest', 'The connection is encrypted', 'The government approved it'],
          answer: 1,
          why: 'The padlock protects the pipe, not the person at the other end.'
        }
      ]
    },

    {
      id: 4,
      level: 2,
      levelLabel: 'Level 2 · Protect it',
      title: 'Passwords that hold',
      subtitle: 'Long, unique, and out of your head',
      duration: '5 min',
      color: '#FFCB5C',
      icon: 'key',
      activity: 'password',
      activityLabel: 'Enter the Password Gym',
      overview: {
        lede: "Reused passwords turn one leak into ten. The fix isn't a cleverer password — it's a longer one, different everywhere, stored in a vault.",
        points: [
          'Length beats complexity. A five-word passphrase is long and memorable.',
          "Never reuse: one breach shouldn't unlock your email, bank and socials.",
          'Let a password manager remember them, and lock the vault with 2FA.'
        ],
        modeTips: {
          kid: 'If someone guesses your game password, they could take your character or spend your game coins. Keep it secret and ask a grown-up to help make it strong.',
          teen: 'If a gaming, school or social password is reused, one leaked account can let scammers into the others. Use a different password for each.',
          adult: 'A reused email password can expose password resets for banking and shopping accounts. Start with a unique email password stored in a password manager.'
        }
      },
      vocab: [
        { term: 'Passphrase', def: 'A sequence of unrelated words — longer and easier to remember than random characters.', example: 'otter-mango-rocket-slipper-penguin-42!' },
        { term: 'Password manager', def: 'A vault that stores unique passwords and fills them in for you.', example: 'Your browser’s built-in manager is a fine start.' },
        { term: 'Credential stuffing', def: 'Trying leaked username/password pairs on other sites, because people reuse them.', example: 'One game-site leak opens an email account.' }
      ],
      quiz: [
        {
          q: 'Which is strongest?',
          options: ['Summer2024!', 'otter-mango-rocket-slipper-penguin-42!', 'P@ssw0rd'],
          answer: 1,
          why: 'Length wins. The passphrase is far longer and not in a common-password list.'
        },
        {
          q: 'Why is password reuse dangerous?',
          options: ['It slows typing', 'One leak can unlock many accounts', 'It uses more storage'],
          answer: 1,
          why: 'Attackers replay leaked pairs everywhere. Unique passwords contain the damage.'
        },
        {
          q: 'What is a password manager for?',
          options: ['Remembering unique passwords', 'Sharing passwords with friends', 'Making passwords shorter'],
          answer: 0,
          why: 'It remembers what you should not reuse, behind one strong master phrase.'
        }
      ]
    },

    {
      id: 5,
      level: 2,
      levelLabel: 'Level 2 · Protect it',
      title: 'Two keys are better',
      subtitle: '2FA, passkeys and backup codes',
      duration: '4 min',
      color: '#9D8CFF',
      icon: 'lock',
      activity: 'twofa',
      activityLabel: 'Set up 2FA',
      overview: {
        lede: 'A password is a single key. If it leaks, everything opens. Two-factor authentication adds a second proof: something you have, or something you are.',
        points: [
          'Authenticator apps and passkeys beat SMS codes, which can be intercepted or SIM-swapped.',
          'Never share a code. Real support never asks for it.',
          'Save backup codes offline so a lost phone does not lock you out.'
        ],
        modeTips: {
          kid: 'A sign-in code is a secret key. If someone in a game or chat asks you to read it out, say no and tell a grown-up.',
          teen: 'A fake support message may ask for the code sent to your phone to steal your account. Never share it; turn on extra sign-in protection.',
          adult: 'A caller claiming to stop fraud may ask for a one-time bank code. That code can approve a transfer—never read it to someone who called you.'
        }
      },
      vocab: [
        { term: 'Two-factor authentication', def: 'A second proof at login, beyond your password.', example: 'Password + a code from an app.' },
        { term: 'Passkey', def: "A phishing-resistant login using your device's biometrics or PIN instead of a password.", example: 'Face ID instead of typing a password.' },
        { term: 'Backup code', def: 'One-time recovery codes to use if you lose your second factor.', example: 'A printed sheet in a locked drawer.' }
      ],
      quiz: [
        {
          q: 'Which second factor is generally strongest?',
          options: ['SMS code', 'Authenticator app or passkey', 'A code emailed to you'],
          answer: 1,
          why: 'Authenticator codes are not tied to your SIM, and passkeys resist phishing entirely.'
        },
        {
          q: 'Someone claiming to be support asks for your 6-digit code. You…',
          options: ['Share it', 'Refuse and verify through official channels', 'Send a screenshot'],
          answer: 1,
          why: 'A code is a one-time key. Anyone who asks for it is attacking you.'
        },
        {
          q: 'Why save backup codes?',
          options: ['To share with friends', 'To get back in if you lose your phone', 'To make login faster'],
          answer: 1,
          why: 'The second factor can be lost. Backup codes are your spare key.'
        }
      ]
    },

    {
      id: 6,
      level: 2,
      levelLabel: 'Level 2 · Protect it',
      title: 'The billboard test',
      subtitle: 'Share less, control more',
      duration: '4 min',
      color: '#7DD3FC',
      icon: 'map',
      activity: 'privacy',
      activityLabel: 'Open the Privacy Map',
      overview: {
        lede: "Privacy isn't secrecy. It's control over who sees what. Before you post, imagine it on a billboard with your name and street.",
        points: [
          'Combinations matter more than single details: name + school + birthday + live location.',
          'Use “friends only”, review old posts, untag and delete.',
          'Scammers use personal details to make a fake story believable.'
        ],
        modeTips: {
          kid: 'A stranger could use your school, full name or where you are to find you. Ask a grown-up before posting personal details or photos.',
          teen: 'A fake giveaway or new online friend may ask for your school, location or private photos. “Close friends” posts can still be screenshotted.',
          adult: 'Scammers can use birthdays, family names and travel posts to impersonate you or guess account-recovery answers. Limit what is public.'
        }
      },
      vocab: [
        { term: 'Personal data', def: 'Any detail that can identify you or your location.', example: 'Full name, school, birthday, live location.' },
        { term: 'Oversharing', def: 'Posting more than an audience needs, often in real time.', example: 'A story from the airport before you fly.' },
        { term: 'Metadata', def: 'Hidden data in photos, such as the time and GPS location.', example: 'A beach photo that knows exactly which beach.' }
      ],
      quiz: [
        {
          q: 'Which is riskiest to post publicly?',
          options: ['Your favourite colour', 'A photo of your front door with the house number', 'A drawing you made'],
          answer: 1,
          why: 'A door, a number and a street can be enough to find an address.'
        },
        {
          q: 'What is the billboard test?',
          options: ['Would this look good on a billboard?', 'Would I be comfortable if everyone saw this?', 'Can I make this go viral?'],
          answer: 1,
          why: 'If the whole world seeing it feels wrong, the audience is too wide.'
        },
        {
          q: 'Why are combinations of data dangerous?',
          options: ['They use more storage', 'They let someone build a believable profile', 'They slow the internet'],
          answer: 1,
          why: 'Individually harmless details become an identity when pieced together.'
        }
      ]
    },

    {
      id: 7,
      level: 3,
      levelLabel: 'Level 3 · Live it',
      title: 'Public Wi-Fi, private data',
      subtitle: 'Connections, hotspots and device hygiene',
      duration: '4 min',
      color: '#C8F65A',
      icon: 'wifi',
      activity: 'wifi',
      activityLabel: 'Play the Wi-Fi Challenge',
      overview: {
        lede: 'Free Wi-Fi is convenient — and convenient for attackers. Treat a public network like a public room: anyone might be listening.',
        points: [
          'Confirm the exact network name and password with staff. Fake hotspots use similar names.',
          'Use mobile data or a trusted VPN for banking. HTTPS helps, but it is not a force field.',
          'Decline unexpected profiles, certificates or app installs. Keep your device updated.'
        ],
        modeTips: {
          kid: 'A fake “Free Game Wi-Fi” could show a pretend prize or ask you to install something. Ask a grown-up before joining or downloading.',
          teen: 'A fake café or campus hotspot could lead to a copycat school or social sign-in page. Confirm the network with staff and do not log in through pop-ups.',
          adult: 'A fake airport or hotel Wi-Fi login can capture your account details. Confirm the network with staff; use mobile data for banking.'
        }
      },
      vocab: [
        { term: 'Public Wi-Fi', def: 'A network shared by strangers, often without a password.', example: 'Café, airport, hotel lobby.' },
        { term: 'Hotspot', def: 'A device that shares its internet connection. A fake hotspot can imitate a real one.', example: '“Free_Cafe_WiFi” with no password.' },
        { term: 'VPN', def: 'An encrypted tunnel to a trusted server. It protects traffic on untrusted networks.', example: 'Your company VPN on hotel Wi-Fi.' }
      ],
      quiz: [
        {
          q: 'Two networks: Cafe_Free and Cafe_Guest with a password from the counter. Choose…',
          options: ['Cafe_Free', 'Cafe_Guest with the staff-confirmed password', 'Either — Wi-Fi is Wi-Fi'],
          answer: 1,
          why: 'A staff-confirmed name and password is much harder for a fake hotspot to copy.'
        },
        {
          q: 'You need to check your bank at a café. Best option?',
          options: ['The café Wi-Fi', 'Your mobile data', 'A stranger’s hotspot'],
          answer: 1,
          why: 'Your own connection does not share a network with strangers.'
        },
        {
          q: 'A pop-up says you must install a profile to use the Wi-Fi. You…',
          options: ['Install it', 'Decline and ask staff', 'Enter your password'],
          answer: 1,
          why: 'A network should not need a device profile. That is a common malware route.'
        }
      ]
    }
  ];

  const PHISHING_CASES = [
    {
      channel: 'SMS',
      from: '+886 912 345 678',
      subject: "You've won an iPhone 16!",
      lines: [
        { text: "[IslandShop] Congratulations, you've won an iPhone 16!", clue: 'You never entered this draw.' },
        { text: 'Claim within 24 hours — fill in your delivery details here:', clue: 'A countdown makes you act before you think.' },
        { text: 'https://island-shop-tw.vip/prize', clue: 'Not the official domain — and it ends in .vip.' },
        { text: 'A small NT$99 shipping and handling fee is required.', clue: 'A tiny upfront payment is a classic opener.' }
      ],
      verdict: 'phish',
      explain: 'Fake prizes run on “free stuff + a deadline”. Official giveaways do not use strange domains or ask you to pay before you can claim.'
    },
    {
      channel: 'EMAIL',
      from: 'Registrar <course@school.edu.tw>',
      subject: 'Final exam schedule',
      lines: [
        { text: 'Hello everyone, final exams run from 15–19 January.' },
        { text: 'The schedule is posted on the school homepage. Please log in there to check.' },
        { text: "Questions? Call the registrar's office, ext. 301." }
      ],
      verdict: 'safe',
      explain: 'No strange link, no password request, no urgent payment. Still, the safest route is to open the school site yourself rather than clicking a link in an email.'
    },
    {
      channel: 'EMAIL',
      from: 'Seabank <service@seabank-secure.com>',
      subject: 'URGENT: Your account is suspended',
      lines: [
        { text: 'Dear customer, we detected an unusual login to your account.', clue: 'A fear opener.' },
        { text: 'Verify immediately via the link below or your account will be frozen.', clue: 'Urgency plus a threat.' },
        { text: 'https://seabank-secure.com/verify', clue: "The real domain wouldn't add “-secure”." },
        { text: "You'll need your online banking ID, password and SMS code.", clue: 'Asking for your full password and SMS code is always a scam.' }
      ],
      verdict: 'phish',
      explain: 'Banks do not send links that ask for your full password and SMS code. If in doubt, call the number on the back of your card.'
    },
    {
      channel: 'LINE',
      from: 'Mei Chen (new account)',
      subject: 'You there?',
      lines: [
        { text: 'Hey, it\'s me. My phone broke — this is my new account.', clue: 'A sudden new account is step one.' },
        { text: "I need NT$30,000 right now. I'll pay you back tomorrow.", clue: 'Money, and a large amount.' },
        { text: "Send it to this account and don't call me — I'm in a meeting.", clue: 'Stopping you from calling is the biggest tell.' }
      ],
      verdict: 'phish',
      explain: 'The friend-in-trouble scam runs on “new account + don\'t call me”. Call or video the number you already have saved — never confirm through the new account.'
    },
    {
      channel: 'EMAIL',
      from: 'IslandShop <order@islandshop.com.tw>',
      subject: 'Your order has shipped',
      lines: [
        { text: 'Order #12345678 has shipped. Expected delivery: tomorrow.' },
        { text: 'Track it in the app or on our website.' },
        { text: 'We will never ask for your password or send you to an ATM.' }
      ],
      verdict: 'safe',
      explain: 'The domain is the official one, and the message only mentions delivery. If you are still unsure, open the app yourself instead of clicking the link.'
    },
    {
      channel: 'LINE',
      from: 'Stock Guru — Mr Lin',
      subject: 'VIP group invite',
      lines: [
        { text: "You've been selected for our VIP stock group!", clue: 'Unearned luck out of nowhere.' },
        { text: '300% returns in 3 months. Only 2 spots left.', clue: 'Guaranteed high returns plus scarcity.' },
        { text: 'Download this app first. Deposit NT$10,000 to start.', clue: 'Unknown app plus a deposit before anything happens.' },
        { text: "Guaranteed profit. You can't lose!", clue: 'There is no such thing as guaranteed profit.' }
      ],
      verdict: 'phish',
      explain: 'Guaranteed returns, limited spots, an unknown app and a deposit: that is the fixed recipe of investment fraud.'
    }
  ];

  const SITE_CASES = [
    {
      url: 'https://www.islandshop.com.tw/account/orders',
      title: 'Your orders',
      lines: [
        'Order #12345678 — out for delivery.',
        'Track parcel · View invoice · Return an item.'
      ],
      action: 'Track parcel',
      verdict: 'safe',
      clues: [],
      explain: 'Exact official domain, no password request, no download. Safe to continue — though opening the app yourself is still the cleanest route.'
    },
    {
      url: 'https://islandshop.com.tw.secure-login.xyz/verify',
      title: 'Session expired',
      lines: [
        'For your security, sign in again to continue.',
        'Enter your password and the card number on file.'
      ],
      action: 'Sign in',
      verdict: 'bad',
      clues: [
        'The real owner is secure-login.xyz, not islandshop.com.tw.',
        'A shop does not need your full card number to show orders.',
        'The domain uses “secure” to feel official.'
      ],
      explain: 'This is a lookalike domain. The official part is only a subdomain of the attacker’s site.'
    },
    {
      url: 'https://play.google.com/store/apps/details?id=com.susor.safe',
      title: 'SusOrSafe — Google Play',
      lines: [
        'SusOrSafe · Education',
        '4.8 ★ · 10K+ downloads · Contains ads? No.'
      ],
      action: 'Install',
      verdict: 'safe',
      clues: [],
      explain: 'An official app store page on the store’s real domain. The package name and developer matter more than the logo.'
    },
    {
      url: 'https://free-robux-generator.top/get',
      title: 'Free 10,000 Robux',
      lines: [
        'Enter your username and password to load your reward.',
        'Complete 3 offers to verify you are human.'
      ],
      action: 'Claim reward',
      verdict: 'bad',
      clues: [
        'There is no legitimate generator; it is bait.',
        'It asks for your password — a real reward never does.',
        '“Complete offers” is a data-harvesting chain.'
      ],
      explain: 'Free game currency plus a password field is always a credential theft page.'
    },
    {
      url: 'https://seabank.com.tw@secure-verify.io/login',
      title: 'Seabank online banking',
      lines: [
        'Unusual activity detected. Log in with your ID and SMS code.',
        'Your account will be limited in 30 minutes.'
      ],
      action: 'Log in now',
      verdict: 'bad',
      clues: [
        'Everything before the @ is a username, not the domain.',
        'The real domain here is secure-verify.io.',
        'No bank needs your SMS code on a login page.'
      ],
      explain: 'The @ trick makes the URL look like the bank. The browser connects to secure-verify.io.'
    },
    {
      url: 'https://cleanboost-pro.com/scan',
      title: '⚠ Your phone has 5 viruses',
      lines: [
        'A scan found 5 threats. Install CleanBoost Pro to remove them now.',
        'Compatible with your device. 87% of users fixed this in 2 minutes.'
      ],
      action: 'Clean my phone',
      verdict: 'bad',
      clues: [
        'A website cannot scan your phone.',
        'Fear plus a countdown is scareware.',
        'The “cleaner” is the malware.'
      ],
      explain: 'Scareware uses fake scan results to make you install something harmful. Close the tab.'
    }
  ];

  const PRIVACY_ITEMS = [
    { id: 'name', label: 'Full name', emoji: '🪪', risk: 14, note: 'A name plus a birthday is the raw material for impersonation.' },
    { id: 'school', label: 'School and class', emoji: '🏫', risk: 12, note: 'Know your class and someone can pose as a classmate or parent.' },
    { id: 'birthday', label: 'Full date of birth', emoji: '🎂', risk: 10, note: 'Birthdays often become password hints or security answers.' },
    { id: 'location', label: 'Live location', emoji: '📍', risk: 22, note: 'Live location tells a stranger exactly where you are.' },
    { id: 'home', label: 'Front door or neighbourhood photo', emoji: '🏠', risk: 18, note: 'House numbers, street signs and landmarks reveal where you live.' },
    { id: 'ticket', label: 'Train or plane ticket photo', emoji: '🎫', risk: 12, note: 'Barcodes and names can be used to look up bookings or impersonate you.' },
    { id: 'pet', label: "Pet's name", emoji: '🐶', risk: 6, note: 'A common answer to password-reset questions.' },
    { id: 'email', label: 'Main email address', emoji: '✉️', risk: 5, note: 'A public email address invites more phishing.' },
    { id: 'hobby', label: 'Hobbies', emoji: '🎨', risk: 0, note: "Fine on its own — just don't pair it with the rest." }
  ];

  const CHAT_SCENARIOS = {
    kid: {
      name: 'free_points_gg',
      label: '“Official support”',
      status: 'JUST CAME ONLINE',
      intro: "A stranger in your gaming group says they're official support and wants to give you free coins.",
      steps: [
        {
          them: [
            "Hey! I'm official support 🎮",
            "I'm giving you 5,000 coins. Just log in through this link.",
            'https://free-points-gg.top'
          ],
          choices: [
            { text: 'Open the link', ok: false, reply: '（You open the site. It looks exactly like the real login page…）', tip: 'A fake login page can look identical to the real one. The moment you type, your account details go straight to the scammer.' },
            { text: 'Ask a parent or teacher first', ok: true, reply: '“Why ask? There are only 3 spots left!”', tip: 'The more they rush you, the more suspicious it is. Asking an adult is a superpower, not a weakness.' },
            { text: 'Reply: “Who are you?”', ok: false, reply: '“I\'m official! Look at my profile picture.”', tip: 'Profile pictures and names can be faked. They prove nothing.' }
          ]
        },
        {
          them: ["Or just send me your username and password. I'll add the coins in a minute."],
          choices: [
            { text: "Give it to them — it's only a game account", ok: false, reply: '（You are logged out. Your coins and skins are gone.）', tip: "Passwords are like toothbrushes: never share. Game accounts can be linked to a parent's card, too." },
            { text: 'No. I never share my password.', ok: true, reply: '“Ugh, you\'re so difficult.”', tip: 'Real support never asks for your password.' }
          ]
        },
        {
          them: ['Then help me with one SMS code. Send it here and the coins are yours.'],
          choices: [
            { text: 'Send the verification code', ok: false, reply: '（Your phone number is used to open other accounts.）', tip: 'A verification code is a front-door key. Handing it over can let someone impersonate you.' },
            { text: 'No. I don\'t share codes with anyone.', ok: true, reply: '“…”', tip: 'Codes go only into the official page you opened yourself — never into a chat.' }
          ]
        },
        {
          them: ["If you don't help, I'll report you and get your account locked!"],
          choices: [
            { text: 'Scared — do what they say', ok: false, reply: '（The threats continue, and they ask for more.）', tip: 'Threats are a control tactic. Complying only invites more.' },
            { text: 'Block, screenshot, tell an adult', ok: true, reply: '（You block them and show the screenshots to a teacher.）', tip: 'Block + screenshot + tell an adult is the standard three-step.' }
          ]
        }
      ],
      ending: 'You never handed over your account, password or verification code.'
    },

    teen: {
      name: 'buyer_8888',
      label: '“Serious buyer”',
      status: 'FROM YOUR GAMING GROUP',
      intro: 'Someone offers NT$8,000 for your game account — far above the going rate.',
      steps: [
        {
          them: [
            "I'll give you 8,000 for the account. That's way above market — I just really want it.",
            'Add me on LINE. Private deals are faster.'
          ],
          choices: [
            { text: 'Add them and deal privately', ok: false, reply: '“Nice. I\'ll walk you through the transfer.”', tip: 'Private deals have no platform protection. Once they have the account, they can vanish.' },
            { text: 'Check the market price and use the official marketplace', ok: true, reply: '“The platform takes a cut. Just deal with me.”', tip: 'Insisting on a protected marketplace is the simplest way to protect yourself.' },
            { text: 'Let them log in to see if it is worth it', ok: false, reply: '“Sure, send me the login and I\'ll check.”', tip: 'Letting someone log in hands them the account.' }
          ]
        },
        {
          them: ["To check the account's value, send me the username and password. I'll log in for a minute."],
          choices: [
            { text: 'Send the login — just for a look', ok: false, reply: '（They log in and change the password immediately.）', tip: '“Just a look” is the oldest lie in account theft. The moment you share it, they own it.' },
            { text: 'No. The transfer happens inside the platform.', ok: true, reply: '“Then you\'re not serious about selling.”', tip: "A real buyer doesn't need your password; the platform handles the transfer." }
          ]
        },
        {
          them: ["We'll use a safe trading platform. You pay a NT$500 deposit first. I'll refund it after."],
          choices: [
            { text: 'Pay the NT$500 — it is refundable', ok: false, reply: '（They take the deposit, then ask for another NT$1,500 “unfreeze fee”.）', tip: 'Deposits, unfreeze fees, handling fees — it is a chain. Each payment unlocks the next request.' },
            { text: "No. A buyer shouldn't ask a seller for money.", ok: true, reply: '“...You\'re really difficult.”', tip: "You're the seller. There is no reason to pay the buyer first." }
          ]
        },
        {
          them: ["If you don't pay, I'll report your account and get it locked!"],
          choices: [
            { text: 'Pay to avoid the hassle', ok: false, reply: '（They smell blood and keep asking.）', tip: "Paying once doesn't end it. It proves you'll pay again." },
            { text: 'Block, screenshot, report to the platform', ok: true, reply: '（You screenshot everything and report them, then tell a parent.）', tip: 'Keep evidence, block, report. Arguing is what they want.' }
          ]
        }
      ],
      ending: 'You kept your login details — and paid no deposit.'
    },

    adult: {
      name: 'Bank support (incoming call)',
      label: '“Seabank support”',
      status: 'ON THE CALL',
      intro: '8 p.m. The caller ID says “Bank support”. They claim your online order was set up as a 12-month instalment plan.',
      steps: [
        {
          them: [
            'Hello, this is Seabank support.',
            "Your online order was mistakenly set up as 12 monthly payments. You'll be charged 12 times tonight.",
            'I need to help you cancel it.'
          ],
          choices: [
            { text: "Follow the support agent's instructions", ok: false, reply: '“Great. Add our LINE first — I\'ll send you a link.”', tip: 'Banks don\'t walk you through online banking on LINE, and there is no “cancel an instalment” procedure like this.' },
            { text: 'Hang up and call the bank yourself', ok: true, reply: '（You hang up and dial the number on the back of your card.）', tip: 'Verify using a number you found yourself, never one they gave you.' },
            { text: 'Ask for their employee ID', ok: false, reply: '“My ID is 8823. You can trust me.”', tip: 'Anyone can invent an ID number. It proves nothing.' }
          ]
        },
        {
          them: ['Add this LINE account. Our agent will guide you through online banking, step by step.', 'https://line.me/xxxx'],
          choices: [
            { text: 'Add them and follow along', ok: false, reply: '（They send a login page that looks almost exactly like the bank\'s.）', tip: 'Any link that asks you to log in to online banking should be treated as a scam.' },
            { text: "Don't add them. Check the official app instead.", ok: true, reply: '（You open the official app. There is no instalment plan at all.）', tip: 'Account status lives in the official app or website — not in a chat.' }
          ]
        },
        {
          them: ['To verify your identity, tell me your balance and transfer the money to our safe account.', 'This is required by the financial regulator.'],
          choices: [
            { text: "Do it — they'll send it back", ok: false, reply: '（The money leaves. The line goes dead.）', tip: 'There is no “safe account”. No regulator ever asks you to transfer money.' },
            { text: 'Refuse, and call 165 to check', ok: true, reply: '（165 confirms: this is the classic instalment-refund scam.）', tip: '165 is Taiwan\'s anti-fraud hotline. When in doubt, check.' }
          ]
        },
        {
          them: ["Time's almost up. If you don't act tonight, you'll be charged!", 'Are you going to take responsibility?'],
          choices: [
            { text: 'Panic and do what they say', ok: false, reply: "（Urgency makes people comply. That's exactly the design.）", tip: 'Manufactured urgency is the core of the scam. Slowing down is the defence.' },
            { text: 'Hang up, block, screenshot, report', ok: true, reply: '（You hang up and save the caller ID and chat as evidence.）', tip: 'Hang up, verify, report — in that order.' }
          ]
        }
      ],
      ending: "You didn't transfer money under pressure, and you never gave up a verification code."
    }
  };

  const WIFI_STEPS = [
    {
      label: 'Pick a network',
      prompt: 'You are at a café with your laptop. Three networks appear. Which one do you join?',
      options: [
        { text: 'Cafe_Free — open, no password', ok: false, feedback: 'Open networks are convenient for attackers too. Anyone nearby can set up a hotspot with that name.' },
        { text: 'Cafe_Guest — password printed at the counter', ok: true, feedback: 'A staff-confirmed network name plus a password is much harder to imitate.' },
        { text: 'Ask another customer which network they use', ok: false, feedback: 'A stranger’s answer is not verification. Ask the staff and check the counter sign.' }
      ]
    },
    {
      label: 'Check your balance',
      prompt: 'You remember you need to check your bank account. What do you do?',
      options: [
        { text: 'Log in to online banking over the café Wi-Fi', ok: false, feedback: 'Save sensitive logins for a connection you control. HTTPS protects the pipe, not a hostile network.' },
        { text: 'Switch to mobile data and use the bank’s app', ok: true, feedback: 'Your mobile connection is not shared with the café. This is the safest quick option.' },
        { text: 'Install a free VPN from a pop-up ad and then log in', ok: false, feedback: 'A random VPN from an ad can be worse than the café network. Only use a VPN you trust.' }
      ]
    },
    {
      label: 'The connection pop-up',
      prompt: 'A page appears: “Install this profile to finish connecting.” What now?',
      options: [
        { text: 'Install the profile so the Wi-Fi works', ok: false, feedback: 'A network should not need a device profile. Profiles can change settings and route your traffic.' },
        { text: 'Decline, disconnect, and ask the staff', ok: true, feedback: 'Declining is safe. If the network is real, staff can explain the correct login steps.' },
        { text: 'Enter your Apple or Google password to continue', ok: false, feedback: 'A Wi-Fi login never needs your device account password. This is credential theft.' }
      ]
    },
    {
      label: 'Send a document',
      prompt: 'You need to send a scan of your ID to a landlord. What is the safest move?',
      options: [
        { text: 'Send it now over the café Wi-Fi', ok: false, feedback: 'Identity documents deserve a trusted connection and a verified recipient.' },
        { text: 'Wait and send it over mobile data or your own hotspot', ok: true, feedback: 'Use a connection you control, and confirm the recipient’s address before sending.' },
        { text: 'Email it without checking the address — speed matters', ok: false, feedback: 'A mistyped address leaks your ID. Slow down for identity documents.' }
      ]
    }
  ];

  return {
    STAGES,
    STAGE_TIPS,
    LESSONS,
    PHISHING_CASES,
    SITE_CASES,
    PRIVACY_ITEMS,
    CHAT_SCENARIOS,
    WIFI_STEPS,
    AVATAR_COLORS,
    ACCESSORIES,
    PETS
  };
})();
