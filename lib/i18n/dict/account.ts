import type { Dict } from "../index";

/** The account page. */
export const account = {
  en: {
    title: "My account",
    signedOutTitle: "You're not signed in",
    signedOutBody: "Sign in with the demo account to see sample orders, a scheme passbook and appointments.",
    useDemo: "Use demo account",
    profile: "Profile",
    name: "Name",
    phone: "Mobile number",

    orders: "Orders",
    ordersEmpty: "No orders yet.",
    ordersShop: "Browse jewellery",
    orderCustom: "Custom design",
    orderPieces: "{n} items",

    passbook: "Gold scheme passbook",
    planName: "{monthly} a month",
    planProgress: "{paid} of {months} instalments paid",
    planNext: "Next instalment due {date}",
    planDone: "All instalments paid",
    planMaturity: "Maturity value {amount}",
    planOpen: "Open scheme",
    planEmpty: "You haven't joined the gold savings scheme yet.",
    planJoin: "See the scheme",
    digi: "Digi gold balance",
    digiGrams: "{g} g",

    appts: "Appointments",
    apptsEmpty: "No appointments booked.",
    apptSell: "Sell old gold",
    apptRelease: "Gold release",
    apptGrams: "{g} g",

    signOut: "Sign out",
    reset: "Reset demo",
    resetNote: "Reset clears the cart, orders, passbook and appointments saved in this browser.",
  },
  ta: {
    title: "என் கணக்கு",
    signedOutTitle: "நீங்கள் உள்நுழையவில்லை",
    signedOutBody: "மாதிரி ஆர்டர்கள், சேமிப்பு திட்ட புத்தகம், சந்திப்புகளைப் பார்க்க டெமோ கணக்கில் உள்நுழையுங்கள்.",
    useDemo: "டெமோ கணக்கைப் பயன்படுத்து",
    profile: "விவரங்கள்",
    name: "பெயர்",
    phone: "மொபைல் எண்",

    orders: "ஆர்டர்கள்",
    ordersEmpty: "இன்னும் ஆர்டர்கள் இல்லை.",
    ordersShop: "நகைகளைப் பாருங்கள்",
    orderCustom: "கஸ்டம் டிசைன்",
    orderPieces: "{n} நகைகள்",

    passbook: "தங்க சேமிப்பு திட்ட புத்தகம்",
    planName: "மாதம் {monthly}",
    planProgress: "{months} தவணைகளில் {paid} செலுத்தப்பட்டது",
    planNext: "அடுத்த தவணை {date} அன்று",
    planDone: "அனைத்து தவணைகளும் செலுத்தப்பட்டன",
    planMaturity: "முதிர்வு மதிப்பு {amount}",
    planOpen: "திட்டத்தைத் திற",
    planEmpty: "நீங்கள் இன்னும் தங்க சேமிப்பு திட்டத்தில் சேரவில்லை.",
    planJoin: "திட்டத்தைப் பாருங்கள்",
    digi: "டிஜி தங்க இருப்பு",
    digiGrams: "{g} கி",

    appts: "சந்திப்புகள்",
    apptsEmpty: "சந்திப்புகள் எதுவும் இல்லை.",
    apptSell: "பழைய தங்கம் விற்க",
    apptRelease: "அடகு நகை மீட்பு",
    apptGrams: "{g} கி",

    signOut: "வெளியேறு",
    reset: "டெமோவை மீட்டமை",
    resetNote: "மீட்டமைத்தால் இந்த உலாவியில் உள்ள கூடை, ஆர்டர்கள், புத்தகம், சந்திப்புகள் அழியும்.",
  },
} satisfies Dict;
