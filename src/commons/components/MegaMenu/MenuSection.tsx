import { AppNavLink } from "@/commons/models/AppNavLink.type";
import { Badge, Text, UnstyledButton } from "@mantine/core";

interface MenuSectionProps {
  title: string;
  description: string;
  navlinks: AppNavLink[];
  modulePrefix: string;
  onNavigate: (href: string, modulePrefix?: string) => void;
  searchQuery: string;
}

export function MenuSection({
  title,
  description,
  navlinks,
  modulePrefix,
  onNavigate,
  searchQuery,
}: MenuSectionProps) {
  const filterNavlinks = (links: AppNavLink[]): AppNavLink[] => {
    if (!searchQuery) return links;

    return links.filter((link) => {
      const matchesLabel = link.label
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const hasMatchingChildren = link.children?.some((child) =>
        child.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return matchesLabel || hasMatchingChildren;
    });
  };

  const filteredNavlinks = filterNavlinks(navlinks);

  if (searchQuery && filteredNavlinks.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Text fw={600} size="md" c="dark.7">
          {title}
        </Text>
        <Text size="xs" c="gray.6">
          {description}
        </Text>
      </div>

      <div className="flex flex-col gap-4 ">
        {filteredNavlinks.map((link) => (
          <div key={link.label}>
            <button
              onClick={() => link.href && onNavigate(link.href, modulePrefix)}
            >
              <div className="flex items-center gap-2">
                <Text size="sm" fw={500}>
                  {link.label}
                </Text>
                {link.children && (
                  <Badge size="xs" color="blue" variant="light">
                    {link.children.length}
                  </Badge>
                )}
              </div>
            </button>

            {link.children && (
              <div className="flex flex-col gap-1">
                {link.children.map((child) => {
                  if (
                    searchQuery &&
                    !child.label
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  ) {
                    return null;
                  }

                  return (
                    <UnstyledButton
                      key={child.label}
                      onClick={() => {
                        const childHref = link.href
                          ? `${link.href}/${child.href}`
                          : child.href;
                        onNavigate(childHref!, modulePrefix);
                      }}
                    >
                      <Text size="xs" className="hover:underline">
                        {child.label}
                      </Text>
                    </UnstyledButton>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
