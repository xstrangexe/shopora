/**
 * ZR Express pickup offices (Stop Desk), the shop's only carrier.
 *
 * Copied from ZR Express's own office list, https://www.zrexpress.net/bureaux,
 * on 2026-10-27: 80 offices in 54 wilayas. When ZR Express opens or closes an
 * office, change this list; an order keeps the office name it was placed with.
 *
 * Wilaya names are spelled the way the shop's delivery prices spell them
 * (no accents), so a buyer's wilaya finds its offices directly. The id is only
 * this list's own number, stored with the order next to the office name.
 */
export type ZrOffice = { id: number; wilaya: string; name: string; commune: string };

const ZR_OFFICES: readonly ZrOffice[] = [
  { id: 1, wilaya: "Adrar", name: "مكتب أدرار", commune: "Adrar" },
  { id: 2, wilaya: "Chlef", name: "مكتب الشلف", commune: "Chlef" },
  { id: 3, wilaya: "Chlef", name: "مكتب تنس", commune: "Tenes" },
  { id: 4, wilaya: "Laghouat", name: "مكتب الأغواط", commune: "Laghouat" },
  { id: 5, wilaya: "Oum El Bouaghi", name: "مكتب عين البيضاء", commune: "Ain Beida" },
  { id: 6, wilaya: "Oum El Bouaghi", name: "مكتب أم بواقي", commune: "Oum El Bouaghi" },
  { id: 7, wilaya: "Batna", name: "مكتب باتنة", commune: "Batna" },
  { id: 8, wilaya: "Bejaia", name: "مكتب أقبو", commune: "Akbou" },
  { id: 9, wilaya: "Bejaia", name: "مكتب بجاية", commune: "Bejaia" },
  { id: 10, wilaya: "Biskra", name: "مكتب بسكرة", commune: "Biskra" },
  { id: 11, wilaya: "Bechar", name: "مكتب بشار", commune: "Bechar" },
  { id: 12, wilaya: "Blida", name: "مكتب البليدة", commune: "Blida" },
  { id: 13, wilaya: "Blida", name: "مكتب بوقرة", commune: "Bougara" },
  { id: 14, wilaya: "Blida", name: "مكتب موزاية", commune: "Mouzaia" },
  { id: 15, wilaya: "Bouira", name: "مكتب البويرة", commune: "Bouira" },
  { id: 16, wilaya: "Tamanrasset", name: "مكتب تامنراست", commune: "Tamanrasset" },
  { id: 17, wilaya: "Tebessa", name: "مكتب تبسة", commune: "Tebessa" },
  { id: 18, wilaya: "Tlemcen", name: "مكتب تلمسان", commune: "Tlemcen" },
  { id: 19, wilaya: "Tiaret", name: "مكتب تيارت", commune: "Tiaret" },
  { id: 20, wilaya: "Tizi Ouzou", name: "مكتب تيزي وزو", commune: "Tizi-Ouzou" },
  { id: 21, wilaya: "Alger", name: "مكتب براقي", commune: "Baraki" },
  { id: 22, wilaya: "Alger", name: "مكتب بئرخادم", commune: "Birkhadem" },
  { id: 23, wilaya: "Alger", name: "مكتب بئرتوتة", commune: "Bir Touta" },
  { id: 24, wilaya: "Alger", name: "مكتب برج الكيفان", commune: "Bordj El Kiffan" },
  { id: 25, wilaya: "Alger", name: "مكتب شراقة", commune: "Cheraga" },
  { id: 26, wilaya: "Alger", name: "مكتب القبة", commune: "Kouba" },
  { id: 27, wilaya: "Alger", name: "مكتب الجمهورية", commune: "Les Eucalyptus" },
  { id: 28, wilaya: "Alger", name: "مكتب أولاد فايت", commune: "Ouled Fayet" },
  { id: 29, wilaya: "Alger", name: "مكتب رغاية", commune: "Reghaia" },
  { id: 30, wilaya: "Djelfa", name: "مكتب الجلفة", commune: "Djelfa" },
  { id: 31, wilaya: "Jijel", name: "مكتب جيجل", commune: "Jijel" },
  { id: 32, wilaya: "Jijel", name: "مكتب الطاهير", commune: "Taher" },
  { id: 33, wilaya: "Setif", name: "مكتب العلمة", commune: "El Eulma" },
  { id: 34, wilaya: "Setif", name: "مكتب سطيف", commune: "Setif" },
  { id: 35, wilaya: "Saida", name: "مكتب سعيدة", commune: "Saida" },
  { id: 36, wilaya: "Skikda", name: "مكتب سكيكدة", commune: "Skikda" },
  { id: 37, wilaya: "Sidi Bel Abbes", name: "مكتب سيدي بلعباس", commune: "Sidi Bel-Abbes" },
  { id: 38, wilaya: "Annaba", name: "مكتب عنابة", commune: "Annaba" },
  { id: 39, wilaya: "Annaba", name: "مكتب البوني", commune: "El Bouni" },
  { id: 40, wilaya: "Guelma", name: "مكتب قالمة", commune: "Guelma" },
  { id: 41, wilaya: "Constantine", name: "مكتب قسنطينة", commune: "Constantine" },
  { id: 42, wilaya: "Constantine", name: "مكتب المنظر الجميل", commune: "Constantine" },
  { id: 43, wilaya: "Constantine", name: "مكتب زواغي", commune: "Constantine" },
  { id: 44, wilaya: "Constantine", name: "مكتب المدينة الجديدة", commune: "Constantine" },
  { id: 45, wilaya: "Medea", name: "مكتب المدية", commune: "Medea" },
  { id: 46, wilaya: "Mostaganem", name: "مكتب مستغانم", commune: "Mostaganem" },
  { id: 47, wilaya: "M'Sila", name: "مكتب بوسعادة", commune: "Bou Saada" },
  { id: 48, wilaya: "M'Sila", name: "مكتب مسيلة", commune: "M'sila" },
  { id: 49, wilaya: "Mascara", name: "مكتب معسكر", commune: "Mascara" },
  { id: 50, wilaya: "Ouargla", name: "مكتب حاسي مسعود", commune: "Hassi Messaoud" },
  { id: 51, wilaya: "Ouargla", name: "مكتب ورقلة", commune: "Ouargla" },
  { id: 52, wilaya: "Oran", name: "مكتب المرشد", commune: "Oran" },
  { id: 53, wilaya: "Oran", name: "مكتب مارافال", commune: "Oran" },
  { id: 54, wilaya: "Oran", name: "مكتب كاناستال", commune: "Oran" },
  { id: 55, wilaya: "El Bayadh", name: "مكتب البيض", commune: "El Bayadh" },
  { id: 56, wilaya: "Bordj Bou Arreridj", name: "مكتب برج بوعريريج", commune: "B. B. Arreridj" },
  { id: 57, wilaya: "Boumerdes", name: "مكتب برج منايل", commune: "Bordj Menaiel" },
  { id: 58, wilaya: "Boumerdes", name: "مكتب بومرداس", commune: "Boumerdes" },
  { id: 59, wilaya: "Boumerdes", name: "مكتب دلس", commune: "Dellys" },
  { id: 60, wilaya: "El Tarf", name: "مكتب الطارف", commune: "El Tarf" },
  { id: 61, wilaya: "Tissemsilt", name: "مكتب تيسمسيلت", commune: "Tissemsilt" },
  { id: 62, wilaya: "El Oued", name: "مكتب الوادي", commune: "El-Oued" },
  { id: 63, wilaya: "Khenchela", name: "مكتب خنشلة", commune: "Khenchela" },
  { id: 64, wilaya: "Souk Ahras", name: "مكتب سوق أهراس", commune: "Souk Ahras" },
  { id: 65, wilaya: "Tipaza", name: "مكتب القليعة", commune: "Kolea" },
  { id: 66, wilaya: "Tipaza", name: "مكتب تيبازة", commune: "Tipaza" },
  { id: 67, wilaya: "Mila", name: "مكتب ميلة", commune: "Mila" },
  { id: 68, wilaya: "Ain Defla", name: "مكتب عين الدفلة", commune: "Ain-Defla" },
  { id: 69, wilaya: "Naama", name: "مكتب النعامة", commune: "Mecheria" },
  { id: 70, wilaya: "Ain Temouchent", name: "مكتب عين تموشنت", commune: "Ain Temouchent" },
  { id: 71, wilaya: "Ghardaia", name: "مكتب غرداية", commune: "Ghardaia" },
  { id: 72, wilaya: "Relizane", name: "مكتب غيليزان", commune: "Relizane" },
  { id: 73, wilaya: "Timimoun", name: "مكتب تيميمون", commune: "Timimoun" },
  { id: 74, wilaya: "Ouled Djellal", name: "مكتب أولاد جلال", commune: "Ouled Djellal" },
  { id: 75, wilaya: "Beni Abbes", name: "مكتب بني عباس", commune: "Beni-Abbes" },
  { id: 76, wilaya: "In Salah", name: "مكتب عين صالح", commune: "Ain Salah" },
  { id: 77, wilaya: "In Guezzam", name: "مكتب عين قزام", commune: "In Guezzam" },
  { id: 78, wilaya: "Touggourt", name: "مكتب تقرت", commune: "Touggourt" },
  { id: 79, wilaya: "El M'Ghair", name: "مكتب المغير", commune: "Djamaa" },
  { id: 80, wilaya: "El Meniaa", name: "مكتب المنيعة", commune: "El Meniaa" },
];

const key = (wilaya: string) =>
  wilaya
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");

/** The ZR Express offices in a wilaya, in the order ZR Express lists them. */
export function zrOfficesIn(wilaya: string): ZrOffice[] {
  const wanted = key(wilaya);
  return ZR_OFFICES.filter((office) => key(office.wilaya) === wanted);
}
