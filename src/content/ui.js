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
    nav: { work: 'Work', about: 'About', contact: 'Contact' },
    switchLabel: 'O‘zbekcha',
    switchShort: 'O‘Z',
    switchTitle: 'Read this page in Uzbek',
    hero: {
      statement: 'I build websites, Telegram bots and games from Samarkand, Uzbekistan.',
      intro:
        'I’m Yaxyo Nigmatov, a junior engineer. Recent work: demo websites for four local businesses, an AI assistant that answers customers on Telegram, and a Roblox game with its own economy.',
      status: 'Open to new projects',
      primary: 'Message me on Telegram',
      secondary: 'See the work',
    },
    sites: {
      title: 'Websites for local businesses',
      lede: 'Four working demos for a barbershop, an English school, a shopping centre and a hotel in Kattaqo‘rg‘on and Angor. I build the demo first. The owner decides after seeing it.',
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
      lede: 'A Roblox game about opening crates, collecting troops and surviving a lava obstacle course. 18 troops, 5 crates, rebirths, daily streaks and about 2,800 lines of Luau.',
      alt: 'Troop Crates promo art: a glowing crate surrounded by blocky troops, with the words Open, Collect, Survive the Lava',
      altLava: 'Lava Run promo art: a troop jumping between platforms over lava toward a trophy',
      altSecret: 'Secret Troops promo art: Glitch, Void King and Golden God on a glowing stage',
    },
    bot: {
      lede: 'A Telegram assistant that replies to customers in my name and knows when to stop talking. The moment someone wants to agree a deal, it goes quiet and calls me in.',
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
    more: 'Read the case study',
    about: {
      title: 'About',
      body: [
        'I pushed my first website to GitHub in July 2026. Four months later I was building things people can actually use: pages for businesses in my region, an assistant that handles customer messages, and a game with its own economy.',
        'The goal hasn’t changed since that first page: make things that are easy to use and work well on every screen. Right now I’m going deeper into React, APIs and responsive design, and improving my English so I can read technical documentation more easily.',
      ],
      skillsTitle: 'What I work with',
      skills: [
        ['Web', 'HTML, CSS, JavaScript, React, React Router, Vite, Bootstrap'],
        ['Bots', 'Python, python-telegram-bot, Gemini API'],
        ['Games', 'Roblox Studio, Luau'],
        ['Tools', 'Git, GitHub'],
      ],
      timelineTitle: 'So far',
      timeline: [
        ['Jul 2026', 'First website pushed to GitHub'],
        ['Oct 2026', 'Started as a Junior Engineer'],
        ['Nov 2026', 'Troop Crates, Mijoz Bot and four business demos'],
      ],
      photoAlt: 'Portrait of Yaxyo Nigmatov',
    },
    contact: {
      title: 'Let’s talk.',
      lede: 'Telegram is the fastest way to reach me. Email works too.',
      email: 'Email',
    },
    footer: 'Built with React and Vite. Every page is prerendered to static HTML.',
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
    nav: { work: 'Ishlar', about: 'Haqida', contact: 'Aloqa' },
    switchLabel: 'English',
    switchShort: 'EN',
    switchTitle: 'Bu sahifani ingliz tilida o‘qish',
    hero: {
      statement: 'Samarqanddan turib saytlar, Telegram botlar va o‘yinlar yarataman.',
      intro:
        'Men Yaxyo Nigmatov, junior muhandisman. So‘nggi ishlarim: to‘rtta mahalliy biznes uchun namuna saytlar, mijozlarga Telegramda javob beradigan AI yordamchi va o‘z iqtisodiyotiga ega Roblox o‘yini.',
      status: 'Yangi loyihalarga ochiqman',
      primary: 'Telegramda yozish',
      secondary: 'Ishlarni ko‘rish',
    },
    sites: {
      title: 'Mahalliy bizneslar uchun saytlar',
      lede: 'Kattaqo‘rg‘on va Angordagi sartaroshxona, ingliz tili markazi, savdo markazi va mehmonxona uchun to‘rtta ishlaydigan namuna. Avval namunani tayyorlayman, qarorni esa biznes egasi uni ko‘rgandan keyin qabul qiladi.',
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
      lede: 'Yashiklar ochish, jangchilar yig‘ish va lava ustidagi to‘siqlardan o‘tish haqidagi Roblox o‘yini. 18 jangchi, 5 yashik, rebirth, kunlik mukofotlar va 2 800 qatorga yaqin Luau kodi.',
      alt: 'Troop Crates reklama rasmi: yonayotgan yashik va uning atrofidagi jangchilar',
      altLava: 'Lava Run reklama rasmi: lava ustida sakrayotgan jangchi va uzoqdagi kubok',
      altSecret: 'Secret Troops reklama rasmi: Glitch, Void King va Golden God jangchilari',
    },
    bot: {
      lede: 'Mijozlarga mening nomimdan javob beradigan va qachon jim turishni biladigan Telegram yordamchi. Mijoz kelishuvga tayyor bo‘lishi bilan bot to‘xtaydi va meni chaqiradi.',
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
    more: 'Batafsil o‘qish',
    about: {
      title: 'Men haqimda',
      body: [
        'Birinchi saytimni GitHub’ga 2026-yil iyulida joylaganman. To‘rt oydan keyin esa odamlar haqiqatan foydalana oladigan narsalar yaratayotgan edim: hududimdagi bizneslar uchun sahifalar, mijozlar xabarlariga javob beradigan yordamchi va o‘z iqtisodiyotiga ega o‘yin.',
        'Maqsadim o‘sha birinchi sahifadan beri o‘zgarmagan: foydalanish oson va barcha ekranlarda yaxshi ishlaydigan narsalar yaratish. Hozir React, API bilan ishlash va moslashuvchan dizaynni chuqurroq o‘rganyapman, texnik hujjatlarni yaxshiroq tushunish uchun ingliz tilini ham o‘rganyapman.',
      ],
      skillsTitle: 'Ishlatadigan texnologiyalarim',
      skills: [
        ['Veb', 'HTML, CSS, JavaScript, React, React Router, Vite, Bootstrap'],
        ['Botlar', 'Python, python-telegram-bot, Gemini API'],
        ['O‘yinlar', 'Roblox Studio, Luau'],
        ['Vositalar', 'Git, GitHub'],
      ],
      timelineTitle: 'Shu paytgacha',
      timeline: [
        ['2026, iyul', 'Birinchi sayt GitHub’da'],
        ['2026, oktabr', 'Junior muhandis sifatida ish boshladim'],
        ['2026, noyabr', 'Troop Crates, Mijoz Bot va to‘rtta biznes namunasi'],
      ],
      photoAlt: 'Yaxyo Nigmatovning surati',
    },
    contact: {
      title: 'Keling, gaplashamiz.',
      lede: 'Telegram orqali yozsangiz, tezroq javob beraman. E-pochtaga ham yozishingiz mumkin.',
      email: 'E-pochta',
    },
    footer: 'React va Vite bilan qurilgan. Har bir sahifa oldindan statik HTML qilib tayyorlanadi.',
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
