import type { Seeder } from '../seed';
import { COMPANY_CONFIG, TEAM_MEMBERS } from './data/company';

// Short name, role and map position for each office in data/company.ts, in the same order.
const OFFICE_DETAILS = [
  { name: 'استانبول', role: 'دفتر مرکزی ترکیه', longitude: 28.98, latitude: 41.01 },
  { name: 'تهران', role: 'دفتر ترانزیت و کارگو', longitude: 51.39, latitude: 35.69 },
  { name: 'تبریز', role: 'هماهنگی مرزی و گمرک', longitude: 46.29, latitude: 38.08 },
];

export const companySeeder: Seeder = async (db) => {
  if (!(await db.office.count())) {
    await db.office.createMany({
      data: COMPANY_CONFIG.offices.map((office, index) => ({
        ...OFFICE_DETAILS[index],
        country: office.country,
        address: office.addressFa,
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
