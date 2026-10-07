import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import { slugify } from "@/lib/utils";
import { User, Category, Course, Lesson } from "@/models";

const V = ["/videos/demo-1.mp4", "/videos/demo-2.mp4", "/videos/demo-3.mp4", "/videos/demo-4.mp4"];

const legacyVideos = ["ForBiggerBlazes", "ForBiggerEscapes", "ForBiggerFun", "ForBiggerJoyrides"].map(
  (n) => `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/${n}.mp4`
);

const courses = [
  { title: "Full-Stack Web Development with Next.js", image: "/thumbs/nextjs.jpg", cat: "Web Development", price: 49,
    description: "Build and deploy a complete web app with the Next.js App Router, MongoDB and authentication.",
    lessons: ["Course overview and setup", "Routing and layouts", "Connecting MongoDB", "Authentication and roles", "Deploying to Vercel"] },
  { title: "JavaScript Essentials", image: "/thumbs/javascript.jpg", cat: "Web Development", price: 0,
    description: "Variables, functions, arrays, objects and the DOM. Everything you need before learning React.",
    lessons: ["Variables and data types", "Functions and scope", "Arrays and objects", "Working with the DOM"] },
  { title: "Python for Data Analysis", image: "/thumbs/python-data.jpg", cat: "Data Science", price: 29,
    description: "Clean, explore and chart real datasets using Pandas and NumPy.",
    lessons: ["Setting up Python", "Pandas DataFrames", "Cleaning messy data", "Charts with Matplotlib"] },
  { title: "SQL Mastery from Zero", image: "/thumbs/sql.jpg", cat: "Data Science", price: 19,
    description: "Write real queries: SELECT, JOIN, GROUP BY and window functions, with practice questions.",
    lessons: ["SELECT and WHERE", "JOINs explained", "GROUP BY and aggregates", "Window functions"] },
  { title: "UI/UX Design Fundamentals", image: "/thumbs/design.jpg", cat: "Design", price: 24,
    description: "Layout, colour, type and how to design screens that people can actually use.",
    lessons: ["How users see a screen", "Colour and contrast", "Typography basics", "Designing in Figma"] },
  { title: "Freelancing 101: Land Your First Client", image: "/thumbs/freelancing.jpg", cat: "Business", price: 0,
    description: "Pick a service, build a small portfolio, write proposals and price your work.",
    lessons: ["Choose your service", "Build a portfolio fast", "Writing a winning proposal"] },
];

export async function GET(req) {
  if (req.nextUrl.searchParams.get("secret") !== (process.env.SEED_SECRET || "lms-seed")) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }
  await connectDB();

  const email = (process.env.ADMIN_EMAIL || "admin@lms.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "Admin@12345";
  const admin = await User.findOne({ email });
  if (!admin) await User.create({ name: "Admin", email, password: await bcrypt.hash(password, 10), role: "admin" });
  else if (admin.role !== "admin") await User.updateOne({ email }, { role: "admin" });

  const cats = {};
  for (const name of [...new Set(courses.map((c) => c.cat))]) {
    const slug = slugify(name);
    cats[name] = await Category.findOneAndUpdate({ slug }, { name, slug }, { upsert: true, new: true });
  }

  let created = 0;
  if ((await Course.countDocuments()) === 0) {
    for (const c of courses) {
      const course = await Course.create({ title: c.title, description: c.description, price: c.price, category: cats[c.cat]._id, thumbnail: c.image });
      await Lesson.insertMany(
        c.lessons.map((title, i) => ({
          course: course._id, title, order: i + 1, videoUrl: V[i % V.length],
          duration: 5 + i * 3, isPreview: i === 0,
          description: `In this lesson: ${title.toLowerCase()}.`,
        }))
      );
      created++;
    }
  }
  for (const c of courses) await Course.updateOne({ title: c.title, thumbnail: "" }, { thumbnail: c.image });
  for (let i = 0; i < legacyVideos.length; i++) await Lesson.updateMany({ videoUrl: legacyVideos[i] }, { videoUrl: V[i] });
  return NextResponse.json({ ok: true, adminEmail: email, coursesCreated: created, note: "Log in with ADMIN_EMAIL and ADMIN_PASSWORD from your env (defaults: admin@lms.com / Admin@12345)." });
}
