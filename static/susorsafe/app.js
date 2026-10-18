/* ==========================================================
   SusOrSafe — app logic
   State lives in localStorage. Nothing leaves the browser.
   ========================================================== */

(() => {
  'use strict';

  /* Keep in-page links predictable; do not restore the certificate scroll
     position when the user opens the lessons page again. */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  const {
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
  } = window.SUSOR_DATA;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const STORE_KEY = 'susorsafe.v2';

  const MODE_INFO = {
    kid: {
      badge: 'Little Islander',
      themeColor: '#F0EAFE',
      homeAudience: 'For young learners and their families',
      homeCopy:'Is that prize real? Should you share that password? Play short games and learn how to make safer choices online.',
      toolkitCopy:'Pause before you click, share, or download. If something feels strange, ask a trusted grown-up for help.',
      gamesCopy: 'Spot tricky messages, protect your passwords, and earn rewards. Take your time — there’s no timer!',
      hint: "Learn through play, one safe choice at a time. Younger explorers can team up with a trusted grown-up."
    },
    teen: {
      badge: 'Digital Navigator',
      themeColor: '#080b1c',
      homeAudience: 'For high school through college',
      homeCopy: 'Fake jobs, concert tickets, scholarship offers, gaming giveaways, and copycat sign-in pages can target your money or accounts. Practise checking before you click or pay.',
      toolkitCopy: 'Fake job offers, ticket deals, housing listings, and gaming giveaways can steal logins or money. Check the real account and website before you pay.',
      gamesCopy: 'Practise realistic decisions around social DMs, ticket and job offers, account security, privacy, and public networks.',
      hint: 'Made for high school, college and early independence, with social, gaming, job, housing and money scenarios. Judge first, then read the breakdown.'
    },
    adult: {
      badge: 'Online Guardian',
      themeColor: '#f8f5f0',
      homeAudience: 'For midlife through older adulthood',
      homeCopy: 'A caller posing as your bank, a fake parcel fee, a too-good investment, or an urgent message from family can be a scam. Practise pausing and checking before sharing a code or sending money.',
      toolkitCopy: 'Fake bank calls, parcel-fee texts, investment pitches, and urgent family messages can pressure you to share codes or move money. Verify using a number you already trust.',
      gamesCopy: 'Work through practical scenarios about impersonation, account protection, privacy choices, and safer networks at a comfortable pace.',
      hint: 'Made for working life, caregiving and retirement, with calm, practical guidance on fake support, investments and transfer traps.'
    }
  };

  const LEVEL_META = {
    1: { name: 'Spot it', blurb: 'Name the attack, notice the pressure, read the URL.' },
    2: { name: 'Protect it', blurb: 'Long passwords, a second key, and less oversharing.' },
    3: { name: 'Live it', blurb: 'Make safe calls on public networks and shared devices.' }
  };

  const AGE_FOCUS = {
    kid: { lessons: [1, 2, 4, 6], text: 'pretend prizes, asking a grown-up, sharing, passwords' },
    teen: { lessons: [2, 3, 4, 6], text: 'account theft, job and housing scams, fake sites, privacy' },
    adult: { lessons: [2, 3, 5, 7], text: 'fake support, investment and transfer scams, 2FA, public Wi-Fi' }
  };

  const ARCADE_GAMES = [
    {
      id: 1, kind: 'ai', icon: 'eye',
      modes: {
        kid: { title: 'AI or a person?', detail: 'Guess who made a silly story, then learn why a guess cannot prove it.', rounds: [
          { prompt: '“A banana wore tiny boots and marched to the moon.” Who made this pretend line?', options: ['AI helped write it', 'A person wrote it'], answer: 0, feedback: 'This practice line was made with AI. In real life, writing style alone cannot prove who made something.' },
          { prompt: '“My dog stole my sock and hid it under the sofa.” Who made this pretend line?', options: ['AI helped write it', 'A person wrote it'], answer: 1, feedback: 'This practice line was written by a person. Real people and AI can sound alike, so check where something came from.' },
          { prompt: 'A funny picture looks a little strange. Is that proof it was made by AI?', options: ['Yes, looks are proof', 'No, check its source'], answer: 1, feedback: 'Right! Pictures can be edited, unusual, or AI-made. Looks are a clue to pause, not proof.' }
        ] },
        teen: { title: 'AI or human? Quick guess', detail: 'Compare online-style posts and learn not to trust a guess as proof.', rounds: [
          { prompt: '“This one trick guarantees you a scholarship—DM your login to claim it.” Who made this practice post?', options: ['AI helped write it', 'A person wrote it'], answer: 0, feedback: 'This practice example was AI-written. But urgency and requests for logins matter more than guessing the author.' },
          { prompt: '“I made a playlist for the bus ride. What are you listening to?” Who made this practice post?', options: ['AI helped write it', 'A person wrote it'], answer: 1, feedback: 'This practice example was person-written. You cannot reliably prove authorship from a short post alone.' },
          { prompt: 'A voice note sounds polished and familiar. Does that prove it is genuine?', options: ['Yes, it sounds familiar', 'No, verify another way'], answer: 1, feedback: 'Correct. AI can imitate voices. Call the person using a number you already have before acting on an urgent request.' }
        ] },
        adult: { title: 'AI or real? Check the source', detail: 'Try an authorship guessing game, then practise verifying the important details.', rounds: [
          { prompt: '“Your bank account is frozen. Read this code to me now.” Who made this practice message?', options: ['AI helped write it', 'A person wrote it'], answer: 0, feedback: 'This practice message was AI-written. A real-looking message can still be deceptive; never share a verification code.' },
          { prompt: '“Could we move lunch to Friday? I can meet at noon.” Who made this practice message?', options: ['AI helped write it', 'A person wrote it'], answer: 1, feedback: 'This practice message was person-written. A short message is not enough to prove who sent a real message.' },
          { prompt: 'A familiar voice asks for an urgent transfer. Is the voice alone proof?', options: ['Yes, the voice is proof', 'No, verify another way'], answer: 1, feedback: 'Right. AI can imitate voices. Hang up and call the person using a number you already trust.' }
        ] }
      }
    },
    {
      id: 2, kind: 'blank', icon: 'chat',
      modes: {
        kid: { title: 'Fill in the safety blank', detail: 'Pick the missing word to finish each friendly safety tip.', rounds: [
          { prompt: 'A stranger asks for your game password. Keep it ___.', options: ['secret', 'on a public post', 'in the chat'], answer: 0, feedback: 'Passwords are secret. Never send yours in a chat or post.' },
          { prompt: 'A message says “Hurry! You won a prize!” First, ___ and ask a grown-up.', options: ['pause', 'tap every link', 'send your name'], answer: 0, feedback: 'Pausing gives you time to check with a trusted grown-up.' },
          { prompt: 'Someone says “Don’t tell anyone.” A safe helper lets you ___ a trusted grown-up.', options: ['tell', 'hide it from', 'send a code to'], answer: 0, feedback: 'A safe helper will not demand secrets. Tell a trusted grown-up.' }
        ] },
        teen: { title: 'Fill in the missing move', detail: 'Complete each response to a believable online pressure tactic.', rounds: [
          { prompt: 'An “employer” asks you to pay a fee to get the job. ___ the offer independently.', options: ['Verify', 'Pay quickly', 'Share your login with'], answer: 0, feedback: 'Verify the company using contact details you find independently, not the message.' },
          { prompt: 'A friend asks for a sign-in code by DM. Keep the code ___.', options: ['private', 'in the group chat', 'in your profile'], answer: 0, feedback: 'One-time codes are private. Contact your friend through another channel.' },
          { prompt: 'A ticket deal pressures you to pay now. Open the official ___ yourself.', options: ['site or app', 'link they sent', 'payment form'], answer: 0, feedback: 'Use the official app or site you navigate to yourself, not their link.' }
        ] },
        adult: { title: 'Complete the safer response', detail: 'Fill the gap with the best next step for each unexpected request.', rounds: [
          { prompt: 'A caller says to move funds to a “safe account.” ___ and contact your bank using a known number.', options: ['Hang up', 'Share the transfer code', 'Follow their instructions'], answer: 0, feedback: 'Hang up and call your bank using the number on your card or statement.' },
          { prompt: 'A text demands a delivery fee through a shortened link. Verify using the carrier’s ___.', options: ['official app or website', 'reply button', 'payment link'], answer: 0, feedback: 'Navigate to the official carrier app or site yourself to check a delivery.' },
          { prompt: 'A one-time sign-in code arrives unexpectedly. Keep the code ___.', options: ['private', 'available to the caller', 'in a public note'], answer: 0, feedback: 'Never disclose a one-time code to someone who contacted you.' }
        ] }
      }
    },
    {
      id: 3, kind: 'choose', icon: 'map',
      modes: {
        kid: { title: 'Pick the safe choice', detail: 'Choose what your explorer should do in each little story.', rounds: [
          { prompt: 'A game pop-up promises free coins if you type your password. What do you do?', options: ['Close it and ask a grown-up', 'Type the password', 'Ask the stranger for more coins'], answer: 0, feedback: 'Free coins are not worth giving away your password. Ask a trusted grown-up.' },
          { prompt: 'A chat friend asks you to keep a secret about a gift card. What now?', options: ['Stop and tell a trusted grown-up', 'Buy the gift card', 'Send your home address'], answer: 0, feedback: 'Stop and tell a trusted grown-up whenever an online contact asks for secrecy or money.' },
          { prompt: 'You are not sure a link is safe. What is a good next step?', options: ['Ask a trusted grown-up to check', 'Tap it quickly', 'Send it to more friends'], answer: 0, feedback: 'Asking for help is a smart safety move.' }
        ] },
        teen: { title: 'Choose your next move', detail: 'Make a call in realistic situations involving accounts, money, and messages.', rounds: [
          { prompt: 'A class group chat shares a “free ticket” login link. What next?', options: ['Check the official ticket site yourself', 'Sign in through the link', 'Forward it with your school email'], answer: 0, feedback: 'Go to the official ticket site yourself; a familiar chat can still share a fake link.' },
          { prompt: 'A recruiter wants an upfront fee and a photo of your ID in chat. Choose a move.', options: ['Verify the employer and request securely', 'Pay to hold the role', 'Send ID in the DM'], answer: 0, feedback: 'Verify the employer independently and do not send identity documents through an unexpected chat.' },
          { prompt: 'Someone claiming to be your friend urgently needs a login code. What next?', options: ['Contact your friend another way', 'Send the code', 'Post it so they see it'], answer: 0, feedback: 'Verify through a separate channel. Never share a sign-in code.' }
        ] },
        adult: { title: 'Choose a safe next step', detail: 'Select a measured response to pressure, impersonation, and account requests.', rounds: [
          { prompt: 'A caller claiming to be your bank warns of fraud and demands a transfer. What next?', options: ['End the call and use your card’s number', 'Transfer funds as instructed', 'Share the texted code'], answer: 0, feedback: 'End the call and contact the bank through a known, independently sourced number.' },
          { prompt: 'A family member texts from a new number asking for urgent money. Choose a response.', options: ['Call their saved number to confirm', 'Send money to the new account', 'Reply with banking details'], answer: 0, feedback: 'Contact the family member through a number you already have before sending money.' },
          { prompt: 'A support agent asks you to install a remote-access app. What do you do?', options: ['End contact and reach support independently', 'Install it while they wait', 'Share your account code'], answer: 0, feedback: 'Unexpected remote access can expose your device. Contact the company using a known route.' }
        ] }
      }
    },
    {
      id: 4, kind: 'realfake', icon: 'eye',
      modes: {
        kid: { title: 'Real or pretend?', detail: 'Spot a pretend online offer. In real life, ask a grown-up before you tap.', rounds: [
          { prompt: '“Free game gems! Give us your password and nobody needs to know.”', options: ['Pretend / not safe', 'Okay to trust'], answer: 0, feedback: 'A prize plus a password request and secrecy is a big warning. Do not share the password.' },
          { prompt: 'A game update appears inside the official app store you opened yourself.', options: ['Pretend / not safe', 'More likely genuine'], answer: 1, feedback: 'An update from the app store you opened yourself is a safer route. Ask a grown-up if unsure.' },
          { prompt: 'A message says you won a prize you never entered and must tap now.', options: ['Pretend / suspicious', 'Definitely real'], answer: 0, feedback: 'Unexpected prizes and pressure are suspicious. Do not tap; ask a trusted grown-up.' }
        ] },
        teen: { title: 'Real or fake? Message check', detail: 'Classify practice offers, then remember to verify messages out of game.', rounds: [
          { prompt: '“Your concert tickets are held. Sign in at tickets.example-login.test in 5 minutes.”', options: ['Suspicious / likely fake', 'Verified genuine'], answer: 0, feedback: 'The unfamiliar sign-in address and countdown are warning signs. Visit the ticket seller’s official site yourself.' },
          { prompt: 'You open your school portal from a bookmark and see its usual sign-in page.', options: ['Suspicious / likely fake', 'A safer route'], answer: 1, feedback: 'Using a bookmark you already trust is safer than following an unexpected sign-in link.' },
          { prompt: 'A “scholarship” DM requests your account password to release funds.', options: ['Suspicious / likely fake', 'Verified genuine'], answer: 0, feedback: 'A legitimate scholarship does not need your password in a DM. Verify with the official institution.' }
        ] },
        adult: { title: 'Real or fake? Check the signal', detail: 'Separate warning signs from safer verification habits in practice examples.', rounds: [
          { prompt: '“Your parcel is held. Pay a fee now at delivery-payment.example.test.”', options: ['Suspicious / likely fake', 'Verified genuine'], answer: 0, feedback: 'The unexpected payment link is suspicious. Check delivery status using the carrier’s official app or site.' },
          { prompt: 'You call the number printed on your bank card and ask about a transaction.', options: ['Suspicious route', 'A safer verification route'], answer: 1, feedback: 'Calling the number on your card is an independently chosen way to verify a bank issue.' },
          { prompt: 'A caller claiming to be police asks you to move savings to protect them.', options: ['Suspicious / likely fake', 'Verified genuine'], answer: 0, feedback: 'No legitimate authority should demand a transfer to a “safe account.” Hang up and independently contact your bank.' }
        ] }
      }
    },
    {
      id: 5, kind: 'password', icon: 'key',
      modes: {
        kid: { title: 'Pick the strongest secret', detail: 'Choose the best pretend password idea. Never type a real password in a game.', rounds: [
          { prompt: 'Which pretend password idea is hardest to guess?', options: ['blue-cat-reads-3-books', 'cat123', 'your first name'], answer: 0, feedback: 'A longer, unique passphrase is harder to guess. Keep your real password secret.' },
          { prompt: 'A friend asks to use your game password. What is strongest protection?', options: ['Keep it private', 'Send it just once', 'Post it temporarily'], answer: 0, feedback: 'Keep passwords private, even with friends. Use account-sharing features only with a grown-up’s help.' },
          { prompt: 'You want a password for a new account. Which is safest?', options: ['A new, long password', 'The same one as every game', 'Your birthday'], answer: 0, feedback: 'Use a different long password for each account, ideally saved in a password manager with adult help.' }
        ] },
        teen: { title: 'Password pick-and-compare', detail: 'Choose safer account habits without entering or revealing a real password.', rounds: [
          { prompt: 'Which sample passphrase is strongest?', options: ['Orbit!River7-Maple-Cloud', 'Concert2026', 'same-password-everywhere'], answer: 0, feedback: 'Long and unique beats short or reused. These are examples only—do not use a displayed sample as your password.' },
          { prompt: 'One account appears in a data breach. What helps limit fallout?', options: ['Unique passwords stored in a manager', 'Reuse the password with a symbol', 'Share the password with a friend'], answer: 0, feedback: 'Unique passwords stop one breach from unlocking every account.' },
          { prompt: 'A site asks you to confirm your password in a DM. Choose the safer move.', options: ['Do not send it; use the official app', 'Send it if the logo looks right', 'Add a one-time code too'], answer: 0, feedback: 'Never send passwords or codes in messages. Open the official app or site yourself.' }
        ] },
        adult: { title: 'Build better password habits', detail: 'Compare example passphrases and account-protection choices; never enter a real password.', rounds: [
          { prompt: 'Which sample is a better starting point for a unique password?', options: ['Lighthouse-river-amber-42', 'NameAndBirthYear', 'OnePasswordForAll'], answer: 0, feedback: 'A long, unique password is preferable. Use a password manager to generate and store one safely.' },
          { prompt: 'A password was reused on a breached website. What is the priority?', options: ['Change it anywhere it was reused', 'Wait to see if anything happens', 'Add the same password to more accounts'], answer: 0, feedback: 'Change reused passwords promptly, starting with email, financial, and other critical accounts.' },
          { prompt: 'An unexpected caller asks you to read a sign-in code aloud. What is safer?', options: ['End contact; never share the code', 'Read it if they know your name', 'Share it after changing your password'], answer: 0, feedback: 'Verification codes are private. Contact the service through its official site or app.' }
        ] }
      }
    },
    {
      id: 6, kind: 'privacy', icon: 'lock',
      modes: {
        kid: { title: 'Share it or keep it?', detail: 'Choose the safe way to handle personal information online.', rounds: [
          { prompt: 'A stranger in a game asks which school you go to.', options: ['Keep it private and tell a grown-up', 'Tell them your school', 'Share your daily route too'], answer: 0, feedback: 'Your school and routines are private. Tell a trusted grown-up about the request.' },
          { prompt: 'A fun quiz asks for your home address to show your result.', options: ['Ask a grown-up before sharing', 'Type it in quickly', 'Post it in game chat'], answer: 0, feedback: 'A quiz does not need your home address. Ask a grown-up before sharing personal details.' },
          { prompt: 'Which is safer to share in a public game chat?', options: ['A made-up nickname', 'Your full name and school', 'Your home address'], answer: 0, feedback: 'A nickname protects your identity better. Keep your full name, school, and address private.' }
        ] },
        teen: { title: 'Public, private, or too much?', detail: 'Choose how to handle personal details in everyday social situations.', rounds: [
          { prompt: 'A public post shows your school badge and live location. What is safer?', options: ['Remove the location and limit the audience', 'Post it publicly in real time', 'Add your daily schedule'], answer: 0, feedback: 'Avoid live location and details that reveal where you study or when you are away.' },
          { prompt: 'A scholarship form asks for identity documents through an unverified DM.', options: ['Verify the organization and secure process', 'Send photos in the DM', 'Post the documents to prove it'], answer: 0, feedback: 'Verify through the official institution before sending sensitive documents.' },
          { prompt: 'A new app asks for contacts and precise location without a clear need.', options: ['Review permissions and deny what is unnecessary', 'Allow every permission', 'Share a friend’s details too'], answer: 0, feedback: 'Grant only the permissions an app needs; revisit settings if its purpose is unclear.' }
        ] },
        adult: { title: 'Privacy pick-and-sort', detail: 'Select a lower-exposure choice for personal data and account access.', rounds: [
          { prompt: 'A social post reveals an empty home and the dates you will be away.', options: ['Limit the audience and avoid live travel details', 'Post it publicly before leaving', 'Include your address for friends'], answer: 0, feedback: 'Share travel details with trusted people privately, preferably after returning.' },
          { prompt: 'A benefits message requests identity documents through an unexpected link.', options: ['Contact the agency using a known official route', 'Upload them through the link', 'Reply with extra account details'], answer: 0, feedback: 'Use an independently verified official channel before sharing identity information.' },
          { prompt: 'An app requests access to contacts and location for a feature that does not need them.', options: ['Deny unnecessary permissions', 'Allow access without checking', 'Share family contacts too'], answer: 0, feedback: 'Limit permissions to what is necessary and review them periodically.' }
        ] }
      }
    },
    {
      id: 7, kind: 'wifi', icon: 'wifi',
      modes: {
        kid: { title: 'Choose a safer connection', detail: 'Pick what to do before opening a game or sharing something private.', rounds: [
          { prompt: 'A cafe Wi-Fi says “Free_Guest” and asks for your game password to join.', options: ['Stop and ask a grown-up', 'Enter your password', 'Ask a stranger to join for you'], answer: 0, feedback: 'Wi-Fi should not need your game password. Ask a trusted grown-up before joining.' },
          { prompt: 'You want to sign in while out with family. What is best?', options: ['Ask a grown-up and use a trusted connection', 'Use any network that pops up', 'Tell someone your sign-in code'], answer: 0, feedback: 'Use a connection your grown-up trusts, and never share a sign-in code.' },
          { prompt: 'A network name looks almost like the library’s Wi-Fi. What now?', options: ['Check with library staff or a grown-up', 'Guess and connect', 'Use it for a private login'], answer: 0, feedback: 'Ask staff or a trusted grown-up to confirm the exact network name.' }
        ] },
        teen: { title: 'Public Wi-Fi pick-and-play', detail: 'Choose a safer connection for real-world study, travel, and account tasks.', rounds: [
          { prompt: 'At a cafe, two networks have almost the same name. What do you do?', options: ['Confirm the exact name with staff', 'Join the first one', 'Use one for banking'], answer: 0, feedback: 'Verify the exact network name with staff; copycat hotspots can capture traffic or redirect you.' },
          { prompt: 'You need to change a payment detail on open public Wi-Fi.', options: ['Wait or switch to trusted mobile data', 'Use the network because it has a lock icon', 'Ask someone nearby to log in'], answer: 0, feedback: 'A lock icon does not prove a hotspot is trustworthy. Wait or use a connection you control.' },
          { prompt: 'A public Wi-Fi login page asks for your social account password.', options: ['Do not enter it; verify the network', 'Enter it to unlock faster Wi-Fi', 'Reuse your email password'], answer: 0, feedback: 'A hotspot should not ask for your unrelated account password. Stop and verify.' }
        ] },
        adult: { title: 'Safer network decisions', detail: 'Choose a lower-risk connection before banking or other sensitive tasks.', rounds: [
          { prompt: 'Two airport Wi-Fi names look similar and one requests your email password.', options: ['Confirm with airport staff; do not enter your email password', 'Choose either one and sign in', 'Use the suspicious one for banking'], answer: 0, feedback: 'Verify the network with staff. A public hotspot should not need an unrelated account password.' },
          { prompt: 'You need to access a financial account while on untrusted public Wi-Fi.', options: ['Wait or use trusted mobile data', 'Continue because the website has HTTPS', 'Use whichever network is strongest'], answer: 0, feedback: 'HTTPS protects the connection to a site but does not prove a hotspot is legitimate. Use a trusted connection.' },
          { prompt: 'A hotel message links to a Wi-Fi page asking for card details by text.', options: ['Ask the front desk using a known contact route', 'Reply with the card details', 'Forward it to other guests'], answer: 0, feedback: 'Verify the request directly with the hotel using contact information you already trust.' }
        ] }
      }
    }
  ];

  const LESSON_MODE_COPY = {
    kid: {
      1: { title: 'Tricky tricks', subtitle: 'Learn how online tricks try to fool you.', lede: 'Some messages pretend to be fun or important so you will tap before thinking. A trusted grown-up can help you check.' },
      2: { title: 'Pause and check', subtitle: 'Spot messages that rush or worry you.', lede: 'A stranger may pretend to be a friend or say something bad will happen unless you act now. Stop and tell a grown-up.' },
      3: { title: 'Look at the real site', subtitle: 'Find pretend websites before you log in.', lede: 'A fake page can look like your favourite game. Check with a grown-up before typing a password.' },
      4: { title: 'Keep passwords secret', subtitle: 'Make a strong password and protect it.', lede: 'Your password is like a secret key. Do not share it in a chat, even if someone promises a prize.' },
      5: { title: 'Add another lock', subtitle: 'Use a grown-up’s help for an extra account check.', lede: 'An extra sign-in check can help protect your account. Ask a trusted grown-up to set it up with you.' },
      6: { title: 'Keep some things private', subtitle: 'Choose what is safe to share online.', lede: 'Your full name, address, school and private pictures belong to you. Ask a grown-up before sharing them.' },
      7: { title: 'Use Wi-Fi safely', subtitle: 'Stay careful on shared internet.', lede: 'Public Wi-Fi is for many people. Ask a trusted grown-up before signing in or sharing private information on it.' },
      stepLabels: ['Look', 'Words', 'Play', 'Check'],
      vocabIntro: 'Here are three new safety words. You do not have to memorise them; ask a grown-up if one is confusing.',
      quizIntro: 'Try three quick questions. Think about what you would do, and ask a grown-up if you want help.',
      nextWords: 'Next: new words',
      activityLabels: ['Open the message clues', 'Play the chat scene', 'Check the game site', 'Try the password builder', 'Add an extra lock', 'Sort what is okay to share', 'Try the Wi-Fi challenge']
    },
    teen: {
      1: { title: 'How scams work', subtitle: 'Recognize the tactics behind digital fraud.', lede: 'Scams use believable stories, impersonation and urgency to get access to your money or accounts. Learn to spot the pattern before responding.' },
      2: { title: 'Pressure and impersonation', subtitle: 'Check urgent messages before you respond.', lede: 'A fake recruiter, seller or friend may pressure you to pay, share a code or keep a secret. Verify through a channel you already trust.' },
      3: { title: 'Check the website', subtitle: 'Catch lookalike pages before signing in.', lede: 'A cloned job, ticket or social page can capture your login. Check the address and open the official app or site yourself.' },
      4: { title: 'Secure your accounts', subtitle: 'Use unique passwords and protect your logins.', lede: 'Reused passwords put multiple accounts at risk. Use a password manager to create a different password for each important account.' },
      5: { title: 'Protect sign-ins', subtitle: 'Add a second verification step to key accounts.', lede: 'Multi-factor authentication can stop a stolen password from being enough. Never share a one-time sign-in code with someone who contacts you.' },
      6: { title: 'Control your digital footprint', subtitle: 'Limit what strangers can learn about you.', lede: 'Public posts, profiles and location clues can make impersonation more convincing. Review privacy settings and think before sharing.' },
      7: { title: 'Public Wi-Fi decisions', subtitle: 'Reduce risk on networks you do not control.', lede: 'On shared Wi-Fi, avoid sensitive transactions unless the connection and site are verified. Mobile data or waiting for a trusted network may be safer.' },
      stepLabels: ['Overview', 'Key ideas', 'Try it', 'Quick check'],
      vocabIntro: 'Three useful terms for recognizing the pattern and deciding what to do next.',
      quizIntro: 'Check your judgement with three short scenarios. Focus on the safest next step.',
      nextWords: 'Next: key ideas',
      activityLabels: ['Review the message clues', 'Practice the conversation', 'Check the website', 'Test password strength', 'Set up a second factor', 'Explore the privacy map', 'Take the Wi-Fi challenge']
    },
    adult: {
      1: { title: 'Common scam patterns', subtitle: 'Recognize the methods behind online fraud.', lede: 'Fraudsters impersonate trusted organizations, create urgency and steer people toward payment or account access. Knowing the pattern makes it easier to pause.' },
      2: { title: 'Urgency and impersonation', subtitle: 'Verify unexpected requests before taking action.', lede: 'A caller posing as a bank, service provider or relative may demand secrecy, a code or an immediate transfer. Contact the person or organization using a known number.' },
      3: { title: 'Verify websites and links', subtitle: 'Avoid lookalike sign-in and payment pages.', lede: 'A convincing copy of a bank, delivery or government page can collect credentials and payment details. Navigate using a saved bookmark or official app.' },
      4: { title: 'Protect important accounts', subtitle: 'Use unique passwords and safer storage.', lede: 'Reused passwords let one breach expose multiple accounts. A reputable password manager can create and store distinct passwords.' },
      5: { title: 'Strengthen account access', subtitle: 'Set up an additional sign-in safeguard.', lede: 'Multi-factor authentication adds protection if a password is exposed. Treat unexpected approval prompts and verification codes as private.' },
      6: { title: 'Limit personal information', subtitle: 'Reduce details that enable targeted impersonation.', lede: 'Public records, social posts and family details can help a scammer sound convincing. Share selectively and review account privacy settings.' },
      7: { title: 'Safer public Wi-Fi', subtitle: 'Protect sensitive activity on shared networks.', lede: 'Avoid financial or sensitive account activity on networks you cannot verify. Use your own trusted connection when possible.' },
      stepLabels: ['Overview', 'Key terms', 'Practice', 'Review'],
      vocabIntro: 'Three practical terms to make it easier to assess the risk and choose a response.',
      quizIntro: 'Review the safest response in each situation. These checks are for practice, not a formal test.',
      nextWords: 'Next: key terms',
      activityLabels: ['Inspect the message', 'Review the conversation', 'Verify the website', 'Check password strength', 'Review account protection', 'Review privacy settings', 'Assess the network']
    }
  };

  const ACCESSORY_EMOJI = {
    none: '—',
    cap: '🧢',
    glasses: '👓',
    headphones: '🎧',
    crown: '👑',
    scarf: '🧣',
    bow: '🎀',
    backpack: '🎒',
    headband: '🌟'
  };

  const STAR = n => '★'.repeat(n) + '☆'.repeat(3 - n);

  const defaultState = () => ({
    mode: 'kid',
    school: 'primary',
    stagesByMode: { kid: 'primary', teen: 'high', adult: 'working' },
    coins: 0,
    lessons: {},
    avatar: { color: 'mint', accessory: 'none', pet: 'pip' },
    owned: {
      colors: ['mint', 'lime'],
      accessories: ['none'],
      pets: ['none', 'pip']
    },
    name: '',
    petName: 'Pip',
    sound: false,
    unlockAll: false,
    arcade: {},
    last_place: ''
  });

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  function getCsrfToken() {
    const formInput = document.querySelector('input[name="csrfmiddlewaretoken"]');
    if (formInput && formInput.value) return formInput.value;
    return getCookie('csrftoken') || '';
  }

  function loadState() {
    // 1. Check if client data should be cleared on signout
    const hasClearCookie = document.cookie.split(';').some(c => c.trim().startsWith('susorsafe_clear_client='));
    const urlParams = new URLSearchParams(window.location.search);
    const isLoggedOutParam = urlParams.get('logged_out') === '1';
    if (hasClearCookie || isLoggedOutParam || window.SUSORSAFE_CLEAR_CLIENT) {
      try {
        localStorage.removeItem(STORE_KEY);
        localStorage.removeItem('susorsafe_mode');
        sessionStorage.clear();
      } catch (err) {}
      document.cookie = 'susorsafe_clear_client=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      if (isLoggedOutParam) {
        urlParams.delete('logged_out');
        const newSearch = urlParams.toString();
        const newUrl = window.location.pathname + (newSearch ? '?' + newSearch : '') + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);
      }
    }

    const base = defaultState();
    let parsed = null;
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) parsed = JSON.parse(raw);
    } catch (err) {}

    let serverState = null;
    try {
      const serverScript = document.getElementById('user-server-state');
      if (serverScript && serverScript.textContent.trim()) {
        const text = serverScript.textContent.trim();
        if (text !== 'null' && text !== '{}' && text !== '""') {
          serverState = JSON.parse(text);
        }
      }
    } catch (err) {
      console.warn('Could not parse server state:', err);
    }

    if (!parsed && !serverState) {
      return base;
    }

    // If switching user accounts on the same browser, discard other user's local state
    if (serverState && parsed && parsed.username && serverState.username && parsed.username !== serverState.username) {
      parsed = null;
    }

    const source = parsed || {};
    const savedStages = (serverState?.stagesByMode || source.stagesByMode) && typeof (serverState?.stagesByMode || source.stagesByMode) === 'object' && !Array.isArray(serverState?.stagesByMode || source.stagesByMode)
      ? (serverState?.stagesByMode || source.stagesByMode)
      : {};
    const stagesByMode = { ...base.stagesByMode, ...savedStages };

    // Merge lessons
    const mergedLessons = { ...(source.lessons || {}) };
    if (serverState?.lessons && typeof serverState.lessons === 'object') {
      Object.entries(serverState.lessons).forEach(([lid, sRec]) => {
        const lRec = mergedLessons[lid];
        if (!lRec) {
          mergedLessons[lid] = sRec;
        } else {
          mergedLessons[lid] = {
            stars: Math.max(Number(lRec.stars) || 0, Number(sRec.stars) || 0),
            quiz: Math.max(Number(lRec.quiz) || 0, Number(sRec.quiz) || 0),
            at: sRec.at || lRec.at || new Date().toISOString()
          };
        }
      });
    }

    // Merge arcade games
    const mergedArcade = { ...(source.arcade || {}) };
    if (serverState?.arcade && typeof serverState.arcade === 'object') {
      Object.entries(serverState.arcade).forEach(([gid, sRec]) => {
        const aRec = mergedArcade[gid];
        if (!aRec) {
          mergedArcade[gid] = sRec;
        } else {
          mergedArcade[gid] = {
            best: Math.max(Number(aRec.best) || 0, Number(sRec.best) || 0),
            attempts: Math.max(Number(aRec.attempts) || 0, Number(sRec.attempts) || 0)
          };
        }
      });
    }

    const merged = {
      ...base,
      ...source,
      ...(serverState || {}),
      stagesByMode,
      coins: Math.max(Number(serverState?.coins) || 0, Number(source?.coins) || 0),
      mode: (source?.mode && MODE_INFO[source.mode]) ? source.mode : (serverState?.mode && MODE_INFO[serverState.mode]) ? serverState.mode : base.mode,
      last_place: serverState?.last_place || source?.last_place || '',
      lessons: mergedLessons,
      arcade: mergedArcade,
      avatar: { ...base.avatar, ...(source.avatar || {}), ...(serverState?.avatar || {}) },
      owned: {
        colors: Array.from(new Set([...(base.owned.colors), ...(source.owned?.colors || []), ...(serverState?.owned?.colors || [])])),
        accessories: Array.from(new Set([...(base.owned.accessories), ...(source.owned?.accessories || []), ...(serverState?.owned?.accessories || [])])),
        pets: Array.from(new Set([...(base.owned.pets), ...(source.owned?.pets || []), ...(serverState?.owned?.pets || [])]))
      },
      name: serverState?.name || source?.name || '',
      petName: serverState?.petName || source?.petName || 'Pip',
      username: serverState?.username || source?.username || ''
    };

    if (serverState) {
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(merged));
      } catch (e) {}
    }

    return merged;
  }

  let state = loadState();
  if (!MODE_INFO[state.mode]) state.mode = 'kid';
  Object.keys(STAGES).forEach(mode => {
    if (!STAGES[mode].some(stage => stage.id === state.stagesByMode[mode])) {
      state.stagesByMode[mode] = defaultState().stagesByMode[mode];
    }
  });
  state.school = state.stagesByMode.kid;
  if (!AVATAR_COLORS.some(c => c.id === state.avatar.color)) state.avatar.color = 'mint';
  if (!ACCESSORIES.some(a => a.id === state.avatar.accessory)) state.avatar.accessory = 'none';
  if (!PETS.some(p => p.id === state.avatar.pet)) state.avatar.pet = 'pip';
  ['colors', 'accessories', 'pets'].forEach(type => {
    if (!Array.isArray(state.owned[type])) state.owned[type] = defaultState().owned[type];
  });
  if (!state.owned.colors.includes('mint')) state.owned.colors.push('mint');
  if (!state.owned.colors.includes('lime')) state.owned.colors.push('lime');
  if (!state.owned.accessories.includes('none')) state.owned.accessories.push('none');
  if (!state.owned.pets.includes('none')) state.owned.pets.push('none');
  if (!state.owned.pets.includes('pip')) state.owned.pets.push('pip');
  if (typeof state.name !== 'string') state.name = '';
  if (typeof state.petName !== 'string') state.petName = 'Pip';
  if (!state.arcade || typeof state.arcade !== 'object' || Array.isArray(state.arcade)) state.arcade = {};

  let pendingCelebration = false;
  let toastTimer = null;

  let syncTimer = null;
  let isSyncing = false;
  let syncPending = false;

  function progressSyncRequest(path = '', options = {}) {
    const config = window.SUSORSAFE_PROGRESS || {};
    const origin = String(config.apiOrigin || window.location.origin).replace(/\/$/, '');
    const headers = { ...(options.headers || {}) };
    if (config.token) headers.Authorization = `Bearer ${config.token}`;
    return fetch(`${origin}${path}`, {
      ...options,
      headers,
      credentials: config.token ? 'omit' : 'same-origin'
    });
  }

  function syncToDatabase(immediate = false) {
    if (!window.SUSORSAFE_USER || !window.SUSORSAFE_USER.isAuthenticated) {
      return;
    }
    if (syncTimer) {
      clearTimeout(syncTimer);
      syncTimer = null;
    }
    if (immediate) {
      doSync();
      return;
    }
    syncTimer = setTimeout(doSync, 600);
  }

  function doSync() {
    if (!window.SUSORSAFE_USER || !window.SUSORSAFE_USER.isAuthenticated) return;
    if (isSyncing) {
      syncPending = true;
      return;
    }
    isSyncing = true;
    syncPending = false;

    const payload = JSON.stringify(state);
    progressSyncRequest('/api/user-progress-sync/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCsrfToken()
      },
      credentials: 'same-origin',
      keepalive: true,
      body: payload
    })
      .then(res => res.json())
      .then(() => {
        isSyncing = false;
        if (syncPending) {
          syncPending = false;
          doSync();
        }
      })
      .catch(() => {
        isSyncing = false;
      });
  }

  function fetchServerState() {
    if (!window.SUSORSAFE_USER || !window.SUSORSAFE_USER.isAuthenticated) return;
    progressSyncRequest('/api/user-progress-sync/')
      .then(res => res.json())
      .then(data => {
        if (data && data.authenticated && data.state) {
          applyServerState(data.state);
        }
      })
      .catch(() => {});
  }

  function applyServerState(sState) {
    if (!sState || typeof sState !== 'object') return;
    let changed = false;
    const sCoins = Number(sState.coins) || 0;
    if (sCoins > state.coins) {
      state.coins = sCoins;
      changed = true;
    }
    if (sState.lessons && typeof sState.lessons === 'object') {
      Object.entries(sState.lessons).forEach(([id, rec]) => {
        const cur = state.lessons[id];
        if (!cur || (rec.stars > (cur.stars || 0)) || (rec.quiz > (cur.quiz || 0))) {
          state.lessons[id] = {
            stars: Math.max(cur?.stars || 0, rec.stars || 0),
            quiz: Math.max(cur?.quiz || 0, rec.quiz || 0),
            at: rec.at || cur?.at || new Date().toISOString()
          };
          changed = true;
        }
      });
    }
    if (sState.arcade && typeof sState.arcade === 'object') {
      Object.entries(sState.arcade).forEach(([id, rec]) => {
        const cur = state.arcade[id];
        if (!cur || (rec.best > (cur.best || 0)) || (rec.attempts > (cur.attempts || 0))) {
          state.arcade[id] = {
            best: Math.max(cur?.best || 0, rec.best || 0),
            attempts: Math.max(cur?.attempts || 0, rec.attempts || 0)
          };
          changed = true;
        }
      });
    }
    if (sState.last_place && sState.last_place !== state.last_place) {
      state.last_place = sState.last_place;
      changed = true;
    }
    if (changed) {
      save();
      renderAll();
    }
  }

  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (err) {
      /* private mode / storage disabled — page still works */
    }
    syncToDatabase();
  }

  /* ==========================================================
     Small helpers
     ========================================================== */

  const toastEl = $('#toast');

  function toast(message, duration = 2800) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), duration);
  }

  let audioCtx = null;

  function getAudio() {
    if (!state.sound) return null;
    try {
      if (!audioCtx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        audioCtx = new AC();
      }
      if (audioCtx.state === 'suspended') audioCtx.resume();
      return audioCtx;
    } catch (err) {
      return null;
    }
  }

  function tone(freq, offset, duration, type = 'sine', volume = 0.08) {
    const ac = getAudio();
    if (!ac) return;
    const t0 = ac.currentTime + offset;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.05);
  }

  function playSound(kind) {
    if (!state.sound) return;
    if (kind === 'correct') {
      tone(880, 0, 0.12, 'sine', 0.1);
      tone(1174.66, 0.09, 0.18, 'sine', 0.09);
    } else if (kind === 'wrong') {
      tone(220, 0, 0.16, 'triangle', 0.07);
      tone(174.61, 0.11, 0.22, 'triangle', 0.06);
    } else if (kind === 'win') {
      tone(523.25, 0, 0.13, 'sine', 0.09);
      tone(659.25, 0.1, 0.13, 'sine', 0.09);
      tone(783.99, 0.2, 0.16, 'sine', 0.09);
      tone(1046.5, 0.32, 0.3, 'sine', 0.08);
    } else {
      tone(660, 0, 0.06, 'sine', 0.05);
    }
  }

  const confettiCanvas = $('#confetti');
  let confettiFrame = null;

  function fireConfetti() {
    if (!confettiCanvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = confettiCanvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    confettiCanvas.width = window.innerWidth * dpr;
    confettiCanvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const colors = ['#c8f65a', '#5ce1c4', '#ff7fb6', '#ffcb5c', '#9d8cff', '#7dd3fc'];
    const parts = Array.from({ length: 120 }, () => ({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
      y: window.innerHeight * 0.36 + (Math.random() - 0.5) * 70,
      vx: (Math.random() - 0.5) * 12,
      vy: -Math.random() * 14 - 4,
      w: 4 + Math.random() * 8,
      h: 3 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.35
    }));

    const start = performance.now();
    cancelAnimationFrame(confettiFrame);

    const frame = now => {
      const elapsed = now - start;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      parts.forEach(p => {
        p.vy += 0.32;
        p.vx *= 0.994;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, 1 - elapsed / 2400);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (elapsed < 2400) {
        confettiFrame = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };
    confettiFrame = requestAnimationFrame(frame);
  }

  /* ==========================================================
     Avatar helpers
     ========================================================== */

  function colorFor(id) {
    return AVATAR_COLORS.find(c => c.id === id) || AVATAR_COLORS[0];
  }

  function petFor(id) {
    return PETS.find(p => p.id === id) || PETS[0];
  }

  function accessoryFor(id) {
    return ACCESSORIES.find(a => a.id === id) || ACCESSORIES[0];
  }

  function accessorySVG(id) {
    if (id === 'cap') {
      return '<g class="av-gear"><path d="M28 36q32-28 64 0v6q-32-15-64 0Z" fill="#FF7FB6" stroke="#0B1026" stroke-width="4" stroke-linejoin="round"/><path d="M86 38q18 2 18 9l-24-3Z" fill="#FF7FB6" stroke="#0B1026" stroke-width="4" stroke-linejoin="round"/></g>';
    }
    if (id === 'glasses') {
      return '<g class="av-gear" fill="rgba(255,255,255,.16)" stroke="#0B1026" stroke-width="4"><circle cx="46" cy="66" r="12"/><circle cx="74" cy="66" r="12"/><path d="M58 66h4M34 64l-8-3M86 64l8-3"/></g>';
    }
    if (id === 'headphones') {
      return '<g class="av-gear"><path d="M28 62q2-40 32-40t32 40" fill="none" stroke="#0B1026" stroke-width="8" stroke-linecap="round"/><rect x="20" y="56" width="13" height="26" rx="6" fill="#FF7FB6" stroke="#0B1026" stroke-width="4"/><rect x="87" y="56" width="13" height="26" rx="6" fill="#FF7FB6" stroke="#0B1026" stroke-width="4"/></g>';
    }
    if (id === 'crown') {
      return '<path class="av-gear" d="M34 34 43 14 53 28 60 10 67 28 77 14 86 34Z" fill="#FFCB5C" stroke="#0B1026" stroke-width="4" stroke-linejoin="round"/>';
    }
    if (id === 'scarf') {
      return '<path class="av-gear" d="M31 96q29 13 58 0l-3 13q-25 12-52 0Z" fill="#FF7FB6" stroke="#0B1026" stroke-width="4"/><path d="m66 104 5 23 13-3-5-22Z" fill="#FF7FB6" stroke="#0B1026" stroke-width="4" stroke-linejoin="round"/>';
    }
    if (id === 'bow') {
      return '<g class="av-gear" fill="#FF7FB6" stroke="#0B1026" stroke-width="3"><path d="M32 25 13 17l3 20 17-5ZM35 26l18-10-1 21-18-3Z"/><circle cx="34" cy="27" r="5" fill="#FFCB5C"/></g>';
    }
    if (id === 'backpack') {
      return '<g class="av-gear"><path d="M16 56q-8 3-7 20l3 26q2 9 12 6l10-4-4-47Z" fill="#7DD3FC" stroke="#0B1026" stroke-width="4"/><path d="M12 78q8-7 18-3l2 14q-9 5-18 2Z" fill="#FFCB5C" stroke="#0B1026" stroke-width="3"/></g>';
    }
    if (id === 'headband') {
      return '<g class="av-gear" fill="none" stroke="#0B1026" stroke-width="5"><path d="M31 49q3-31 29-31t29 31" stroke="#FF7FB6"/><path d="m60 12 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1Z" fill="#FFCB5C" stroke-width="2"/></g>';
    }
    return '';
  }

  function avatarSVG(colorId, accessoryId, className = '') {
    const color = colorFor(colorId);
    return `<svg viewBox="0 0 120 140" class="avatar-svg ${className}" aria-hidden="true" focusable="false">
      <ellipse cx="60" cy="132" rx="32" ry="5" fill="#050914" opacity=".4"/>
      <path d="M60 8 L100 24 V64 C100 96 83 116 60 130 C37 116 20 96 20 64 V24 Z" fill="${color.hex}" stroke="#0B1026" stroke-width="5" stroke-linejoin="round"/>
      <path d="M60 17 L92 30 V64 C92 90 78 107 60 119 C42 107 28 90 28 64 V30 Z" fill="#fff" opacity=".14"/>
      <g class="avatar-face">
        <ellipse cx="46" cy="66" rx="6" ry="7" fill="#0B1026"/>
        <ellipse cx="74" cy="66" rx="6" ry="7" fill="#0B1026"/>
        <circle cx="48" cy="63" r="2" fill="#fff"/>
        <circle cx="76" cy="63" r="2" fill="#fff"/>
        <ellipse cx="34" cy="79" rx="6" ry="3" fill="#FF8FB8" opacity=".65"/>
        <ellipse cx="86" cy="79" rx="6" ry="3" fill="#FF8FB8" opacity=".65"/>
        <path d="M50 82q10 9 20 0" fill="none" stroke="#0B1026" stroke-width="4" stroke-linecap="round"/>
      </g>
      ${accessorySVG(accessoryId)}
    </svg>`;
  }

  function currentPet() {
    return petFor(state.avatar.pet);
  }

  function petMarkup(extraClass = '') {
    const pet = currentPet();
    if (pet.id === 'none') return '';
    return `<span class="avatar-pet ${extraClass}" aria-hidden="true">${pet.emoji}</span>`;
  }

  function equippedName() {
    return state.name.trim() || (state.mode === 'kid' ? 'Curious Explorer' : state.mode === 'teen' ? 'Digital Navigator' : 'Online Guardian');
  }

  function petDisplayName() {
    if (state.avatar.pet === 'none') return '';
    return (state.petName || '').trim() || currentPet().name;
  }

  function rankFor(count) {
    if (state.mode === 'kid') {
      if (count >= 7) return 'Island Keeper';
      if (count >= 5) return 'Safety Keeper';
      if (count >= 3) return 'Sharp Spotter';
      if (count >= 1) return 'Curious Explorer';
      return 'New Islander';
    }
    if (state.mode === 'teen') {
      if (count >= 7) return 'Digital Navigator';
      if (count >= 5) return 'Account Defender';
      if (count >= 3) return 'Sharp Spotter';
      if (count >= 1) return 'Scam Aware';
      return 'Getting Started';
    }
    if (count >= 7) return 'Online Guardian';
    if (count >= 5) return 'Security Keeper';
    if (count >= 3) return 'Sharp Spotter';
    if (count >= 1) return 'Scam Aware';
    return 'Getting Started';
  }

  function completedLessons() {
    return LESSONS.filter(lesson => Boolean(state.lessons[lesson.id]));
  }

  function lessonDone(id) {
    return Boolean(state.lessons[id]);
  }

  function lessonUnlocked(id) {
    if (lessonDone(id)) return true;
    if (state.unlockAll) return true;
    return id === 1 || lessonDone(id - 1);
  }

  function schoolLabel() {
    const stages = STAGES[state.mode] || STAGES.kid;
    const stage = stages.find(item => item.id === (state.stagesByMode && state.stagesByMode[state.mode]));
    return stage ? stage.label : stages[0].label;
  }

  function formatDate(date) {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return `${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  /* ==========================================================
     Render: header, mode, path, passport, crew, shop, certificate
     ========================================================== */

  function renderHeader() {
    const setElemText = (id, text) => {
      const el = $(id);
      if (el) el.textContent = text;
    };
    setElemText('#coinValue', String(state.coins));
    setElemText('#coinValue2', String(state.coins));
    setElemText('#shopCoins', String(state.coins));
    const hAvatar = $('#headerAvatar');
    if (hAvatar) hAvatar.innerHTML = avatarSVG(state.avatar.color, state.avatar.accessory);
  }

  function updateSoundButton() {
    const btn = $('#soundBtn');
    if (!btn) return;
    btn.setAttribute('aria-pressed', String(Boolean(state.sound)));
    btn.setAttribute('aria-label', state.sound ? 'Turn sound off' : 'Turn sound on');
    btn.title = state.sound ? 'Turn sound off' : 'Turn sound on';
  }

  function renderModeUI() {
    window.applySusOrSafeMode?.(state.mode);
    document.body.dataset.mode = state.mode;
    document.body.classList.remove('theme-kid', 'theme-teen', 'theme-adult', 'theme-kids', 'theme-teens', 'theme-adults');
    document.body.classList.add(`theme-${state.mode}`, `theme-${state.mode}s`);
    document.documentElement.style.colorScheme = state.mode === 'teen' ? 'dark' : 'light';
    $('#themeColor')?.setAttribute('content', MODE_INFO[state.mode].themeColor);
    $$('.mode-pill[data-mode]').forEach(btn => {
      const on = btn.dataset.mode === state.mode;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', String(on));
    });
    $$('.route-card').forEach(card => {
      const on = card.dataset.route === state.mode;
      card.classList.toggle('is-active', on);
      const btn = $('.route-btn', card);
      if (btn) btn.textContent = on ? 'Current mode' : 'Switch mode';
    });
    const info = MODE_INFO[state.mode];
    if (!info) return;
    const setElemText = (id, text) => {
      const el = $(id);
      if (el) el.textContent = text;
    };
    setElemText('#homeAudience', info.homeAudience);
    setElemText('#homeModeCopy', info.homeCopy);
    setElemText('#toolkitModeIntro', info.toolkitCopy);
    setElemText('#gamesModeIntro', info.gamesCopy);
    setElemText('#gamesModeBadge', `${state.mode === 'kid' ? 'Kids' : state.mode === 'teen' ? 'Teens' : 'Adults'} · ${info.badge}`);
    setElemText('#modeHintBadge', info.badge);
    setElemText('#modeHintText', info.hint);
    setElemText('#modeHintFocus', `Scams to watch for: ${AGE_FOCUS[state.mode].text}.`);
    const kid = state.mode === 'kid';
    setElemText('#profileSectionKicker', kid ? '01 / Your explorer' : state.mode === 'teen' ? '01 / Your digital profile' : '01 / Your profile');
    setElemText('#setupProfileKicker', kid ? 'Your explorer' : state.mode === 'teen' ? 'Digital profile' : 'Personal profile');
    setElemText('#profileNameLabel', kid ? 'Explorer name' : state.mode === 'teen' ? 'Display name' : 'Name or nickname');
    const explorerInput = $('#explorerName');
    if (explorerInput) explorerInput.placeholder = kid ? 'Name your explorer' : state.mode === 'teen' ? 'Choose a display name' : 'Enter a name or nickname';
    setElemText('#profilePassportLabel', kid ? 'Explorer passport' : state.mode === 'teen' ? 'Progress passport' : 'Learning record');
    setElemText('#profileShopTitle', kid ? 'Dress your explorer.' : state.mode === 'teen' ? 'Style your avatar.' : 'Personalize your avatar.');
    setElemText('#certHeading', kid ? 'SAFE EXPLORER' : state.mode === 'teen' ? 'DIGITAL NAVIGATOR' : 'ONLINE GUARDIAN');
  }

  function renderSetup() {
    const setupAvatar = $('#setupAvatar');
    if (setupAvatar) setupAvatar.innerHTML = avatarSVG(state.avatar.color, state.avatar.accessory) + petMarkup();
    const setupName = $('#setupName');
    if (setupName) setupName.textContent = equippedName();
    const setupMeta = $('#setupMeta');
    if (setupMeta) setupMeta.textContent = `${MODE_INFO[state.mode].badge} · ${schoolLabel()}${state.avatar.pet !== 'none' ? ` · ${petDisplayName()}` : ''}`;
  }

  function renderPath() {
    const pathEl = $('#lessonPath');
    if (!pathEl) return;
    const levels = [1, 2, 3];
    const stepLabels = LESSON_MODE_COPY[state.mode].stepLabels;
    pathEl.innerHTML = levels.map(level => {
      const lessons = LESSONS.filter(lesson => lesson.level === level);
      const cards = lessons.map(lesson => {
        const unlocked = lessonUnlocked(lesson.id);
        const rec = state.lessons[lesson.id];
        const current = unlocked && !rec;
        const classes = [
          'lesson-card',
          unlocked ? 'is-open' : 'is-locked',
          rec ? 'is-done' : '',
          current ? 'is-current' : '',
          lesson.id === 7 ? 'is-final' : ''
        ].filter(Boolean).join(' ');
        const lock = !unlocked
          ? `<div class="lesson-lock"><svg class="ico"><use href="#i-lock"/></svg><span>Finish lesson ${lesson.id - 1}</span></div>`
          : '';
        return `<article class="${classes}" style="--q:${lesson.color}" data-lesson-card="${lesson.id}">
          <div class="quest-top">
            <span class="quest-no">0${lesson.id}</span>
            <span class="quest-time">${lesson.duration}</span>
          </div>
          <div class="quest-icon"><svg class="ico"><use href="#i-${lesson.icon}"/></svg></div>
          <h3>${LESSON_MODE_COPY[state.mode][lesson.id].title}</h3>
          <p>${LESSON_MODE_COPY[state.mode][lesson.id].subtitle}</p>
          ${AGE_FOCUS[state.mode].lessons.includes(lesson.id) ? '<span class="focus-tag">For your age</span>' : ''}
          <div class="lesson-steps" aria-hidden="true">${stepLabels.map(label => `<span>${label}</span>`).join('')}</div>
          <div class="quest-footer">
            <span class="lesson-reward"><svg class="ico coin-ico"><use href="#i-coin"/></svg> +100–160</span>
            <button class="btn quest-btn lesson-btn" type="button" data-lesson="${lesson.id}" ${unlocked ? '' : 'disabled'}>${unlocked ? (rec ? 'Replay' : (state.last_place === `lesson:${lesson.id}` || (!state.last_place && current) ? 'Resume' : 'Start lesson')) : 'Locked'}</button>
          </div>
          ${rec ? `<span class="lesson-stars" aria-label="${rec.stars} stars">${STAR(rec.stars)}</span>` : ''}
          ${lock}
        </article>`;
      }).join('');
      return `<div class="level-block level-${level}">
        <div class="level-head">
          <span class="level-no">LEVEL 0${level}</span>
          <h3>${LEVEL_META[level].name}</h3>
          <p>${LEVEL_META[level].blurb}</p>
        </div>
        <div class="lesson-grid">${cards}</div>
      </div>`;
    }).join('');

    const unlockAllBtn = $('#unlockAll');
    if (unlockAllBtn) unlockAllBtn.textContent = state.unlockAll ? 'Lock lessons back into sequence' : 'Teacher? Unlock all lessons';
  }

  function renderGames() {
    const gamesGrid = $('#gamesGrid');
    if (!gamesGrid) return;
    gamesGrid.innerHTML = ARCADE_GAMES.map((game, index) => {
      const lesson = LESSONS.find(item => item.id === game.id);
      const modeGame = game.modes[state.mode];
      const record = state.arcade[game.id];
      const bestScore = Number.isInteger(record?.best) ? Math.min(3, Math.max(0, record.best)) : 0;
      return `<article class="game-card" style="--game-color:${lesson.color};--game-order:${index}" data-game-card="${game.id}">
        <div class="game-card-top">
          <span class="game-number">ARCADE 0${game.id}</span>
          <span class="game-duration">3 quick rounds</span>
        </div>
        <div class="game-icon"><svg class="ico"><use href="#i-${game.icon}"/></svg></div>
        <p class="game-card-lesson">${game.kind === 'ai' ? 'Guess the author' : game.kind === 'blank' ? 'Fill in the blank' : game.kind === 'choose' ? 'Pick and choose' : game.kind === 'realfake' ? 'Real or fake?' : game.kind === 'password' ? 'Password pick' : game.kind === 'privacy' ? 'Share or keep?' : 'Safer connection'}</p>
        <h2>${modeGame.title}</h2>
        <p class="game-card-detail">${modeGame.detail}</p>
        <p class="game-card-skill"><b>Skill:</b> ${LESSON_MODE_COPY[state.mode][game.id].subtitle}</p>
        <div class="game-card-bottom">
          ${record && bestScore
            ? `<span class="game-card-stars" aria-label="Best score ${bestScore} of 3">${'★'.repeat(bestScore)}${'☆'.repeat(3 - bestScore)}<small>Best: ${bestScore} / 3</small></span>`
            : `<span class="game-card-reward">Learn by playing</span>`}
          <button class="btn btn-primary game-card-button" type="button" data-arcade="${game.id}">${record ? 'Play again' : 'Play game'}</button>
        </div>
      </article>`;
    }).join('');
  }

  const arcadeDialog = $('#arcadeDialog');
  const arcadeBody = $('#arcadeBody');
  let arcadeSession = null;

  function openArcadeGame(id) {
    const game = ARCADE_GAMES.find(item => item.id === id);
    if (!game) return;
    state.last_place = `game:${id}`;
    save();
    arcadeSession = { game, mode: state.mode, round: 0, score: 0, answered: false };
    $('#arcadeTitle').textContent = game.modes[state.mode].title;
    $('#arcadeKicker').textContent = `Arcade challenge ${String(id).padStart(2, '0')}`;
    renderArcadeRound();
    arcadeDialog.showModal();
  }

  function renderArcadeRound() {
    const session = arcadeSession;
    if (!session) return;
    const game = session.game.modes[session.mode];
    const round = game.rounds[session.round];
    session.answered = false;
    $('#arcadeProgress').textContent = `Round ${session.round + 1} of ${game.rounds.length}`;
    const prompt = session.game.kind === 'blank'
      ? round.prompt.replace('___', '<span class="arcade-blank">_____</span>')
      : round.prompt;
    const choices = round.options.map((option, index) =>
      `<button class="arcade-answer" type="button" data-arcade-answer="${index}">${option}</button>`
    ).join('');
    arcadeBody.innerHTML = `
      <p class="arcade-round-label">${session.game.kind === 'ai' ? 'Make your guess' : session.game.kind === 'realfake' ? 'Make your call' : session.game.kind === 'blank' ? 'Choose a word' : 'Choose the safest answer'}</p>
      <p class="arcade-prompt">${prompt}</p>
      ${session.game.kind === 'ai' ? '<p class="arcade-reminder">Practice examples have an answer. Real authorship cannot be proven by style alone.</p>' : ''}
      <div class="arcade-answers">${choices}</div>
      <div class="arcade-feedback" id="arcadeFeedback" aria-live="polite" hidden></div>
      <div class="arcade-actions">
        <span class="arcade-score">Score: <b>${session.score}</b></span>
        <button class="btn btn-primary" id="arcadeNext" type="button" hidden>${session.round === game.rounds.length - 1 ? 'See score' : 'Next round'} <svg class="ico"><use href="#i-arrow"/></svg></button>
      </div>`;
  }

  function answerArcadeRound(selectedIndex) {
    const session = arcadeSession;
    if (!session || session.answered) return;
    const game = session.game.modes[session.mode];
    const round = game.rounds[session.round];
    if (!Number.isInteger(selectedIndex) || selectedIndex < 0 || selectedIndex >= round.options.length) return;
    session.answered = true;
    const correct = selectedIndex === round.answer;
    if (correct) session.score += 1;
    $$('.arcade-answer', arcadeBody).forEach((button, index) => {
      button.disabled = true;
      if (index === round.answer) button.classList.add('is-correct');
      else if (index === selectedIndex) button.classList.add('is-wrong');
    });
    const feedback = $('#arcadeFeedback', arcadeBody);
    feedback.hidden = false;
    feedback.classList.toggle('is-correct', correct);
    feedback.classList.toggle('is-wrong', !correct);
    feedback.textContent = `${correct ? 'Nice choice! ' : `Best answer: ${round.options[round.answer]}. `}${round.feedback}`;
    $('.arcade-score', arcadeBody).innerHTML = `Score: <b>${session.score}</b>`;
    $('#arcadeNext', arcadeBody).hidden = false;
  }

  function finishArcadeGame() {
    const session = arcadeSession;
    if (!session) return;
    const previous = state.arcade[session.game.id];
    const previousBest = Number.isInteger(previous?.best) ? Math.min(3, Math.max(0, previous.best)) : 0;
    const attempts = Number.isInteger(previous?.attempts) ? Math.max(0, previous.attempts) : 0;
    state.arcade[session.game.id] = {
      best: Math.max(previousBest, session.score),
      attempts: attempts + 1
    };
    state.last_place = `game:${session.game.id}`;
    save();
    renderGames();
    const game = session.game.modes[session.mode];
    const message = session.game.kind === 'ai'
      ? 'A score is just for fun. For real messages, voice notes, or pictures, verify the source instead of trusting a guess.'
      : 'Practice makes it easier to pause and choose a safer next step.';
    $('#arcadeProgress').textContent = `Final score: ${session.score} / ${game.rounds.length}`;
    arcadeBody.innerHTML = `
      <div class="arcade-result">
        <span class="arcade-result-icon" aria-hidden="true">${session.score === game.rounds.length ? '🌟' : '🛡️'}</span>
        <p class="arcade-round-label">Challenge complete</p>
        <h3>${session.score === game.rounds.length ? 'Perfect round!' : 'Good practice!'}</h3>
        <p class="arcade-final-score">${session.score} <span>/ ${game.rounds.length}</span></p>
        <p>${message}</p>
        <div class="arcade-actions arcade-result-actions">
          <button class="btn btn-ghost" type="button" data-arcade-close>Back to games</button>
          <button class="btn btn-primary" type="button" data-arcade-replay="${session.game.id}">Play again</button>
        </div>
      </div>`;
  }

  arcadeBody?.addEventListener('click', event => {
    const answer = event.target.closest('[data-arcade-answer]');
    if (answer) {
      answerArcadeRound(Number(answer.dataset.arcadeAnswer));
      return;
    }
    if (event.target.closest('#arcadeNext')) {
      const game = arcadeSession?.game.modes[arcadeSession.mode];
      if (!game) return;
      if (arcadeSession.round === game.rounds.length - 1) {
        finishArcadeGame();
      } else {
        arcadeSession.round += 1;
        renderArcadeRound();
      }
      return;
    }
    const replay = event.target.closest('[data-arcade-replay]');
    if (replay) {
      openArcadeGame(Number(replay.dataset.arcadeReplay));
      return;
    }
    if (event.target.closest('[data-arcade-close]')) arcadeDialog.close();
  });

  $('#closeArcade')?.addEventListener('click', () => arcadeDialog?.close());
  arcadeDialog?.addEventListener('click', event => {
    if (event.target === arcadeDialog) arcadeDialog.close();
  });
  arcadeDialog?.addEventListener('close', () => {
    arcadeSession = null;
  });

  function renderPassport() {
    const count = completedLessons().length;
    const pct = (count / LESSONS.length) * 100;
    const xpRing = $('#xpRing');
    if (xpRing) xpRing.style.setProperty('--p', String(pct));
    const countBig = $('#lessonCountBig');
    if (countBig) countBig.textContent = String(count);
    const progress = $('#lessonProgress');
    if (progress) progress.textContent = `${count} / ${LESSONS.length}`;
    const rankName = $('#rankName');
    if (rankName) rankName.textContent = rankFor(count);
    const crewRank = $('#crewRank');
    if (crewRank) crewRank.textContent = rankFor(count);

    const next = LESSONS.find(lesson => !lessonDone(lesson.id) && lessonUnlocked(lesson.id));
    const passportText = $('#passportText');
    if (passportText) {
      passportText.textContent = count === LESSONS.length
        ? `All 7 lessons complete · ${state.coins} coins · certificate unlocked.`
        : `${count} of 7 lessons · ${state.coins} coins · ${next ? `next up: ${next.title}` : 'unlock the next lesson to continue'}.`;
    }

    const stampRow = $('#stampRow');
    if (stampRow) {
      stampRow.innerHTML = LESSONS.map(lesson => {
        const done = lessonDone(lesson.id);
        const open = lessonUnlocked(lesson.id);
        return `<span class="stamp ${done ? 'is-done' : ''} ${open ? 'is-open' : ''}" title="Lesson ${lesson.id}: ${lesson.title}" style="--s:${lesson.color}">${done ? '✓' : lesson.id}</span>`;
      }).join('');
    }
  }

  function renderCrew() {
    const crewAvatar = $('#crewAvatar');
    if (crewAvatar) crewAvatar.innerHTML = avatarSVG(state.avatar.color, state.avatar.accessory) + petMarkup();
    const pet = currentPet();
    const petEmoji = $('#crewPetEmoji');
    if (petEmoji) petEmoji.textContent = pet.id === 'none' ? '·' : pet.emoji;
    const petNameEl = $('#crewPetName');
    if (petNameEl) petNameEl.textContent = pet.id === 'none' ? 'No pet yet' : petDisplayName();

    const active = document.activeElement;
    const explorerInput = $('#explorerName');
    if (explorerInput && active !== explorerInput) explorerInput.value = state.name;
    const petInput = $('#petName');
    if (petInput && active !== petInput) petInput.value = state.avatar.pet === 'none' ? '' : (state.petName || '');

    const stageSelect = $('#schoolSelect');
    if (stageSelect) {
      if (!state.stagesByMode || typeof state.stagesByMode !== 'object') {
        state.stagesByMode = { kid: 'primary', teen: 'high', adult: 'working' };
      }
      const modeStages = STAGES[state.mode] || STAGES.kid;
      let activeStage = modeStages.find(stage => stage.id === state.stagesByMode[state.mode]);
      if (!activeStage) {
        activeStage = modeStages[0];
        state.stagesByMode[state.mode] = activeStage.id;
      }
      stageSelect.innerHTML = modeStages.map(stage =>
        `<option value="${stage.id}">${stage.label}</option>`
      ).join('');
      stageSelect.value = activeStage.id;
      const stageLabel = $('#schoolStageLabel');
      if (stageLabel) stageLabel.textContent = state.mode === 'kid' ? 'Age or school stage' : 'Life stage';
      const stageNote = $('#schoolStageNote');
      if (stageNote) {
        stageNote.textContent = state.mode === 'adult'
          ? 'This stays on your device and only tailors your safety tips.'
          : 'We never ask for your school’s name. This only tailors your safety tips.';
      }
      const schoolTip = $('#schoolTip');
      if (schoolTip) schoolTip.textContent = STAGE_TIPS[activeStage.id] || '';
    }

    $$('.mode-pill[data-mode]').forEach(btn => {
      const on = btn.dataset.mode === state.mode;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', String(on));
    });
  }

  let shopTab = 'looks';

  function renderShop() {
    if (!$('#shopGrid')) return;
    const grid = $('#shopGrid');
    if (!grid) return;
    $$('.shop-tab').forEach(tab => {
      const on = tab.dataset.shopTab === shopTab;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', String(on));
    });

    if (shopTab === 'pets') {
      grid.innerHTML = PETS.map(pet => {
        const owned = state.owned.pets.includes(pet.id);
        const equipped = state.avatar.pet === pet.id;
        const priceLabel = owned ? (equipped ? 'Equipped' : 'Owned') : (pet.price === 0 ? 'Free' : `${pet.price} coins`);
        return `<button class="shop-item pet-item ${equipped ? 'is-equipped' : ''}" type="button" data-buy-type="pets" data-buy-id="${pet.id}">
          <span class="pet-emoji">${pet.emoji || '·'}</span>
          <span class="shop-item-copy"><b>${pet.name}</b><small>${pet.blurb}</small></span>
          <span class="shop-price">${priceLabel}</span>
        </button>`;
      }).join('');
      return;
    }

    const colors = AVATAR_COLORS.map(color => {
      const owned = state.owned.colors.includes(color.id);
      const equipped = state.avatar.color === color.id;
      const priceLabel = owned ? (equipped ? 'Equipped' : 'Owned') : (color.price === 0 ? 'Free' : `${color.price} coins`);
      return `<button class="shop-item color-item ${equipped ? 'is-equipped' : ''}" type="button" data-buy-type="colors" data-buy-id="${color.id}">
        <span class="color-swatch" style="--sw:${color.hex}"></span>
        <span class="shop-item-copy"><b>${color.name}</b><small>Body colour</small></span>
        <span class="shop-price">${priceLabel}</span>
      </button>`;
    }).join('');

    const gear = ACCESSORIES.map(accessory => {
      const owned = state.owned.accessories.includes(accessory.id);
      const equipped = state.avatar.accessory === accessory.id;
      const priceLabel = owned ? (equipped ? 'Equipped' : 'Owned') : (accessory.price === 0 ? 'Free' : `${accessory.price} coins`);
      return `<button class="shop-item gear-item ${equipped ? 'is-equipped' : ''}" type="button" data-buy-type="accessories" data-buy-id="${accessory.id}">
        <span class="gear-emoji">${ACCESSORY_EMOJI[accessory.id] || '—'}</span>
        <span class="shop-item-copy"><b>${accessory.name}</b><small>Wearable gear</small></span>
        <span class="shop-price">${priceLabel}</span>
      </button>`;
    }).join('');

    grid.innerHTML = `<div class="shop-section"><p class="shop-section-title">Body colour</p><div class="shop-subgrid">${colors}</div></div>
      <div class="shop-section"><p class="shop-section-title">Gear</p><div class="shop-subgrid">${gear}</div></div>`;
  }

  function renderCertificate() {
    const done = completedLessons().length;
    const unlocked = done === LESSONS.length;
    const certStage = $('#certStage');
    if (certStage) certStage.classList.toggle('is-unlocked', unlocked);
    const certProgress = $('#certProgress');
    if (certProgress) certProgress.textContent = `${done} / ${LESSONS.length}`;
    const printCert = $('#printCert');
    if (printCert) printCert.disabled = !unlocked;
    const certNo = $('#certNo');
    if (certNo) certNo.textContent = String(done).padStart(4, '0');
    const certNameOut = $('#certNameOut');
    if (certNameOut) certNameOut.textContent = state.name.trim() || 'A Curious Human';
    const certDate = $('#certDate');
    if (certDate) certDate.textContent = formatDate(new Date());
    const certAvatar = $('#certAvatar');
    if (certAvatar) certAvatar.innerHTML = avatarSVG(state.avatar.color, state.avatar.accessory) + petMarkup();
    const certPet = $('#certPet');
    if (certPet) {
      certPet.textContent = state.avatar.pet === 'none'
        ? 'flying solo'
        : `with ${petDisplayName()}`;
    }

    const active = document.activeElement;
    const certInput = $('#certName');
    if (certInput && active !== certInput) certInput.value = state.name;
  }

  function getResumeTarget() {
    if (state.last_place) {
      if (state.last_place.startsWith('lesson:')) {
        const id = Number(state.last_place.split(':')[1]);
        if (id && LESSONS.some(l => l.id === id) && lessonUnlocked(id)) {
          const isDone = Boolean(state.lessons[id]);
          return { type: 'lesson', id, title: `Lesson ${id}`, isResume: true, isDone };
        }
      } else if (state.last_place.startsWith('game:')) {
        const id = Number(state.last_place.split(':')[1]);
        if (id && ARCADE_GAMES.some(g => g.id === id)) {
          return { type: 'game', id, title: `Challenge ${id}`, isResume: true };
        }
      }
    }
    const hasAnyLessons = Object.keys(state.lessons).length > 0;
    const nextUncompleted = LESSONS.find(l => !state.lessons[l.id] && lessonUnlocked(l.id));
    if (nextUncompleted) {
      return {
        type: 'lesson',
        id: nextUncompleted.id,
        title: `Lesson ${nextUncompleted.id}`,
        isResume: hasAnyLessons
      };
    }
    if (completedLessons().length === LESSONS.length) {
      return { type: 'completed', id: 1, title: 'Review Lessons', isResume: true };
    }
    return { type: 'lesson', id: 1, title: 'Lesson 1', isResume: false };
  }

  function renderHeroCTA() {
    const heroBtn = $('#heroStart');
    if (!heroBtn) return;
    const target = getResumeTarget();
    if (target.type === 'completed') {
      heroBtn.innerHTML = `Review Lessons <svg class="ico"><use href="#i-arrow"/></svg>`;
      heroBtn.dataset.targetType = 'lesson';
      heroBtn.dataset.targetId = '1';
    } else if (target.isResume) {
      heroBtn.innerHTML = `Resume ${target.title} <svg class="ico"><use href="#i-arrow"/></svg>`;
      heroBtn.dataset.targetType = target.type;
      heroBtn.dataset.targetId = String(target.id);
    } else {
      heroBtn.innerHTML = `Start Lesson 1 <svg class="ico"><use href="#i-arrow"/></svg>`;
      heroBtn.dataset.targetType = 'lesson';
      heroBtn.dataset.targetId = '1';
    }
  }

  function renderAll() {
    renderHeader();
    renderModeUI();
    renderHeroCTA();
    renderPath();
    renderGames();
    renderPassport();
    renderSetup();
    renderCrew();
    if (lessonDialog.open && currentLesson) renderLesson();
    renderShop();
    renderCertificate();
    updateInstallUI();
  }

  function setMode(mode, opts = {}) {
    if (!MODE_INFO[mode]) return;
    if (state.mode === mode) {
      renderModeUI();
      if (!opts.silent) toast(`changing to ${mode} mode`);
      return;
    }
    state.mode = mode;
    if (!state.stagesByMode || typeof state.stagesByMode !== 'object') {
      state.stagesByMode = { kid: 'primary', teen: 'high', adult: 'working' };
    }
    const modeStages = STAGES[mode] || STAGES.kid;
    if (!modeStages.some(s => s.id === state.stagesByMode[mode])) {
      state.stagesByMode[mode] = modeStages[0].id;
    }
    save();
    try {
      localStorage.setItem('susorsafe_mode', mode);
    } catch (e) {}
    syncToDatabase(true);
    renderModeUI();
    renderHeroCTA();
    renderPath();
    renderGames();
    renderPassport();
    renderSetup();
    renderCrew();
    if (!opts.silent) toast(`changing to ${mode} mode`);
    if (lessonDialog && lessonDialog.open && currentLesson) {
      lessonTitleEl.textContent = LESSON_MODE_COPY[state.mode][currentLesson.id].title;
      renderLesson();
    }
  }

  window._susorsafeAppSetMode = (mode, opts) => setMode(mode, opts);
  window.setSusOrSafeMode = (mode, opts) => setMode(mode, opts);

  /* ==========================================================
     Lesson engine
     ========================================================== */

  const lessonDialog = $('#lessonDialog');
  const lessonBody = $('#lessonBody');
  const lessonTitleEl = $('#lessonTitle');
  const lessonKickerEl = $('#lessonKicker');
  const lessonStepLabel = $('#lessonStepLabel');
  const stepper = $('#lessonStepper');
  const activityStatus = $('#activityStatus');

  let currentLesson = null;
  let currentStep = 0;
  let activityStarted = false;
  let activityResult = null;
  let activityDoneCallback = null;
  let quizAnswers = [];
  let quizChecked = false;
  let quizCorrect = 0;

  function openLesson(id) {
    const lesson = LESSONS.find(item => item.id === id);
    if (!lesson) return;
    if (!lessonUnlocked(id)) {
      toast(`Finish Lesson ${id - 1} to unlock this one.`);
      return;
    }

    state.last_place = `lesson:${id}`;
    save();

    currentLesson = lesson;
    currentStep = 0;
    activityStarted = false;
    activityResult = null;
    activityDoneCallback = null;
    quizAnswers = lesson.quiz.map(() => null);
    quizChecked = false;
    quizCorrect = 0;

    lessonKickerEl.textContent = `Lesson 0${lesson.id} · Level 0${lesson.level}`;
    lessonTitleEl.textContent = LESSON_MODE_COPY[state.mode][lesson.id].title;
    activityStatus.textContent = '';

    if (!lessonDialog.open) {
      lessonDialog.showModal();
      document.body.classList.add('modal-open');
    }
    renderLesson();
  }

  function updateStepper(doneAll = false) {
    const stepLabels = LESSON_MODE_COPY[state.mode].stepLabels;
    $$('li', stepper).forEach((item, index) => {
      item.lastChild.textContent = stepLabels[index];
      item.dataset.label = stepLabels[index];
      item.classList.toggle('is-active', !doneAll && index === currentStep);
      item.classList.toggle('is-done', doneAll || index < currentStep);
      if (!doneAll && index === currentStep) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });
    lessonStepLabel.textContent = doneAll ? 'Complete' : `${stepLabels[currentStep]} · ${currentStep + 1} of 4`;
  }

  function renderLesson() {
    if (!currentLesson) return;
    updateStepper();
    activityStatus.textContent = '';
    lessonBody.scrollTop = 0;

    if (currentStep === 0) renderOverview();
    else if (currentStep === 1) renderVocab();
    else if (currentStep === 2) renderActivity();
    else renderQuiz();
  }

  function renderOverview() {
    const lesson = currentLesson;
    const modeCopy = LESSON_MODE_COPY[state.mode][lesson.id];
    const tip = lesson.overview.modeTips[state.mode];
    lessonBody.innerHTML = `
      <div class="lesson-meta-row">
        <span class="pill">Lesson ${lesson.id} of 7</span>
        <span class="pill">${lesson.duration}</span>
        <span class="pill">${lesson.levelLabel}</span>
      </div>
      <p class="game-lede">${modeCopy.lede}</p>
      <div class="lesson-points">
        ${lesson.overview.points.map((point, index) => `
          <div class="lesson-point">
            <span>0${index + 1}</span>
            <p>${point}</p>
          </div>`).join('')}
      </div>
      <div class="mode-tip">
        <span class="tip-label">Scam to watch for · ${MODE_INFO[state.mode].badge}</span>
        <p>${tip}</p>
      </div>
      <div class="game-actions">
        <button class="btn btn-primary" type="button" id="overviewNext">${modeCopy.nextWords || 'Next'} <svg class="ico"><use href="#i-arrow"/></svg></button>
      </div>`;

    $('#overviewNext').addEventListener('click', () => {
      currentStep = 1;
      renderLesson();
    });
  }

  function renderVocab() {
    const lesson = currentLesson;
    const modeCopy = LESSON_MODE_COPY[state.mode];
    lessonBody.innerHTML = `
      <p class="game-lede">${modeCopy.vocabIntro}</p>
      <div class="vocab-grid">
        ${lesson.vocab.map((item, index) => `
          <article class="vocab-card">
            <span class="vocab-num">0${index + 1}</span>
            <h4>${item.term}</h4>
            <p>${item.def}</p>
            <p class="vocab-example">${item.example}</p>
          </article>`).join('')}
      </div>
      <div class="game-actions">
        <button class="btn btn-primary" type="button" id="vocabNext">${modeCopy.activityLabels[lesson.id - 1]} <svg class="ico"><use href="#i-arrow"/></svg></button>
      </div>`;

    $('#vocabNext').addEventListener('click', () => {
      currentStep = 2;
      renderLesson();
    });
  }

  function renderActivity() {
    if (activityResult) {
      renderActivitySummary();
      return;
    }
    if (!activityStarted) {
      activityStarted = true;
      activityDoneCallback = (stars, detail) => {
        activityResult = { stars, detail };
        renderActivitySummary();
      };
      startActivity(currentLesson.activity);
    }
  }

  function renderActivitySummary() {
    const result = activityResult;
    activityStatus.textContent = '';
    updateStepper();
    lessonBody.innerHTML = `
      <div class="quiz-result activity-result">
        <div class="big-stars" aria-label="${result.stars} out of 3 stars">${STAR(result.stars)}</div>
        <h3>Activity cleared</h3>
        <p>${result.detail}</p>
        <div class="game-actions">
          <button class="btn btn-primary" type="button" id="toQuiz">Take the quick test <svg class="ico"><use href="#i-arrow"/></svg></button>
        </div>
      </div>`;
    $('#toQuiz').addEventListener('click', () => {
      currentStep = 3;
      renderLesson();
    });
    lessonBody.scrollTop = 0;
  }

  function renderQuiz() {
    const lesson = currentLesson;
    const modeCopy = LESSON_MODE_COPY[state.mode];
    const answered = quizAnswers.filter(value => value !== null).length;

    const questions = lesson.quiz.map((question, qIndex) => {
      const options = question.options.map((option, oIndex) => {
        const selected = quizAnswers[qIndex] === oIndex;
        let cls = '';
        if (quizChecked) {
          if (oIndex === question.answer) cls = 'is-correct';
          else if (selected) cls = 'is-wrong';
        }
        return `<label class="quiz-option ${cls}">
          <input type="radio" name="q${qIndex}" value="${oIndex}" ${selected ? 'checked' : ''} ${quizChecked ? 'disabled' : ''}>
          <span>${option}</span>
        </label>`;
      }).join('');

      return `<fieldset class="quiz-question">
        <legend><span>${qIndex + 1}</span>${question.q}</legend>
        <div class="quiz-options">${options}</div>
        ${quizChecked ? `<p class="quiz-why"><b>${quizAnswers[qIndex] === question.answer ? 'Correct.' : 'Not quite.'}</b> ${question.why}</p>` : ''}
      </fieldset>`;
    }).join('');

    lessonBody.innerHTML = `
      <p class="game-lede">${modeCopy.quizIntro}</p>
      <form id="quizForm" class="quiz-form">
        ${questions}
        ${quizChecked
          ? `<div class="quiz-result-inline">
               <div class="big-stars">${STAR(quizCorrect)}</div>
               <p><b>${quizCorrect} / ${lesson.quiz.length}</b> correct. ${quizCorrect === lesson.quiz.length ? 'Clean sweep.' : 'Read the notes, then finish when you are ready.'}</p>
               <button class="btn btn-primary" type="button" id="finishLesson">Finish lesson <svg class="ico"><use href="#i-arrow"/></svg></button>
             </div>`
          : `<div class="game-actions">
               <button class="btn btn-primary" type="submit">Check answers</button>
               <span class="quiz-count">${answered} / ${lesson.quiz.length} answered</span>
             </div>`}
      </form>`;

    if (!quizChecked) {
      $('#quizForm').addEventListener('submit', event => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const answers = lesson.quiz.map((_, index) => {
          const value = form.get(`q${index}`);
          return value === null ? null : Number(value);
        });
        if (answers.some(value => value === null)) {
          const counter = $('.quiz-count', lessonBody);
          if (counter) {
            counter.textContent = 'Answer all three questions first.';
            counter.classList.add('is-error');
          }
          return;
        }
        quizAnswers = answers;
        quizCorrect = lesson.quiz.reduce((sum, question, index) => sum + (answers[index] === question.answer ? 1 : 0), 0);
        quizChecked = true;
        playSound(quizCorrect === lesson.quiz.length ? 'win' : 'click');
        renderQuiz();
        requestAnimationFrame(() => {
          lessonBody.scrollTop = lessonBody.scrollHeight;
        });
      });
      $$('input[type="radio"]', lessonBody).forEach(input => {
        input.addEventListener('change', () => {
          const count = $$('input[type="radio"]:checked', lessonBody).length;
          const counter = $('.quiz-count', lessonBody);
          if (counter) {
            counter.textContent = `${count} / ${lesson.quiz.length} answered`;
            counter.classList.remove('is-error');
          }
        });
      });
    } else {
      $('#finishLesson').addEventListener('click', finishLesson);
    }
  }

  function finishLesson() {
    const lesson = currentLesson;
    const correct = lesson.quiz.reduce((sum, question, index) => sum + (quizAnswers[index] === question.answer ? 1 : 0), 0);
    const stars = correct === 3 ? 3 : correct === 2 ? 2 : 1;
    const previous = state.lessons[lesson.id];
    const first = !previous;
    const coinsEarned = first ? 100 + correct * 20 : 0;

    state.lessons[lesson.id] = {
      stars: Math.max(stars, previous ? previous.stars : 0),
      quiz: Math.max(correct, previous ? previous.quiz || 0 : 0),
      at: new Date().toISOString()
    };
    if (first) state.coins += coinsEarned;
    if (first || stars > (previous?.stars || 0)) pendingCelebration = true;

    const next = LESSONS.find(item => item.id === lesson.id + 1);
    const nextUnlocked = next && lessonUnlocked(next.id);
    state.last_place = nextUnlocked ? `lesson:${next.id}` : `lesson:${lesson.id}`;

    save();
    renderAll();
    playSound('win');

    updateStepper(true);
    activityStatus.textContent = '';
    const allDone = completedLessons().length === LESSONS.length;

    lessonBody.innerHTML = `
      <div class="quiz-result lesson-complete">
        <div class="big-stars" aria-label="${stars} out of 3 stars">${STAR(stars)}</div>
        <h3>${first ? 'Lesson complete!' : 'Practice complete!'}</h3>
        <p>${correct} / ${lesson.quiz.length} on the quick test. ${first ? `You earned <b>${coinsEarned} coins</b>.` : 'No new coins on a replay — but the practice still counts.'}</p>
        <div class="completion-crew">
          <div class="completion-avatar">${avatarSVG(state.avatar.color, state.avatar.accessory)}${petMarkup()}</div>
          <div><b>${equippedName()}</b><small>${rankFor(completedLessons().length)}${state.avatar.pet !== 'none' ? ` · ${petDisplayName()}` : ''}</small></div>
        </div>
        <div class="game-actions">
          ${next && nextUnlocked
            ? `<button class="btn btn-primary" type="button" data-next-lesson="${next.id}">Next lesson: ${next.title} <svg class="ico"><use href="#i-arrow"/></svg></button>`
            : lesson.id === 7 && allDone
              ? '<button class="btn btn-primary" type="button" data-finish-cert>See certificate <svg class="ico"><use href="#i-arrow"/></svg></button>'
              : ''}
          <button class="btn btn-ghost" type="button" data-close-lesson>Back to path</button>
        </div>
      </div>`;
    lessonBody.scrollTop = 0;
  }

  function closeLesson() {
    if (lessonDialog && lessonDialog.open) lessonDialog.close();
  }

  function goTo(selector) {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    setTimeout(() => {
      const target = $(selector);
      if (target) target.scrollIntoView({ behavior, block: 'start' });
    }, 80);
  }

  lessonDialog?.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    activityDoneCallback = null;
    if (pendingCelebration) {
      pendingCelebration = false;
      setTimeout(fireConfetti, 140);
    }
  });

  $('#closeLesson')?.addEventListener('click', closeLesson);

  lessonDialog?.addEventListener('click', event => {
    if (event.target === lessonDialog) closeLesson();
  });

  lessonBody?.addEventListener('click', event => {
    const next = event.target.closest('[data-next-lesson]');
    if (next) {
      openLesson(Number(next.dataset.nextLesson));
      return;
    }
    if (event.target.closest('[data-close-lesson]')) {
      closeLesson();
      goTo('#lessons');
      return;
    }
    if (event.target.closest('[data-finish-cert]')) {
      closeLesson();
      goTo('#certificate');
    }
  });

  /* ==========================================================
     Activity completion bridge
     ========================================================== */

  function completeActivity(stars, detail) {
    if (typeof activityDoneCallback === 'function') {
      const callback = activityDoneCallback;
      activityDoneCallback = null;
      callback(stars, detail);
    }
  }

  function startActivity(kind) {
    activityStatus.textContent = '';
    if (kind === 'phishing') startPhishing();
    else if (kind === 'chat') startChat(state.mode === 'kid' ? 'kid' : state.mode === 'teen' ? 'teen' : 'adult');
    else if (kind === 'site') startSite();
    else if (kind === 'password') startPassword();
    else if (kind === 'twofa') startTwoFA();
    else if (kind === 'privacy') startPrivacy();
    else if (kind === 'wifi') startWifi();
  }

  /* ==========================================================
     Lesson 1 activity — Phishing Detective
     ========================================================== */

  let phishIndex = 0;
  let phishScore = 0;

  function startPhishing() {
    phishIndex = 0;
    phishScore = 0;
    renderPhishing();
  }

  function renderPhishing() {
    const item = PHISHING_CASES[phishIndex];
    let clueNo = 0;
    const lineHtml = item.lines.map(line => {
      let num = '';
      if (line.clue) {
        clueNo += 1;
        num = `<span class="clue-num">${clueNo}</span>`;
      }
      return `<p class="msg-line${line.clue ? ' clue' : ''}">${num}${line.text}</p>`;
    }).join('');

    const dots = PHISHING_CASES.map((_, index) => {
      const cls = index < phishIndex ? 'done' : index === phishIndex ? 'now' : '';
      return `<i class="${cls}"></i>`;
    }).join('');

    activityStatus.textContent = `Message ${phishIndex + 1} / ${PHISHING_CASES.length}`;
    lessonBody.innerHTML = `
      <p class="game-lede">Read the message first, then decide. ${state.mode === 'kid' ? 'Take your time and look for the bit that feels “off”.' : 'These are simplified versions of real tactics. Judge first, then read the tells.'} <b>Don't click anything</b> — you're only looking.</p>
      <div class="quiz-progress" aria-hidden="true">${dots}</div>
      <div class="msg" id="msgCard">
        <div class="msg-head">
          <div class="msg-row"><span class="k">Type</span><span class="v"><span class="msg-channel">${item.channel}</span></span></div>
          <div class="msg-row"><span class="k">From</span><span class="v">${item.from}</span></div>
          <div class="msg-row"><span class="k">Subject</span><span class="v">${item.subject}</span></div>
        </div>
        <div class="msg-body">${lineHtml}</div>
      </div>
      <div class="answer-row" id="answerRow">
        <button class="answer-btn" type="button" data-answer="phish">⚠ This is a scam</button>
        <button class="answer-btn" type="button" data-answer="safe">✓ Looks safe</button>
      </div>
      <div id="phishFeedback"></div>`;

    lessonBody.scrollTop = 0;
    $$('#answerRow [data-answer]').forEach(btn => {
      btn.addEventListener('click', () => answerPhishing(btn.dataset.answer, item));
    });
  }

  function answerPhishing(choice, item) {
    const correct = choice === item.verdict;
    if (correct) phishScore += 1;
    playSound(correct ? 'correct' : 'wrong');

    const msg = $('#msgCard');
    msg.classList.add('is-revealed');

    $$('#answerRow [data-answer]').forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.answer === item.verdict) {
        btn.style.borderColor = 'rgba(200,246,90,.65)';
        btn.style.color = '#c8f65a';
      }
      if (btn.dataset.answer === choice && !correct) {
        btn.style.borderColor = 'rgba(255,107,122,.55)';
        btn.style.color = '#ff9aa5';
      }
    });

    let clueNo = 0;
    const clues = item.lines
      .filter(line => line.clue)
      .map(line => {
        clueNo += 1;
        return `<li><span class="n">${clueNo}</span><span>${line.clue}</span></li>`;
      }).join('');

    const verdictLabel = item.verdict === 'phish' ? 'This is a scam' : 'This message is safe';
    const feedback = correct
      ? `<b>Correct</b>${verdictLabel}. ${item.explain}`
      : `<b>Not quite</b>The correct answer is “${verdictLabel}”. ${item.explain}`;

    const clueBlock = item.verdict === 'phish'
      ? `<ul class="clue-list">${clues}</ul>`
      : `<ul class="clue-list"><li><span class="n" style="background:rgba(92,225,196,.16);color:#5ce1c4">✓</span><span>No password request, no strange domain, no pressure to act now.</span></li></ul>`;

    const isLast = phishIndex === PHISHING_CASES.length - 1;
    $('#phishFeedback').innerHTML = `
      <div class="verdict ${correct ? 'good' : 'bad'}">
        <span class="v-ico">${correct ? '✓' : '!'}</span>
        <div>${feedback}</div>
      </div>
      ${clueBlock}
      <div class="chat-next">
        <button class="btn btn-primary" id="phishNext" type="button">${isLast ? 'See results' : 'Next message'} <svg class="ico"><use href="#i-arrow"/></svg></button>
      </div>`;

    $('#phishNext').addEventListener('click', () => {
      if (isLast) {
        renderPhishingResult();
      } else {
        phishIndex += 1;
        renderPhishing();
      }
    });

    $('#phishFeedback').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function renderPhishingResult() {
    const total = PHISHING_CASES.length;
    const stars = phishScore >= 6 ? 3 : phishScore >= 4 ? 2 : 1;
    const message = phishScore >= 6
      ? "Perfect run. You've got the rhythm: the more urgent, the more generous, and the more they want you to click, the more you pause."
      : phishScore >= 4
        ? 'Good eye. Most of the tells landed. Play again and try to get suspicious before you finish reading.'
        : "No shame — people who've been fooled often teach this best. Play again and look for two things first: who's rushing you, and what do they want?";

    activityStatus.textContent = 'Results';
    lessonBody.innerHTML = `
      <div class="quiz-result">
        <div class="big-stars">${STAR(stars)}</div>
        <h3>${phishScore} / ${total} correct</h3>
        <p>${message}</p>
        <div class="game-actions">
          <button class="btn btn-ghost" type="button" id="phishAgain">Play again</button>
          <button class="btn btn-primary" type="button" id="phishDone">Complete activity</button>
        </div>
      </div>`;

    $('#phishAgain').addEventListener('click', startPhishing);
    $('#phishDone').addEventListener('click', () => {
      completeActivity(
        stars,
        `You spotted ${phishScore} of ${total} messages. Remember the three tells: someone is rushing you, the domain looks off, and they want your password or code.`
      );
    });
    lessonBody.scrollTop = 0;
  }

  /* ==========================================================
     Lesson 2 activity — Scam Chat
     ========================================================== */

  let chatState = null;

  function startChat(key) {
    const scenario = CHAT_SCENARIOS[key] || CHAT_SCENARIOS.kid;
    chatState = {
      scenario,
      step: 0,
      score: 0,
      answered: false,
      transcript: []
    };
    scenario.steps[0].them.forEach(text => chatState.transcript.push({ role: 'them', text }));
    renderChat();
  }

  function renderChat() {
    if (!chatState) return;
    const s = chatState.scenario;
    const step = s.steps[chatState.step];

    activityStatus.textContent = `Line ${chatState.step + 1} / ${s.steps.length}`;

    const bubbles = chatState.transcript.map(entry => {
      if (entry.role === 'sys') {
        return `<div class="bubble sys"><b>The tell:</b> ${entry.text}</div>`;
      }
      return `<div class="bubble ${entry.role}">${entry.text}</div>`;
    }).join('');

    let choicesHtml = '';
    if (!chatState.answered) {
      choicesHtml = step.choices.map((choice, index) => `
        <button class="choice-btn" type="button" data-choice="${index}">
          <span class="idx">${index + 1}</span><span>${choice.text}</span>
        </button>`).join('');
    } else {
      const isLast = chatState.step === s.steps.length - 1;
      choicesHtml = `<div class="chat-next"><button class="btn btn-primary" id="chatNextBtn" type="button">${isLast ? 'See result' : 'Continue'} <svg class="ico"><use href="#i-arrow"/></svg></button></div>`;
    }

    lessonBody.innerHTML = `
      <p class="game-lede">${s.intro}</p>
      <div class="chat-stage">
        <div class="chat-head">
          <span class="chat-avatar" aria-hidden="true">?</span>
          <div><b>${s.label}</b><small>${s.name}</small></div>
          <span class="online">${s.status}</span>
        </div>
        <div class="chat-log" id="chatLog" aria-live="polite">${bubbles}</div>
        <div class="chat-choices" id="chatChoices">${choicesHtml}</div>
      </div>
      <p class="privacy-note"><svg class="ico"><use href="#i-lock"/></svg>This is a simulated chat. It never connects to a real account or website.</p>`;

    const log = $('#chatLog');
    requestAnimationFrame(() => { log.scrollTop = log.scrollHeight; });
    lessonBody.scrollTop = 0;

    if (!chatState.answered) {
      $$('[data-choice]', lessonBody).forEach(btn => {
        btn.addEventListener('click', () => pickChatChoice(Number(btn.dataset.choice)));
      });
    } else {
      $('#chatNextBtn').addEventListener('click', nextChatStep);
    }
  }

  function pickChatChoice(index) {
    const s = chatState.scenario;
    const step = s.steps[chatState.step];
    const choice = step.choices[index];
    if (!choice) return;

    if (choice.ok) chatState.score += 1;
    playSound(choice.ok ? 'correct' : 'wrong');
    chatState.transcript.push({ role: 'me', text: choice.text });
    chatState.transcript.push({ role: 'them', text: choice.reply });
    chatState.transcript.push({ role: 'sys', text: choice.tip });
    chatState.answered = true;
    renderChat();
  }

  function nextChatStep() {
    const s = chatState.scenario;
    chatState.step += 1;
    chatState.answered = false;

    if (chatState.step >= s.steps.length) {
      renderChatResult();
      return;
    }
    s.steps[chatState.step].them.forEach(text => {
      chatState.transcript.push({ role: 'them', text });
    });
    renderChat();
  }

  function renderChatResult() {
    const s = chatState.scenario;
    const total = s.steps.length;
    const stars = chatState.score === total ? 3 : chatState.score >= total - 1 ? 2 : 1;
    const message = chatState.score === total
      ? "Every line held. You don't just recognise a scam — you know how to stop it."
      : chatState.score >= total - 1
        ? 'You paused most of the time. Play again and notice how they raise the pressure, one message at a time.'
        : "You held the line in the end, but a few earlier replies almost gave it away. Remember: when they rush, you slow down.";

    activityStatus.textContent = 'Conversation over';
    lessonBody.innerHTML = `
      <div class="quiz-result">
        <div class="big-stars">${STAR(stars)}</div>
        <h3>${chatState.score} / ${total} safe choices</h3>
        <p>${message}</p>
        <p class="scene-ending">${s.ending}</p>
        <div class="game-actions">
          <button class="btn btn-ghost" type="button" id="chatAgain">Play again</button>
          <button class="btn btn-primary" type="button" id="chatDone">Complete activity</button>
        </div>
      </div>`;

    $('#chatAgain').addEventListener('click', () => startChat(state.mode === 'kid' ? 'kid' : state.mode === 'teen' ? 'teen' : 'adult'));
    $('#chatDone').addEventListener('click', () => {
      const detail = state.mode === 'adult'
        ? `You made ${chatState.score} safe choices in four lines. A real bank never asks you to transfer money to a “safe account” or hand over an SMS code.`
        : `You made ${chatState.score} safe choices in four lines. Your account name, password and verification code are never needed by a stranger — not one of them.`;
      completeActivity(stars, detail);
    });
    lessonBody.scrollTop = 0;
  }

  /* ==========================================================
     Lesson 3 activity — Site Check
     ========================================================== */

  let siteIndex = 0;
  let siteScore = 0;

  function startSite() {
    siteIndex = 0;
    siteScore = 0;
    renderSite();
  }

  function renderSite() {
    const item = SITE_CASES[siteIndex];
    const dots = SITE_CASES.map((_, index) => {
      const cls = index < siteIndex ? 'done' : index === siteIndex ? 'now' : '';
      return `<i class="${cls}"></i>`;
    }).join('');

    activityStatus.textContent = `Site ${siteIndex + 1} / ${SITE_CASES.length}`;
    lessonBody.innerHTML = `
      <p class="game-lede">Read the address bar, then the page. Would you trust this site with a login or a download?</p>
      <div class="quiz-progress" aria-hidden="true">${dots}</div>
      <div class="site-mock" id="siteCard">
        <div class="browser-bar">
          <span class="browser-dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="browser-url">${item.url}</span>
          <span class="browser-lock" aria-hidden="true">🔒</span>
        </div>
        <div class="site-page">
          <span class="site-label">WEB PAGE</span>
          <h3>${item.title}</h3>
          ${item.lines.map(line => `<p>${line}</p>`).join('')}
          <span class="site-action">${item.action}</span>
        </div>
      </div>
      <div class="answer-row" id="siteAnswers">
        <button class="answer-btn" type="button" data-site-answer="safe">✓ Looks legitimate</button>
        <button class="answer-btn" type="button" data-site-answer="bad">⚠ This is suspicious</button>
      </div>
      <div id="siteFeedback"></div>`;

    lessonBody.scrollTop = 0;
    $$('#siteAnswers [data-site-answer]').forEach(btn => {
      btn.addEventListener('click', () => answerSite(btn.dataset.siteAnswer, item));
    });
  }

  function answerSite(choice, item) {
    const correct = choice === item.verdict;
    if (correct) siteScore += 1;
    playSound(correct ? 'correct' : 'wrong');

    $$('#siteAnswers [data-site-answer]').forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.siteAnswer === item.verdict) {
        btn.style.borderColor = 'rgba(200,246,90,.65)';
        btn.style.color = '#c8f65a';
      }
      if (btn.dataset.siteAnswer === choice && !correct) {
        btn.style.borderColor = 'rgba(255,107,122,.55)';
        btn.style.color = '#ff9aa5';
      }
    });

    const clueHtml = item.clues.length
      ? `<ul class="clue-list">${item.clues.map((clue, index) => `<li><span class="n">${index + 1}</span><span>${clue}</span></li>`).join('')}</ul>`
      : `<ul class="clue-list"><li><span class="n" style="background:rgba(92,225,196,.16);color:#5ce1c4">✓</span><span>Exact domain, no password request, no scary download.</span></li></ul>`;

    const label = item.verdict === 'bad' ? 'This site is suspicious' : 'This site looks legitimate';
    const isLast = siteIndex === SITE_CASES.length - 1;
    $('#siteFeedback').innerHTML = `
      <div class="verdict ${correct ? 'good' : 'bad'}">
        <span class="v-ico">${correct ? '✓' : '!'}</span>
        <div><b>${correct ? 'Correct' : 'Not quite'}</b>${label}. ${item.explain}</div>
      </div>
      ${clueHtml}
      <div class="chat-next">
        <button class="btn btn-primary" id="siteNext" type="button">${isLast ? 'See results' : 'Next site'} <svg class="ico"><use href="#i-arrow"/></svg></button>
      </div>`;

    $('#siteNext').addEventListener('click', () => {
      if (isLast) {
        renderSiteResult();
      } else {
        siteIndex += 1;
        renderSite();
      }
    });
    $('#siteFeedback').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function renderSiteResult() {
    const total = SITE_CASES.length;
    const stars = siteScore >= 6 ? 3 : siteScore >= 4 ? 2 : 1;
    const message = siteScore >= 6
      ? 'Six for six. You read the domain before the page had a chance to act.'
      : siteScore >= 4
        ? 'Solid. A couple of lookalikes slipped through — read the part just before the first single slash.'
        : 'The domain is the tell. Play again and say the real owner out loud before you decide.';

    activityStatus.textContent = 'Results';
    lessonBody.innerHTML = `
      <div class="quiz-result">
        <div class="big-stars">${STAR(stars)}</div>
        <h3>${siteScore} / ${total} correct</h3>
        <p>${message}</p>
        <div class="game-actions">
          <button class="btn btn-ghost" type="button" id="siteAgain">Play again</button>
          <button class="btn btn-primary" type="button" id="siteDone">Complete activity</button>
        </div>
      </div>`;

    $('#siteAgain').addEventListener('click', startSite);
    $('#siteDone').addEventListener('click', () => {
      completeActivity(stars, `You judged ${siteScore} of ${total} sites correctly. The address bar is the part a fake page cannot copy exactly.`);
    });
    lessonBody.scrollTop = 0;
  }

  /* ==========================================================
     Lesson 4 activity — Password Gym
     ========================================================== */

  const COMMON_PASSWORDS = [
    '123456', 'password', 'qwerty', '111111', '12345678', 'abc123', 'iloveyou',
    'admin', 'welcome', 'monkey', 'dragon', '000000', '123123', '654321',
    '666666', '888888', 'asdfgh', 'letmein', 'password1', 'sunshine',
    'princess', 'football', 'charlie', 'aa123456', 'qwerty123', '1qaz2wsx',
    'zxcvbnm', '5201314', 'woaini', 'birthday', 'pokemon', 'superman',
    'batman', 'money', 'secret', 'master', 'hello', 'freedom', 'whatever',
    'trustno1', 'passw0rd', 'p@ssword', 'abc12345', '1234qwer'
  ];
  const SEQ_RE = /(0123|1234|2345|3456|4567|5678|6789|abcd|bcde|cdef|qwer|asdf|zxcv|0987|9876)/i;
  const REPEAT_RE = /(.)\1{2,}/;

  function charEntropy(ch) {
    if (/[\u3400-\u9fff]/.test(ch)) return Math.log2(3000);
    if (/[a-z]/.test(ch)) return Math.log2(26);
    if (/[A-Z]/.test(ch)) return Math.log2(26);
    if (/[0-9]/.test(ch)) return Math.log2(10);
    if (/\s/.test(ch)) return Math.log2(2);
    return Math.log2(33);
  }

  function humanizeTime(seconds) {
    if (!isFinite(seconds)) return 'practically forever';
    if (seconds < 1) return 'under a second';
    if (seconds < 60) return `${Math.max(1, Math.round(seconds))} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31557600) return `${Math.round(seconds / 86400)} days`;
    const years = seconds / 31557600;
    if (years < 1000) return `${Math.round(years)} years`;
    if (years < 1e6) return `${Math.round(years / 1000)} thousand years`;
    if (years < 1e9) return `${(years / 1e6).toFixed(1)} million years`;
    if (years < 1.38e10) return `${(years / 1e9).toFixed(1)} billion years`;
    return 'longer than the universe has existed';
  }

  function analyzePassword(pw) {
    const lower = pw.toLowerCase();
    const stripped = lower.replace(/[^a-z0-9]/g, '');
    const isCommon = pw.length > 0 && (
      COMMON_PASSWORDS.includes(lower) ||
      COMMON_PASSWORDS.includes(stripped) ||
      /^(.)\1+$/.test(pw)
    );
    const seq = SEQ_RE.test(pw);
    const repeat = REPEAT_RE.test(pw);

    let entropy = Array.from(pw).reduce((sum, ch) => sum + charEntropy(ch), 0);
    if (isCommon) entropy = Math.min(entropy, 10);
    if (seq) entropy *= 0.55;
    if (repeat) entropy *= 0.6;

    const kinds = [
      /[a-z]/.test(pw),
      /[A-Z]/.test(pw),
      /[0-9]/.test(pw),
      /[^a-zA-Z0-9]/.test(pw),
      /[\u3400-\u9fff]/.test(pw)
    ].filter(Boolean).length;

    const checks = [
      { id: 'length', text: 'At least 12 characters', ok: Array.from(pw).length >= 12 },
      { id: 'mix', text: 'Mixes character types', ok: kinds >= 2 },
      { id: 'common', text: 'Not a common or repeated password', ok: pw.length > 0 && !isCommon && !/^(.)\1+$/.test(pw) },
      { id: 'pattern', text: 'No sequences or repeats', ok: pw.length > 0 && !seq && !repeat }
    ];

    let level = 0;
    if (pw.length > 0) {
      level = entropy >= 65 ? 4 : entropy >= 45 ? 3 : entropy >= 28 ? 2 : 1;
    }

    return {
      entropy,
      level,
      isCommon,
      checks,
      seconds: Math.pow(2, Math.max(0, entropy - 1)) / 1e10
    };
  }

  const PASSPHRASE_WORDS = [
    'otter', 'mango', 'rocket', 'slipper', 'penguin', 'banana', 'cloud', 'octopus',
    'pearl', 'tiger', 'lighthouse', 'comet', 'pumpkin', 'hedgehog', 'umbrella',
    'guitar', 'whale', 'chili', 'castle', 'snowman', 'dragon', 'cupcake', 'pencil',
    'frog', 'rainbow', 'volcano', 'pineapple', 'seashell', 'maple', 'badger',
    'scooter', 'hamster', 'meteor', 'waffle', 'compass', 'donut', 'lantern',
    'koala', 'cactus', 'muffin', 'tornado', 'banjo', 'walrus', 'peach',
    'kettle', 'zebra', 'bubble', 'igloo', 'jelly', 'kiwi', 'lemon',
    'magnet', 'noodle', 'oasis', 'panda', 'quilt', 'robot', 'sock', 'turtle'
  ];

  function generatePassphrase() {
    const picked = [];
    while (picked.length < 5) {
      const word = PASSPHRASE_WORDS[Math.floor(Math.random() * PASSPHRASE_WORDS.length)];
      if (!picked.includes(word)) picked.push(word);
    }
    return `${picked.join('-')}-${Math.floor(Math.random() * 90) + 10}!`;
  }

  function startPassword() {
    const tips = {
      kid: `<p>String together 4–5 <b>unrelated</b> words, then add digits and a symbol.</p>
            <p>Example: “otter-mango-rocket-slipper-penguin-42!”. Long, but easy to remember.</p>
            <p>Never use your birthday, phone number, name, or “123456”.</p>`,
      teen: `<p>Length beats complexity. Adding a few characters is better than swapping <b>a</b> for <b>@</b>.</p>
             <p>Use a different password on every site, so one leak doesn't unlock everything.</p>
             <p>Can't remember them? Let a password manager do it.</p>`,
      adult: `<p>Stop memorising passwords. Use a password manager and remember one strong master passphrase.</p>
              <p>A five-word phrase beats “P@ssw0rd!” — longer and easier to recall.</p>
              <p>Start with your email, then turn on 2FA. The highest return for five minutes.</p>`
    };

    activityStatus.textContent = 'Goal: reach “Very strong”';
    lessonBody.innerHTML = `
      <p class="game-lede">Type a password to test. It is estimated <b>on your device</b> — never sent anywhere, never stored.</p>
      <div class="game-grid">
        <div class="game-main">
          <label class="field-label" for="pwInput">Test a password</label>
          <div class="pw-field">
            <input id="pwInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Try: Summer2024" aria-describedby="pwNote">
            <button class="pw-toggle" id="pwToggle" type="button" aria-label="Hide password">Hide</button>
          </div>

          <div class="strength" id="pwStrength" data-level="0">
            <div class="bars" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
            <div class="strength-meta">
              <span class="strength-label" id="pwLabel">Waiting…</span>
              <span class="strength-time" id="pwTime">Start typing</span>
            </div>
          </div>

          <ul class="checklist" id="pwChecks" aria-label="Password checks">
            <li data-check="length">At least 12 characters</li>
            <li data-check="mix">Mixes character types</li>
            <li data-check="common">Not a common or repeated password</li>
            <li data-check="pattern">No sequences or repeats</li>
          </ul>

          <div class="game-actions">
            <button class="btn btn-ghost" id="pwGen" type="button">🎲 Generate a safe passphrase</button>
            <button class="btn btn-primary" id="pwDone" type="button" disabled>Complete activity</button>
          </div>
          <p class="privacy-note" id="pwNote"><svg class="ico"><use href="#i-lock"/></svg>Calculated in your browser only. Close the tab and it's gone.</p>
        </div>

        <aside class="tip-card">
          <h4><svg class="ico"><use href="#i-key"/></svg>Hint</h4>
          ${tips[state.mode]}
          <p class="tip-quote">“Passwords are like toothbrushes: don't share them, and don't use someone else's.”</p>
        </aside>
      </div>`;

    const input = $('#pwInput');
    const toggle = $('#pwToggle');
    const strength = $('#pwStrength');
    const label = $('#pwLabel');
    const time = $('#pwTime');
    const done = $('#pwDone');
    const checks = $('#pwChecks');
    let lastAnalysis = analyzePassword('');

    function update() {
      const analysis = analyzePassword(input.value);
      lastAnalysis = analysis;
      strength.dataset.level = String(analysis.level);
      $$('i', strength).forEach((bar, index) => {
        bar.classList.toggle('is-on', index < analysis.level);
      });
      label.textContent = ['Waiting…', 'Very weak', 'Weak', 'Good', 'Very strong'][analysis.level];
      if (input.value.length === 0) {
        time.textContent = 'Start typing';
      } else {
        time.innerHTML = `Crack time: <b>${humanizeTime(analysis.seconds)}</b>`;
      }
      analysis.checks.forEach(check => {
        const item = $(`[data-check="${check.id}"]`, checks);
        if (item) item.classList.toggle('ok', check.ok);
      });
      done.disabled = !(analysis.entropy >= 60 && !analysis.isCommon);
      done.textContent = done.disabled ? 'Complete activity' : 'Complete activity ✓';
    }

    input.addEventListener('input', update);
    toggle.addEventListener('click', () => {
      const showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      toggle.textContent = showing ? 'Show' : 'Hide';
      toggle.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
      input.focus();
    });
    $('#pwGen').addEventListener('click', () => {
      input.type = 'text';
      toggle.textContent = 'Hide';
      input.value = generatePassphrase();
      update();
      input.focus();
      input.select();
      playSound('click');
      toast('Passphrase generated. Try to memorise it.');
    });
    done.addEventListener('click', () => {
      if (done.disabled) return;
      const stars = lastAnalysis.entropy >= 90 ? 3 : lastAnalysis.entropy >= 65 ? 2 : 1;
      completeActivity(
        stars,
        `Estimated offline crack time: ${humanizeTime(lastAnalysis.seconds)}. Next: switch your most important account to a passphrase like this, and turn on two-step verification.`
      );
    });

    update();
    lessonBody.scrollTop = 0;
  }

  /* ==========================================================
     Lesson 5 activity — Set up 2FA
     ========================================================== */

  let twoFaStep = 0;
  let twoFaMethod = null;

  function startTwoFA() {
    twoFaStep = 0;
    twoFaMethod = null;
    renderTwoFA();
  }

  function qrMock() {
    let cells = '';
    for (let y = 0; y < 21; y += 1) {
      for (let x = 0; x < 21; x += 1) {
        const finder = (
          (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13)
        );
        let on;
        if (finder) {
          const fx = x < 7 ? x : x - 14;
          const fy = y < 7 ? y : y - 14;
          on = fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4);
        } else {
          on = ((x * 7 + y * 11 + x * y) % 5) < 2;
        }
        if (on) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
      }
    }
    return `<svg viewBox="0 0 21 21" class="qr-svg" aria-hidden="true" role="img">${cells}</svg>`;
  }

  function renderTwoFA() {
    if (twoFaStep === 0) {
      activityStatus.textContent = 'Setup 1 / 3 · Choose a method';
      lessonBody.innerHTML = `
        <p class="game-lede">A password alone is one key. Pick a second key for your account. In this simulation, nothing real is connected.</p>
        <div class="twofa-methods">
          <button class="twofa-method" type="button" data-twofa-method="sms">
            <span class="twofa-ico">💬</span><b>SMS code</b><small>Easy, but can be intercepted or SIM-swapped.</small>
          </button>
          <button class="twofa-method" type="button" data-twofa-method="app">
            <span class="twofa-ico">📱</span><b>Authenticator app</b><small>A code on your device. Safer than SMS.</small>
          </button>
          <button class="twofa-method" type="button" data-twofa-method="passkey">
            <span class="twofa-ico">🔑</span><b>Passkey</b><small>Face or fingerprint. Resists phishing.</small>
          </button>
        </div>
        <div id="twofaFeedback"></div>`;
      $$('[data-twofa-method]').forEach(btn => {
        btn.addEventListener('click', () => {
          twoFaMethod = btn.dataset.twofaMethod;
          const copy = {
            sms: 'Better than nothing, but SMS can be intercepted or SIM-swapped. Use it only if nothing else is available.',
            app: 'Good choice. The code lives on your device, not on your SIM.',
            passkey: 'Excellent. Passkeys resist phishing because there is no code to type or share.'
          };
          $$('[data-twofa-method]').forEach(item => item.classList.toggle('is-selected', item === btn));
          $('#twofaFeedback').innerHTML = `
            <div class="verdict ${twoFaMethod === 'sms' ? 'bad' : 'good'}">
              <span class="v-ico">${twoFaMethod === 'sms' ? '!' : '✓'}</span>
              <div>${copy[twoFaMethod]}</div>
            </div>
            <div class="game-actions"><button class="btn btn-primary" id="twofaContinue" type="button">Continue <svg class="ico"><use href="#i-arrow"/></svg></button></div>`;
          $('#twofaContinue').addEventListener('click', () => {
            twoFaStep = 1;
            renderTwoFA();
          });
        });
      });
    } else if (twoFaStep === 1) {
      activityStatus.textContent = 'Setup 2 / 3 · Verify';
      lessonBody.innerHTML = `
        <p class="game-lede">Scan the code with your authenticator app, then enter the six-digit code it shows. For this simulation, use <b>482913</b>.</p>
        <div class="twofa-scan">
          <div class="qr-frame">${qrMock()}</div>
          <div class="twofa-code">
            <label class="field-label" for="twofaCode">Six-digit code</label>
            <input id="twofaCode" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="7" placeholder="482 913">
            <button class="btn btn-primary" id="twofaVerify" type="button">Verify</button>
            <p class="twofa-error" id="twofaError" role="status"></p>
          </div>
        </div>`;
      $('#twofaVerify').addEventListener('click', () => {
        const value = $('#twofaCode').value.replace(/\D/g, '');
        if (value === '482913') {
          playSound('correct');
          twoFaStep = 2;
          renderTwoFA();
        } else {
          playSound('wrong');
          $('#twofaError').textContent = 'That code does not match. In the simulation, use 482913.';
        }
      });
    } else {
      activityStatus.textContent = 'Setup 3 / 3 · Save backup codes';
      const codes = ['7K2Q-9F4M', 'P8XJ-2L6R', 'T4NV-8C3H', 'M6BW-5Y7D', 'R9SK-3Q2A'];
      lessonBody.innerHTML = `
        <p class="game-lede">Your second key can be lost. Save these one-time backup codes somewhere offline — not in the same app as the codes.</p>
        <div class="backup-codes">
          ${codes.map(code => `<code>${code}</code>`).join('')}
        </div>
        <label class="check-row">
          <input type="checkbox" id="twofaSaved">
          <span>I saved the backup codes somewhere safe.</span>
        </label>
        <div class="game-actions">
          <button class="btn btn-primary" id="twofaFinish" type="button" disabled>Finish setup</button>
        </div>`;
      $('#twofaSaved').addEventListener('change', event => {
        $('#twofaFinish').disabled = !event.target.checked;
      });
      $('#twofaFinish').addEventListener('click', () => {
        const methodName = twoFaMethod === 'passkey' ? 'a passkey' : twoFaMethod === 'app' ? 'an authenticator app' : 'SMS';
        completeActivity(
          twoFaMethod === 'sms' ? 2 : 3,
          `You set up ${methodName}, verified a code and saved backup codes. That is the full 2FA loop — never share the code, and keep the backups offline.`
        );
      });
    }
    lessonBody.scrollTop = 0;
  }

  /* ==========================================================
     Lesson 6 activity — Privacy Map
     ========================================================== */

  let privacyState = {};
  let privacyTouched = 0;

  function resetPrivacyState() {
    privacyState = {
      name: true,
      school: false,
      birthday: true,
      location: false,
      home: false,
      ticket: false,
      pet: true,
      email: false,
      hobby: true
    };
    privacyTouched = 0;
  }

  function privacyRisk() {
    return Math.min(100, PRIVACY_ITEMS.reduce(
      (sum, item) => sum + (privacyState[item.id] ? item.risk : 0),
      0
    ));
  }

  function riskInfo(risk) {
    if (risk <= 15) return { color: '#5ce1c4', label: 'Low risk: a scammer has very little to work with.' };
    if (risk <= 40) return { color: '#c8f65a', label: 'Medium-low: pause and ask which details really need to be public.' };
    if (risk <= 70) return { color: '#ffcb5c', label: 'High: together, these details read like an identity profile.' };
    return { color: '#ff6b7a', label: "Critical: a stranger could work out who you are, where you live, and when you're away." };
  }

  function privacyInferences() {
    const list = [];
    if (privacyState.name && privacyState.birthday) list.push('Name + birthday: used to guess passwords, answer security questions or impersonate you.');
    if (privacyState.school && privacyState.name) list.push('School + full name: someone can pose as a teacher, classmate or parent.');
    if (privacyState.location) list.push("Live location: they know where you are — and when you're not home.");
    if (privacyState.home) list.push('Front-door photo: house numbers, street signs and landmarks can be matched to your address.');
    if (privacyState.ticket) list.push('Ticket photo: barcodes and names can be abused.');
    if ((privacyState.pet || privacyState.birthday) && privacyState.name) list.push('Pet name or birthday + name: common password-reset answers, easily guessed.');
    if (privacyState.email) list.push('Email: added to phishing lists for even more fake notices.');

    if (list.length === 0) {
      list.push({ safe: true, text: "No high-risk personal data is public right now. Remember: it's not “share nothing” — it's “share only what you're happy for the world to see.”" });
    } else if (list.length <= 2) {
      list.push({ safe: true, text: 'Fairly safe for now. One more detail could complete the puzzle.' });
    }
    return list;
  }

  function startPrivacy() {
    resetPrivacyState();
    renderPrivacy();
  }

  function renderPrivacy() {
    activityStatus.textContent = 'Adjust your public profile';
    const rows = PRIVACY_ITEMS.map(item => `
      <div class="privacy-row">
        <span class="p-emoji" aria-hidden="true">${item.emoji}</span>
        <span class="p-copy"><b>${item.label}</b><small>${item.note}</small></span>
        <span class="switch">
          <input type="checkbox" data-privacy="${item.id}" ${privacyState[item.id] ? 'checked' : ''} aria-label="Show ${item.label} publicly">
          <i aria-hidden="true"></i>
        </span>
      </div>`).join('');

    lessonBody.innerHTML = `
      <p class="game-lede">This is your public profile. Anything switched on is visible to everyone. Change the settings and watch the risk update.</p>
      <div class="privacy-grid">
        <div class="profile-card">
          <div class="profile-head">
            <span class="profile-avatar" aria-hidden="true">S</span>
            <div><b>Curious Explorer</b><small>@suso_explorer</small></div>
            <span class="pill">PUBLIC PROFILE</span>
          </div>
          <div class="privacy-list">${rows}</div>
        </div>

        <div class="risk-card" id="riskCard" style="--risk:#c8f65a">
          <div class="risk-head"><span>How a scammer sees you</span><b id="riskValue">0</b></div>
          <div class="risk-meter"><i id="riskMeter"></i></div>
          <p class="risk-label" id="riskLabel"></p>
          <p class="inference-title">What they can piece together</p>
          <ul class="inference-list" id="inferenceList"></ul>
          <div class="game-actions">
            <button class="btn btn-primary" id="privacySave" type="button" disabled>Save my privacy settings</button>
          </div>
        </div>
      </div>
      <p class="privacy-note"><svg class="ico"><use href="#i-lock"/></svg>This is only a practice profile. Nothing is published.</p>`;

    const riskCard = $('#riskCard');
    const meter = $('#riskMeter');
    const value = $('#riskValue');
    const label = $('#riskLabel');
    const list = $('#inferenceList');
    const save = $('#privacySave');

    function update() {
      const risk = privacyRisk();
      const info = riskInfo(risk);
      riskCard.style.setProperty('--risk', info.color);
      meter.style.width = `${risk}%`;
      meter.style.background = info.color;
      value.textContent = String(risk);
      value.style.color = info.color;
      label.textContent = info.label;

      list.innerHTML = privacyInferences().map(entry => {
        if (typeof entry === 'string') {
          return `<li><span class="warn">⚠</span><span>${entry}</span></li>`;
        }
        return `<li class="ok"><span class="warn">✓</span><span>${entry.text}</span></li>`;
      }).join('');

      save.disabled = privacyTouched < 4;
      save.textContent = privacyTouched < 4
        ? `Change ${4 - privacyTouched} more to save`
        : 'Save my privacy settings';
    }

    $$('[data-privacy]', lessonBody).forEach(input => {
      input.addEventListener('change', () => {
        privacyState[input.dataset.privacy] = input.checked;
        privacyTouched += 1;
        playSound('click');
        update();
      });
    });

    save.addEventListener('click', () => {
      const risk = privacyRisk();
      const stars = risk <= 15 ? 3 : risk <= 40 ? 2 : 1;
      completeActivity(
        stars,
        `Your public risk score is ${risk}/100. The goal isn't to switch everything off — it's to share only what needs sharing. Live location and front-door photos are rarely worth the risk.`
      );
    });

    update();
    lessonBody.scrollTop = 0;
  }

  /* ==========================================================
     Lesson 7 activity — Wi-Fi decisions
     ========================================================== */

  let wifiIndex = 0;
  let wifiScore = 0;

  function startWifi() {
    wifiIndex = 0;
    wifiScore = 0;
    renderWifi();
  }

  function renderWifi() {
    const step = WIFI_STEPS[wifiIndex];
    activityStatus.textContent = `Decision ${wifiIndex + 1} / ${WIFI_STEPS.length}`;

    lessonBody.innerHTML = `
      <div class="decision-card">
        <div class="decision-head">
          <span class="wifi-badge"><svg class="ico"><use href="#i-wifi"/></svg></span>
          <div><b>Café connection</b><small>${step.label}</small></div>
          <span class="online">PUBLIC NETWORK</span>
        </div>
        <div class="decision-body">
          <p class="decision-step">Decision ${wifiIndex + 1} of ${WIFI_STEPS.length}</p>
          <h3>${step.prompt}</h3>
          <div class="decision-options" id="wifiOptions">
            ${step.options.map((option, index) => `
              <button class="choice-btn" type="button" data-wifi-choice="${index}">
                <span class="idx">${String.fromCharCode(65 + index)}</span><span>${option.text}</span>
              </button>`).join('')}
          </div>
        </div>
        <div id="wifiFeedback"></div>
      </div>`;

    lessonBody.scrollTop = 0;
    $$('[data-wifi-choice]').forEach(btn => {
      btn.addEventListener('click', () => {
        const choice = step.options[Number(btn.dataset.wifiChoice)];
        const correct = choice.ok;
        if (correct) wifiScore += 1;
        playSound(correct ? 'correct' : 'wrong');
        $$('[data-wifi-choice]').forEach(item => { item.disabled = true; });
        btn.classList.add(correct ? 'is-correct' : 'is-wrong');
        const right = step.options.find(option => option.ok);
        $('#wifiFeedback').innerHTML = `
          <div class="verdict ${correct ? 'good' : 'bad'}">
            <span class="v-ico">${correct ? '✓' : '!'}</span>
            <div><b>${correct ? 'Good call' : 'Not this one'}</b>${choice.feedback}${correct ? '' : ` <span class="fix">Better: ${right.text}</span>`}</div>
          </div>
          <div class="chat-next">
            <button class="btn btn-primary" id="wifiNext" type="button">${wifiIndex === WIFI_STEPS.length - 1 ? 'See results' : 'Next decision'} <svg class="ico"><use href="#i-arrow"/></svg></button>
          </div>`;
        $('#wifiNext').addEventListener('click', () => {
          if (wifiIndex === WIFI_STEPS.length - 1) {
            renderWifiResult();
          } else {
            wifiIndex += 1;
            renderWifi();
          }
        });
        $('#wifiFeedback').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });
  }

  function renderWifiResult() {
    const total = WIFI_STEPS.length;
    const stars = wifiScore === total ? 3 : wifiScore >= total - 1 ? 2 : 1;
    const message = wifiScore === total
      ? 'Four clean decisions. You treated the network like a public room — because it is.'
      : wifiScore >= total - 1
        ? 'Almost perfect. The remaining risk is usually convenience: one “just this once” is enough.'
        : 'Public Wi-Fi is convenient for attackers too. Confirm the network, use mobile data for money, and decline profiles.';

    activityStatus.textContent = 'Results';
    lessonBody.innerHTML = `
      <div class="quiz-result">
        <div class="big-stars">${STAR(stars)}</div>
        <h3>${wifiScore} / ${total} safe decisions</h3>
        <p>${message}</p>
        <div class="game-actions">
          <button class="btn btn-ghost" type="button" id="wifiAgain">Play again</button>
          <button class="btn btn-primary" type="button" id="wifiDone">Complete activity</button>
        </div>
      </div>`;

    $('#wifiAgain').addEventListener('click', startWifi);
    $('#wifiDone').addEventListener('click', () => {
      completeActivity(stars, `You made ${wifiScore} of ${total} safe decisions on a public network. The rule: confirm the network, protect the login, decline the profile.`);
    });
    lessonBody.scrollTop = 0;
  }

  /* ==========================================================
     Shop, profile, reset
     ========================================================== */

  function buyOrEquip(type, id) {
    const item = type === 'colors'
      ? AVATAR_COLORS.find(color => color.id === id)
      : type === 'accessories'
        ? ACCESSORIES.find(accessory => accessory.id === id)
        : PETS.find(pet => pet.id === id);
    if (!item) return;

    const owned = state.owned[type];
    if (!owned.includes(id)) {
      if (state.coins < item.price) {
        toast(`Not enough coins — ${item.price - state.coins} more to go. Finish a lesson first.`);
        return;
      }
      state.coins -= item.price;
      owned.push(id);
      toast(`${item.name} unlocked!`);
      playSound('win');
    }

    if (type === 'colors') state.avatar.color = id;
    if (type === 'accessories') state.avatar.accessory = id;
    if (type === 'pets') {
      state.avatar.pet = id;
      if (id !== 'none') state.petName = item.name;
    }
    save();
    renderAll();
    playSound('click');
  }

  function jumpToProfile() {
    window.location.href = '/profile/';
  }

  $('#profileBtn')?.addEventListener('click', jumpToProfile);
  $('#openCrew2')?.addEventListener('click', jumpToProfile);

  $('#shopTabs')?.addEventListener('click', event => {
    const tab = event.target.closest('[data-shop-tab]');
    if (!tab) return;
    shopTab = tab.dataset.shopTab;
    renderShop();
  });

  $('#shopGrid')?.addEventListener('click', event => {
    const item = event.target.closest('[data-buy-type]');
    if (!item) return;
    buyOrEquip(item.dataset.buyType, item.dataset.buyId);
  });

  $('#explorerName')?.addEventListener('input', event => {
    state.name = event.target.value;
    save();
    renderSetup();
    renderPassport();
    renderCertificate();
    const certInput = $('#certName');
    if (certInput) certInput.value = state.name;
  });

  $('#certName')?.addEventListener('input', event => {
    state.name = event.target.value;
    save();
    renderSetup();
    renderPassport();
    const explorerInput = $('#explorerName');
    if (explorerInput) explorerInput.value = state.name;
    renderCertificate();
  });

  $('#petName')?.addEventListener('input', event => {
    state.petName = event.target.value;
    save();
    renderSetup();
    renderCrew();
    renderCertificate();
  });

  $('#schoolSelect')?.addEventListener('change', event => {
    if (!state.stagesByMode || typeof state.stagesByMode !== 'object') {
      state.stagesByMode = { kid: 'primary', teen: 'high', adult: 'working' };
    }
    state.stagesByMode[state.mode] = event.target.value;
    state.school = state.stagesByMode.kid;
    save();
    renderSetup();
    const schoolTip = $('#schoolTip');
    if (schoolTip) schoolTip.textContent = STAGE_TIPS[state.stagesByMode[state.mode]] || '';
    toast(`Life stage: ${schoolLabel()}. This stays on your device.`);
  });

  document.addEventListener('click', event => {
    const modeBtn = event.target.closest('.mode-pill[data-mode], .route-btn[data-mode]');
    const routeCard = event.target.closest('.route-card[data-route]');
    if (modeBtn) {
      setMode(modeBtn.dataset.mode);
      return;
    }
    if (routeCard && !event.target.closest('a, button')) {
      const targetMode = routeCard.dataset.route;
      if (MODE_INFO[targetMode]) {
        setMode(targetMode);
      }
      return;
    }
    const arcadeBtn = event.target.closest('[data-arcade]');
    if (arcadeBtn) {
      openArcadeGame(Number(arcadeBtn.dataset.arcade));
      return;
    }
    const lessonBtn = event.target.closest('[data-lesson]');
    if (lessonBtn && !lessonBtn.disabled) {
      openLesson(Number(lessonBtn.dataset.lesson));
    }
  });

  $('#heroStart')?.addEventListener('click', () => {
    const heroBtn = $('#heroStart');
    if (!heroBtn) return;
    const targetType = heroBtn.dataset.targetType || 'lesson';
    const targetId = Number(heroBtn.dataset.targetId) || 1;

    if (targetType === 'game') {
      if (document.body.dataset.page === 'games') {
        openArcadeGame(targetId);
      } else {
        window.location.href = `/games/?game=${targetId}`;
      }
      return;
    }

    if (document.body.dataset.page === 'home') {
      window.location.href = `/lessons/?lesson=${targetId}`;
      return;
    }
    openLesson(targetId);
  });

  $('#unlockAll')?.addEventListener('click', () => {
    state.unlockAll = !state.unlockAll;
    save();
    renderPath();
    renderPassport();
    toast(state.unlockAll ? 'All lessons unlocked. Good for classrooms.' : 'Back to the guided sequence.');
  });

  $('#resetProgress')?.addEventListener('click', () => {
    const ok = window.confirm("Clear all lesson progress, coins, gear and the certificate? This can't be undone.");
    if (!ok) return;
    state = defaultState();
    save();
    closeLesson();
    renderAll();
    updateSoundButton();
    toast('Fresh island. Lesson 1 is ready.');
  });

  /* ==========================================================
     Certificate
     ========================================================== */

  $('#printCert')?.addEventListener('click', () => {
    const printCertBtn = $('#printCert');
    if (printCertBtn && printCertBtn.disabled) return;
    window.print();
  });

  /* ==========================================================
     Install (PWA)
     ========================================================== */

  let deferredInstall = null;

  function updateInstallUI() {
    const btn = $('#installBtn');
    const status = $('#installStatus');
    if (!btn || !status) return;
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (standalone) {
      btn.textContent = 'Installed';
      btn.disabled = true;
      status.textContent = "You're using the installed app. Progress stays on this device.";
      return;
    }
    if (deferredInstall) {
      btn.textContent = 'Install app';
      btn.disabled = false;
      status.textContent = 'Ready to install. Free, no account, works offline.';
      return;
    }
    btn.textContent = 'How to install';
    status.textContent = 'Free · No account · Works offline after the first visit.';
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstall = event;
    updateInstallUI();
  });

  window.addEventListener('appinstalled', () => {
    deferredInstall = null;
    updateInstallUI();
    toast('SusOrSafe installed. See you on the home screen.');
  });

  $('#installBtn')?.addEventListener('click', async () => {
    if (deferredInstall) {
      deferredInstall.prompt();
      try {
        await deferredInstall.userChoice;
      } catch (err) {
        /* ignore */
      }
      deferredInstall = null;
      updateInstallUI();
      return;
    }
    const help = $('#installHelp');
    help.open = true;
    help.scrollIntoView({ behavior: 'smooth', block: 'center' });
    toast('Open your browser menu and choose “Install app” or “Add to Home Screen”.');
  });

  /* ==========================================================
     Init & Global Listeners
     ========================================================== */

  // Sign out wipe listener for client-side forms
  document.addEventListener('submit', (e) => {
    const form = e.target.closest('form');
    if (form && (form.classList.contains('logout-form') || (form.action && form.action.includes('logout')))) {
      try {
        localStorage.removeItem(STORE_KEY);
        localStorage.removeItem('susorsafe_mode');
        sessionStorage.clear();
      } catch (err) {}
    }
  });

  // Page unload / backgrounding sync
  window.addEventListener('pagehide', () => {
    if (window.SUSORSAFE_USER && window.SUSORSAFE_USER.isAuthenticated) {
      try {
        progressSyncRequest('/api/user-progress-sync/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken()
          },
          credentials: 'same-origin',
          body: JSON.stringify(state),
          keepalive: true
        });
      } catch (e) {}
    }
  });

  function init() {
    const params = new URLSearchParams(window.location.search);
    const startMode = params.get('mode');
    if (MODE_INFO[startMode]) state.mode = startMode;

    if (!state.name && state.avatar.pet === 'pip') {
      state.petName = state.petName || 'Pip';
    }

    renderAll();

    const lesson = Number(params.get('lesson'));
    if (lesson && LESSONS.some(item => item.id === lesson)) {
      setTimeout(() => openLesson(lesson), 500);
    }

    const game = Number(params.get('game'));
    if (game && ARCADE_GAMES.some(item => item.id === game)) {
      setTimeout(() => openArcadeGame(game), 500);
    }

    fetchServerState();

    if ('serviceWorker' in navigator && /^https?:$/.test(window.location.protocol)) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      });
    }
  }

  init();
})();
