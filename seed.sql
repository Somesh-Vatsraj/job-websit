-- worker/seed.sql
-- Seed demo data for the platform

-- Insert sample jobs
INSERT OR IGNORE INTO posts (
  type, title, slug, company_name, category, description, content,
  image_url, salary_min, salary_max, currency, work_mode, location,
  experience, skills, tags, featured, trending, published, created_at
) VALUES
(
  'job',
  'Senior Remote Full-Stack Developer',
  'senior-remote-full-stack-developer',
  'TechCorp Inc.',
  'Technology',
  'Join our distributed team building the next generation of SaaS products.',
  'We are looking for a Senior Full-Stack Developer with 5+ years of experience. You will be responsible for architecting and building scalable web applications using React, Node.js, and TypeScript.',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop',
  90000,
  140000,
  '$',
  'Remote',
  'Global',
  '5+ years',
  'React, Node.js, TypeScript, PostgreSQL, AWS',
  'remote, full-stack, senior, react, node',
  1,
  1,
  1,
  datetime('now', '-2 days')
),
(
  'job',
  'Product Marketing Manager',
  'product-marketing-manager',
  'GrowthLabs',
  'Marketing',
  'Drive go-to-market strategy for our remote work platform.',
  'We need a Product Marketing Manager to lead our GTM efforts, create compelling narratives, and drive user acquisition.',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop',
  70000,
  95000,
  '$',
  'Remote',
  'US',
  '3+ years',
  'Marketing, Product Management, SaaS',
  'marketing, product, saas, remote',
  0,
  0,
  1,
  datetime('now', '-5 days')
),
(
  'job',
  'UI/UX Designer - Remote',
  'ui-ux-designer-remote',
  'DesignStudio',
  'Design',
  'Shape the future of remote work tools with beautiful, intuitive design.',
  'We are looking for a UI/UX Designer who can turn complex problems into elegant solutions. Experience with Figma and design systems is a must.',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
  65000,
  85000,
  '$',
  'Remote',
  'Global',
  '2+ years',
  'Figma, UI/UX, Design Systems, Prototyping',
  'design, ui, ux, remote, figma',
  0,
  0,
  1,
  datetime('now', '-1 day')
);

-- Insert sample news
INSERT OR IGNORE INTO posts (
  type, title, slug, category, description, content,
  image_url, source_name, source_url, tags, featured, trending, published, created_at
) VALUES
(
  'news',
  'AI in Recruitment: The Future of Hiring',
  'ai-in-recruitment-future-of-hiring',
  'AI',
  'How artificial intelligence is transforming the recruitment landscape.',
  'Artificial intelligence is revolutionizing how companies find and hire talent. From resume screening to candidate matching, AI tools are making recruitment faster and more efficient.',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop',
  'TechCrunch',
  'https://techcrunch.com/ai-recruitment',
  'ai, recruitment, future, technology',
  1,
  1,
  1,
  datetime('now', '-3 days')
),
(
  'news',
  'Remote Work Trends 2026: What\'s Next?',
  'remote-work-trends-2026',
  'Work From Home',
  'The future of remote work is evolving. Here are the key trends to watch.',
  'As we move into 2026, remote work is becoming more sophisticated. Companies are adopting hybrid models, investing in virtual collaboration tools, and rethinking office spaces.',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
  'Forbes',
  'https://forbes.com/remote-work-trends',
  'remote, work, trends, 2026, hybrid',
  1,
  0,
  1,
  datetime('now', '-7 days')
),
(
  'news',
  'The Rise of Freelancing: A New Era of Work',
  'rise-of-freelancing-new-era',
  'Freelancing',
  'More professionals are choosing freelancing over traditional employment.',
  'The gig economy is booming. With the rise of digital platforms and remote work, freelancing has become a viable and attractive career path for millions.',
  'https://images.unsplash.com/photo-1516257984-2e47e2acc9e3?w=600&h=400&fit=crop',
  'The Economist',
  'https://economist.com/freelancing-rise',
  'freelancing, gig-economy, remote',
  0,
  0,
  1,
  datetime('now', '-10 days')
);