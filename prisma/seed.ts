import { prisma } from "../src/lib/db";

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\+/g, "plus")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type SeedLanguage = {
  name: string;
  icon: string;
  categories: string[];
  topics: string[];
};

const languages: SeedLanguage[] = [
  {
    name: "HTML",
    icon: "📄",
    categories: ["frontend"],
    topics: [
      "Introduction",
      "Editors",
      "Basic",
      "Elements",
      "Attributes",
      "Headings",
      "Paragraphs",
      "Styles",
      "Formatting",
      "Quotations",
      "Comments",
      "Colors",
      "CSS",
      "Links",
      "Images",
      "Tables",
      "Lists",
      "Block & Inline",
      "Div",
      "Classes",
      "Id",
      "Buttons",
      "Iframes",
      "JavaScript",
      "Forms",
      "Canvas",
      "SVG",
      "Video",
      "Audio",
      "Web APIs",
      "Geolocation",
      "Web Storage"
    ]
  },
  {
    name: "CSS",
    icon: "🎨",
    categories: ["frontend"],
    topics: [
      "Selectors",
      "Specificity",
      "Box Model",
      "Flexbox",
      "Grid",
      "Positioning",
      "Responsive Design",
      "Media Queries",
      "Typography",
      "Colors",
      "Transitions",
      "Animations",
      "Pseudo-classes",
      "Pseudo-elements",
      "Variables",
      "Cascade",
      "Layout Debugging",
      "Accessibility"
    ]
  },
  {
    name: "JavaScript",
    icon: "🟨",
    categories: ["frontend", "backend"],
    topics: [
      "Introduction",
      "Where To",
      "Output",
      "Syntax",
      "Statements",
      "Comments",
      "Variables",
      "Let",
      "Const",
      "Data Types",
      "Operators",
      "If Else",
      "Loops",
      "Strings",
      "Numbers",
      "Functions",
      "Objects",
      "Scope",
      "Dates",
      "Arrays",
      "Sets",
      "Maps",
      "Math",
      "RegExp",
      "Errors",
      "Debugging",
      "Async",
      "Promises",
      "Async/Await",
      "Classes",
      "Modules",
      "DOM",
      "Events",
      "AJAX",
      "JSON"
    ]
  },
  {
    name: "TypeScript",
    icon: "🔷",
    categories: ["frontend", "backend"],
    topics: [
      "Introduction",
      "Simple Types",
      "Explicit & Inference",
      "Special Types",
      "Arrays",
      "Tuples",
      "Object Types",
      "Enums",
      "Aliases & Interfaces",
      "Union Types",
      "Functions",
      "Casting",
      "Classes",
      "Generics",
      "Utility Types",
      "Null",
      "Type Guards",
      "Conditional Types",
      "Mapped Types",
      "Decorators"
    ]
  },
  {
    name: "React",
    icon: "⚛️",
    categories: ["frontend"],
    topics: [
      "Introduction",
      "JSX",
      "Components",
      "Props",
      "Events",
      "Conditionals",
      "Lists",
      "Forms",
      "useState",
      "useEffect",
      "useContext",
      "useRef",
      "useReducer",
      "useCallback",
      "useMemo",
      "Custom Hooks",
      "CSS Styling",
      "Router",
      "HOC",
      "Suspense"
    ]
  },
  {
    name: "Node.js",
    icon: "🟩",
    categories: ["backend", "devops"],
    topics: [
      "Intro",
      "Modules",
      "NPM",
      "Async",
      "Promises",
      "Async/Await",
      "HTTP Module",
      "File System",
      "Path Module",
      "Events Module",
      "Stream Module",
      "Express.js",
      "REST API Design",
      "Middleware",
      "Authentication",
      "MySQL Integration",
      "MongoDB Integration",
      "WebSockets",
      "Testing",
      "Environment Variables",
      "Deployment",
      "Performance"
    ]
  },
  {
    name: "Python",
    icon: "🐍",
    categories: ["backend", "ai-ml"],
    topics: [
      "Intro",
      "Syntax",
      "Output",
      "Comments",
      "Variables",
      "Data Types",
      "Numbers",
      "Casting",
      "Strings",
      "Booleans",
      "Operators",
      "Lists",
      "Tuples",
      "Sets",
      "Dictionaries",
      "If Else",
      "While Loops",
      "For Loops",
      "Functions",
      "Arrays",
      "Iterators",
      "Modules",
      "Dates",
      "Math",
      "JSON",
      "RegEx",
      "Try Except",
      "OOP",
      "Classes",
      "Inheritance",
      "File Handling",
      "NumPy",
      "Pandas"
    ]
  },
  {
    name: "Java",
    icon: "☕",
    categories: ["backend"],
    topics: [
      "Intro",
      "Syntax",
      "Variables",
      "Data Types",
      "Operators",
      "Strings",
      "Math",
      "If Else",
      "Switch",
      "While Loop",
      "For Loop",
      "Arrays",
      "Methods",
      "OOP",
      "Classes",
      "Constructors",
      "Encapsulation",
      "Inheritance",
      "Polymorphism",
      "Abstraction",
      "Interfaces",
      "Generics",
      "ArrayList",
      "LinkedList",
      "HashMap",
      "Exceptions",
      "File Handling",
      "Threads",
      "Lambda"
    ]
  },
  {
    name: "PHP",
    icon: "🐘",
    categories: ["backend"],
    topics: [
      "Syntax",
      "Variables",
      "Data Types",
      "Strings",
      "Numbers",
      "Math",
      "Constants",
      "Operators",
      "If Else",
      "Switch",
      "Loops",
      "Functions",
      "Arrays",
      "Superglobals",
      "OOP",
      "Classes",
      "Inheritance",
      "Interfaces",
      "Traits",
      "File Handling",
      "Cookies",
      "Sessions",
      "MySQL",
      "JSON",
      "AJAX"
    ]
  },
  {
    name: "SQL",
    icon: "🗃️",
    categories: ["database"],
    topics: [
      "SELECT",
      "WHERE",
      "ORDER BY",
      "AND OR NOT",
      "INSERT INTO",
      "UPDATE",
      "DELETE",
      "Aggregate Functions",
      "LIKE",
      "Wildcards",
      "IN",
      "BETWEEN",
      "Joins",
      "INNER JOIN",
      "LEFT JOIN",
      "RIGHT JOIN",
      "GROUP BY",
      "HAVING",
      "EXISTS",
      "CASE",
      "Constraints",
      "Primary Key",
      "Foreign Key",
      "Indexes",
      "Views",
      "Stored Procedures",
      "SQL Injection"
    ]
  },
  {
    name: "MySQL",
    icon: "🐬",
    categories: ["database"],
    topics: [
      "SELECT",
      "WHERE",
      "ORDER BY",
      "Joins",
      "GROUP BY",
      "HAVING",
      "Constraints",
      "Indexes",
      "Views",
      "Stored Procedures",
      "Triggers",
      "Transactions",
      "Normalization"
    ]
  },
  {
    name: "MongoDB",
    icon: "🍃",
    categories: ["database"],
    topics: [
      "Documents & Collections",
      "CRUD",
      "Filters",
      "Indexes",
      "Aggregation",
      "Schema Design",
      "Transactions",
      "Mongoose Basics",
      "Performance"
    ]
  }
];

async function main() {
  for (const lang of languages) {
    const slug = slugify(lang.name);
    const language = await prisma.language.upsert({
      where: { slug },
      update: {
        name: lang.name,
        icon: lang.icon,
        categories: lang.categories
      },
      create: {
        name: lang.name,
        slug,
        icon: lang.icon,
        categories: lang.categories
      }
    });

    const existing = await prisma.topic.findMany({
      where: { languageId: language.id },
      select: { slug: true }
    });
    const existingSet = new Set(existing.map((t) => t.slug));

    const toCreate = lang.topics
      .map((title, idx) => ({
        title,
        slug: slugify(title),
        order: idx,
        languageId: language.id
      }))
      .filter((t) => !existingSet.has(t.slug));

    if (toCreate.length) {
      await prisma.topic.createMany({ data: toCreate });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

