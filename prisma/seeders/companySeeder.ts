import type { Seeder } from '../seed';
import { COMPANY_CONFIG, TEAM_MEMBERS } from './data/company';

// Short name, role and map position for each office in data/company.ts, in the same order.
export const OFFICE_DETAILS = [
  { name: { fa: 'استانبول', en: 'Istanbul', tr: 'İstanbul' }, role: { fa: 'دفتر مرکزی ترکیه', en: 'Turkey head office', tr: 'Türkiye merkez ofisi' }, longitude: 28.98, latitude: 41.01 },
  { name: { fa: 'تهران', en: 'Tehran', tr: 'Tahran' }, role: { fa: 'دفتر ترانزیت و کارگو', en: 'Transit and cargo office', tr: 'Transit ve kargo ofisi' }, longitude: 51.39, latitude: 35.69 },
  { name: { fa: 'تبریز', en: 'Tabriz', tr: 'Tebriz' }, role: { fa: 'هماهنگی مرزی و گمرک', en: 'Border and customs coordination', tr: 'Sınır ve gümrük koordinasyonu' }, longitude: 46.29, latitude: 38.08 },
];

export const companySeeder: Seeder = async (db) => {
  if (!(await db.office.count())) {
    await db.office.createMany({
      data: COMPANY_CONFIG.offices.map((office, index) => ({
        ...OFFICE_DETAILS[index],
        country: office.country,
        address: office.address,
        phones: office.phones,
        email: office.email,
        workingHours: office.workingHours,
        timeZone: office.schedule.timeZone,
        openHour: office.schedule.openHour,
        closeHour: office.schedule.closeHour,
        closedWeekdays: office.schedule.closedWeekdays,
        sortOrder: index + 1,
      })),
    });
  }

  if (!(await db.socialLink.count())) {
    await db.socialLink.createMany({
      data: COMPANY_CONFIG.socials.map((social, index) => ({
        platform: social.platform,
        label: social.label,
        url: social.url,
        icon: social.iconName,
        sortOrder: index + 1,
      })),
    });
  }

  if (!(await db.teamMember.count())) {
    await db.teamMember.createMany({
      data: TEAM_MEMBERS.map((member, index) => ({
        name: member.name,
        role: member.role,
        specialty: member.specialty,
        department: member.department,
        image: member.image,
        sortOrder: index + 1,
      })),
    });
  }
};
