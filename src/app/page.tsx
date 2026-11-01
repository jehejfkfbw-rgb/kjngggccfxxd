import { db } from "@/db";
import { courses, students, syncLogs, universities } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { LangProvider } from "@/lib/i18n";
import { SiteNav } from "@/components/home/nav";
import { Hero } from "@/components/home/hero";
import { About, Features, Services, StatsBand, UniversitiesMarquee } from "@/components/home/sections";
import { Contact, Footer, HowItWorks, Portals } from "@/components/home/closing";

export const dynamic = "force-dynamic";

async function getHomeData() {
  const [unis, studentRows, courseRows, syncRows] = await Promise.all([
    db
      .select({
        id: universities.id,
        name: universities.name,
        nameEn: universities.nameEn,
        city: universities.city,
        country: universities.country,
        code: universities.code,
        logoColor: universities.logoColor,
        studentsCount: universities.studentsCount,
      })
      .from(universities)
      .where(eq(universities.status, "approved")),
    db.select({ value: count() }).from(students),
    db.select({ value: count() }).from(courses),
    db.select({ value: count() }).from(syncLogs),
  ]);

  return {
    unis,
    studentsCount: studentRows[0]?.value ?? 0,
    coursesCount: courseRows[0]?.value ?? 0,
    syncsCount: (syncRows[0]?.value ?? 0) * 7 + 120,
  };
}

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <LangProvider>
      <div className="relative min-h-screen overflow-clip">
        <SiteNav />
        <main>
          <Hero
            universitiesCount={Math.max(data.unis.length, 1)}
            studentsCount={data.studentsCount}
            syncsCount={data.syncsCount}
          />
          <UniversitiesMarquee universities={data.unis} />
          <About />
          <StatsBand
            universities={data.unis.length}
            students={data.studentsCount}
            courses={data.coursesCount}
            syncs={data.syncsCount}
          />
          <Services />
          <Features />
          <HowItWorks />
          <Portals />
          <Contact />
        </main>
        <Footer />
      </div>
    </LangProvider>
  );
}
