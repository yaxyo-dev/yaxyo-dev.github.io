// All the words on the site that aren't about one specific project.
// English first, Uzbek second, in the same shape.

export const ui = {
  en: {
    locale: 'en_US',
    meta: {
      title: 'Yaxyo Nigmatov, Junior Engineer in Samarkand',
      description:
        'Portfolio of Yaxyo Nigmatov, a junior engineer in Samarkand, Uzbekistan. Demo websites for local businesses, an AI assistant for Telegram and a Roblox game.',
    },
    skip: 'Skip to content',
    role: 'Junior engineer, Samarkand',
    navLabel: 'Main',
    nav: { work: 'Work', about: 'About', skills: 'Skills', contact: 'Contact' },
    menu: 'Open menu',
    menuClose: 'Close menu',
    switchLabel: 'O‘zbekcha',
    switchShort: 'O‘Z',
    switchTitle: 'Read this page in Uzbek',
    themeLabel: 'Light mode',
    hero: {
      statement: 'Websites, Telegram bots and games, built in Samarkand.',
      sub: 'Business owners see a free demo first and pay only if they like it.',
      primary: 'Message me on Telegram',
      scroll: 'Scroll to explore',
    },
    work: {
      title: 'Work',
      intro:
        'Four of these are demo sites made for local businesses, so the owner can see the result before paying anything. The other two are my own: a Telegram assistant that answers my customers and a Roblox game.',
      demoTag: 'Demo',
      case: 'Read the case study',
      demo: 'Open the demo',
    },
    offer: {
      title: 'If you own a small business, here’s how it works',
      items: [
        ['Free demo first', 'You see your site before you pay. If you don’t like it, you owe nothing.'],
        ['Ready in 5–7 days', 'A one-page site that looks good on phones: about, photos, prices or menu, map, phone, and a Telegram or booking button.'],
        ['1.5–2.5M so‘m', 'Depending on the size of the site. Domain, hosting, online payment or an admin panel are quoted separately.'],
        ['A month of small changes', 'Free after your site is ready.'],
      ],
      cta: 'Ask for a free demo',
      prefill: 'Hello! I’d like a free demo website for my business.',
    },
    game: {
      alt: 'Troop Crates promo art: a glowing crate surrounded by blocky troops, with the words Open, Collect, Survive the Lava',
      altLava: 'Lava Run promo art: a troop jumping between platforms over lava toward a trophy',
      altSecret: 'Secret Troops promo art: Glitch, Void King and Golden God on a glowing stage',
    },
    bot: {
      chatLabel: 'Example of a customer conversation with the bot',
      chatCaption: 'Example conversation, based on the bot’s real rules.',
      chat: [
        ['them', 'Hi, I need a website for my barbershop. How much is it?'],
        ['bot', 'Hi! A one-page site that looks great on phones is 1.5–2.5M so‘m and takes 5–7 days. I’ll show you a free demo first, and you only pay if you like it.'],
        ['them', 'Great, let’s do it. How do I pay?'],
        ['bot', 'Great! I’ll write to you personally in a moment.'],
        ['sys', 'Handed to Yaxyo. The bot stays quiet in this chat for 48 hours.'],
      ],
    },
    about: {
      title: 'About me',
      body: [
        'I pushed my first website to GitHub in July 2026. Four months later I was building things people can actually use: pages for businesses in my region, an assistant that handles customer messages, and a game with its own economy.',
        'The goal hasn’t changed since that first page: make things that are easy to use and work well on every screen. Right now I’m going deeper into React, APIs and responsive design, and improving my English so I can read technical documentation more easily.',
      ],
      timeline: [
        ['Jul 2026', 'First website pushed to GitHub'],
        ['Oct 2026', 'Started as a Junior Engineer'],
        ['Nov 2026', 'Troop Crates, Mijoz Bot and four business demos'],
      ],
    },
    skills: {
      title: 'What I work with',
      items: [
        ['Web and interfaces', 'Pages that load fast and look right on a phone first.', ['HTML', 'CSS', 'JavaScript', 'React', 'React Router', 'Vite', 'Bootstrap']],
        ['Telegram bots', 'Assistants that answer customers and know when to hand over to a person.', ['Python', 'python-telegram-bot', 'Gemini API']],
        ['Games', 'Game loops, in-game economies and server logic for Roblox.', ['Roblox Studio', 'Luau']],
        ['Tools', 'Version control and getting work online.', ['Git', 'GitHub', 'GitHub Pages']],
      ],
    },
    contact: {
      title: 'Just say salom.',
      before: 'Just say',
      after: '',
      lede: 'Telegram is the fastest way to reach me. Email works too.',
      email: 'Email',
    },
    place: 'Samarkand, Uzbekistan',
    case: {
      back: 'All work',
      role: 'My role',
      year: 'Year',
      stack: 'Built with',
      status: 'Status',
      try: 'Try the live page',
      open: 'Open in a new tab',
      closeLive: 'Back to the screenshot',
      desktopAlt: (name) => `The ${name} website on a desktop screen`,
      phoneAlt: (name) => `The ${name} website on a phone`,
      liveTitle: (name) => `Live demo of the ${name} website`,
      flowTitle: 'How a message moves',
      next: 'Next project',
    },
  },

  uz: {
    locale: 'uz_UZ',
    meta: {
      title: 'Yaxyo Nigmatov, Samarqanddagi junior muhandis',
      description:
        'Samarqandlik junior muhandis Yaxyo Nigmatovning portfoliosi. Mahalliy bizneslar uchun namuna saytlar, Telegram uchun AI yordamchi va Roblox o‘yini.',
    },
    skip: 'Asosiy qismga o‘tish',
    role: 'Junior muhandis, Samarqand',
    navLabel: 'Asosiy menyu',
    nav: { work: 'Ishlar', about: 'Men haqimda', skills: 'Ko‘nikmalar', contact: 'Aloqa' },
    menu: 'Menyuni ochish',
    menuClose: 'Menyuni yopish',
    switchLabel: 'English',
    switchShort: 'EN',
    switchTitle: 'Bu sahifani ingliz tilida o‘qish',
    themeLabel: 'Yorug‘ rejim',
    hero: {
      statement: 'Samarqandda yaratilgan saytlar, Telegram botlar va o‘yinlar.',
      sub: 'Biznes egalari avval bepul namunani ko‘radi va faqat yoqsa to‘laydi.',
      primary: 'Telegram’da yozing',
      scroll: 'Pastga aylantiring',
    },
    work: {
      title: 'Ishlar',
      intro:
        'To‘rttasi mahalliy bizneslar uchun tayyorlangan namuna sayt: egasi natijani oldindan va bepul ko‘radi. Qolgan ikkitasi o‘z loyihalarim: mijozlarimga javob beradigan Telegram yordamchi va Roblox o‘yini.',
      demoTag: 'Namuna',
      case: 'Batafsil o‘qish',
      demo: 'Namunani ochish',
    },
    offer: {
      title: 'Kichik biznes egasi bo‘lsangiz, ish shunday boradi',
      items: [
        ['Avval bepul namuna', 'To‘lashdan oldin saytingizni ko‘rasiz. Yoqmasa, hech narsa to‘lamaysiz.'],
        ['5–7 kunda tayyor', 'Telefonda chiroyli ko‘rinadigan bir sahifali sayt: biznesingiz haqida, rasmlar, narxlar yoki menyu, xarita, telefon va Telegram yoki bron tugmasi.'],
        ['1,5–2,5 mln so‘m', 'Narx saytning hajmiga bog‘liq. Domen, hosting, onlayn to‘lov yoki admin panel alohida kelishiladi.'],
        ['Bir oy kichik o‘zgarishlar', 'Sayt tayyor bo‘lgach, bepul.'],
      ],
      cta: 'Bepul namuna so‘rash',
      prefill: 'Salom! Biznesim uchun bepul namuna sayt kerak edi.',
    },
    game: {
      alt: 'Troop Crates reklama rasmi: yonayotgan yashik va uning atrofidagi jangchilar',
      altLava: 'Lava Run reklama rasmi: lava ustida sakrayotgan jangchi va uzoqdagi kubok',
      altSecret: 'Secret Troops reklama rasmi: Glitch, Void King va Golden God jangchilari',
    },
    bot: {
      chatLabel: 'Mijozning bot bilan suhbatiga misol',
      chatCaption: 'Suhbat namunasi, botning haqiqiy qoidalari asosida.',
      chat: [
        ['them', 'Salom, sartaroshxonamga sayt kerak edi. Qancha turadi?'],
        ['bot', 'Salom! Telefonda chiroyli ko‘rinadigan bir sahifali sayt 1,5–2,5 mln so‘m, 5–7 kunda tayyor bo‘ladi. Avval bepul namuna ko‘rsataman, yoqsa keyin to‘laysiz.'],
        ['them', 'Zo‘r, roziman. Qanday to‘layman?'],
        ['bot', 'Zo‘r! Hozir o‘zim batafsil yozaman.'],
        ['sys', 'Suhbat Yaxyoga topshirildi. Bot bu chatda 48 soat jim turadi.'],
      ],
    },
    about: {
      title: 'Men haqimda',
      body: [
        'Birinchi saytimni GitHub’ga 2026-yil iyulida joylaganman. To‘rt oydan keyin esa odamlar haqiqatan foydalana oladigan narsalar yaratayotgan edim: hududimdagi bizneslar uchun sahifalar, mijozlar xabarlariga javob beradigan yordamchi va o‘z iqtisodiyotiga ega o‘yin.',
        'Maqsadim o‘sha birinchi sahifadan beri o‘zgarmagan: foydalanish oson va barcha ekranlarda yaxshi ishlaydigan narsalar yaratish. Hozir React, API bilan ishlash va moslashuvchan dizaynni chuqurroq o‘rganyapman, texnik hujjatlarni yaxshiroq tushunish uchun ingliz tilini ham o‘rganyapman.',
      ],
      timeline: [
        ['2026, iyul', 'Birinchi sayt GitHub’da'],
        ['2026, oktabr', 'Junior muhandis sifatida ish boshladim'],
        ['2026, noyabr', 'Troop Crates, Mijoz Bot va to‘rtta biznes namunasi'],
      ],
    },
    skills: {
      title: 'Texnologiyalarim',
      items: [
        ['Veb va interfeyslar', 'Tez yuklanadigan va avvalo telefonda to‘g‘ri ko‘rinadigan sahifalar.', ['HTML', 'CSS', 'JavaScript', 'React', 'React Router', 'Vite', 'Bootstrap']],
        ['Telegram botlar', 'Mijozlarga javob beradigan va kerak bo‘lganda suhbatni odamga topshiradigan yordamchilar.', ['Python', 'python-telegram-bot', 'Gemini API']],
        ['O‘yinlar', 'Roblox uchun o‘yin tsikllari, o‘yin iqtisodiyoti va server mantig‘i.', ['Roblox Studio', 'Luau']],
        ['Vositalar', 'Versiyalarni boshqarish va ishni internetga chiqarish.', ['Git', 'GitHub', 'GitHub Pages']],
      ],
    },
    contact: {
      title: 'Shunchaki salom deng.',
      before: 'Shunchaki',
      after: 'deng',
      lede: 'Telegram orqali yozsangiz, tezroq javob beraman. E-pochtaga ham yozishingiz mumkin.',
      email: 'E-pochta',
    },
    place: 'Samarqand, O‘zbekiston',
    case: {
      back: 'Barcha ishlar',
      role: 'Vazifam',
      year: 'Yil',
      stack: 'Texnologiyalar',
      status: 'Holati',
      try: 'Jonli sahifani sinash',
      open: 'Yangi oynada ochish',
      closeLive: 'Rasmga qaytish',
      desktopAlt: (name) => `${name} sayti kompyuter ekranida`,
      phoneAlt: (name) => `${name} sayti telefonda`,
      liveTitle: (name) => `${name} saytining jonli namunasi`,
      flowTitle: 'Xabar qanday yo‘l bosadi',
      next: 'Keyingi loyiha',
    },
  },
};
