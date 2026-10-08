/** @type {import('next').NextConfig} */
const nextConfig = {
  // Old WordPress URLs still indexed by Google -> nearest new page.
  async redirects() {
    const to = (destination, ...sources) =>
      sources.map((source) => ({ source, destination, permanent: true }));
    return [
      ...to("/about", "/about-us"),
      ...to("/contact", "/contact-us"),
      ...to("/blog", "/blogs", "/:year(\\d{4})/:rest*"),
      ...to("/courses", "/career", "/services", "/service/:slug*"),
      ...to(
        "/",
        "/home",
        "/faq",
        "/fashion",
        "/project-grid",
        "/project-masonary",
        "/product/:slug*",
        "/shop",
        "/cart",
        "/checkout",
        "/my-account",
        "/feed",
        "/comments/feed",
      ),
    ];
  },
};

export default nextConfig;
