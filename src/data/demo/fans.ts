import type { Fan } from '@/types/models';

const nigerianNames = [
  'Amaka Okafor', 'Emeka Nwosu', 'Chidinma Eze', 'Adewale Ogundimu', 'Fatima Aliyu',
  'Seun Adebayo', 'Ngozi Adeyemi', 'Biodun Ogunleye', 'Aisha Mohammed', 'Kelechi Obi',
  'Tunde Adeleke', 'Chinonso Dike', 'Precious Okoye', 'Yetunde Bello', 'Mustapha Lawal',
  'Ifunanya Ugwu', 'Chukwuemeka Eze', 'Adaeze Obi', 'Babatunde Fashola', 'Nkechi Okafor',
  'Olumide Adeyemi', 'Josephine Nwachukwu', 'Rasheed Afolabi', 'Chiamaka Igwe', 'Godwin Obi',
  'Obiageli Nweke', 'Dapo Afolabi', 'Uchenna Eze', 'Halima Umar', 'Emmanuel Okonkwo',
  'Blessing Eze', 'Taiwo Olawale', 'Kehinde Oladele', 'Ebere Nwachukwu', 'Hakeem Balogun',
  'Chioma Okonkwo', 'Samuel Adeyemi', 'Juliet Nwankwo', 'Kwame Asante', 'Adunola Olatunji',
  'Musa Ibrahim', 'Tosin Olajide', 'Ejiro Akpoveta', 'Nneka Chukwu', 'Ibrahim Suleiman',
  'Temitope Adeyinka', 'Uzoma Nwosu', 'Sade Adeola', 'Fidelis Okafor', 'Grace Ndukwe',
  'Olarinde Adesanya', 'Patience Oguike', 'Victor Okonkwo', 'Zainab Sanni', 'Oluchukwu Eze',
  'Ayokunle Adewumi', 'Ijeoma Obi', 'Damilola Ogunyemi', 'Kabiru Musa', 'Chibuike Eze',
  'Folake Adeyemo', 'Nnamdi Okeke', 'Adaora Okonkwo', 'Obinna Nweke', 'Esther Oluwaseun',
  'Omotunde Bamidele', 'Ifeanyi Okafor', 'Ronke Adeoti', 'Chima Obi', 'Abimbola Olawale',
  'Kenechukwu Eze', 'Bunmi Adeyemi', 'Okechukwu Nwosu', 'Modupe Adesola', 'Nonso Okafor',
  'Bimpe Adeyinka', 'Ekene Obi', 'Adenike Olatunji', 'Ikenna Okereke', 'Toyin Babatunde',
  'Eze Chibueze', 'Funmilayo Adekunle', 'Chukwudi Okeke', 'Ama Eze', 'Lanre Adewale',
  'Oghenekaro Efemwonei', 'Simbiat Abubakar', 'Olu Oladipo', 'Nkiruka Ihejirika', 'Ahmed Garba',
  'Adaeze Nwofor', 'Rotimi Olatunji', 'Bola Adeyemi', 'Uchechukwu Eze', 'Amina Yusuf',
  'Chinyere Okafor', 'Olumuyiwa Adebayo', 'Gbenga Olatunde', 'Priscilla Nwachukwu', 'Yusuf Aliyu',
];

export const DEMO_FANS: Fan[] = nigerianNames.map((name, i) => {
  const id = `f${i + 1}`;
  const username = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  const dropsBalance = Math.floor(Math.random() * 50_000);
  const totalSpent = Math.floor(Math.random() * 200_000) + 500;
  const artistsFollowed = Math.floor(Math.random() * 50) + 1;
  const postsLiked = Math.floor(Math.random() * 2000) + 10;
  const statuses = ['active', 'active', 'active', 'active', 'suspended'] as const;
  const status = statuses[Math.floor(Math.random() * statuses.length)];

  const joinDate = new Date('2024-01-01');
  joinDate.setDate(joinDate.getDate() + Math.floor(Math.random() * 455));

  return {
    id,
    name,
    username: `@${username}`,
    email: `${username}@gmail.com`,
    avatar: `https://picsum.photos/seed/fan${i + 1}/100/100`,
    dropsBalance,
    totalSpent,
    artistsFollowed,
    postsLiked,
    status,
    joinedAt: joinDate.toISOString(),
  };
});
